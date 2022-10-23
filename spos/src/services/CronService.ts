import { Inject } from 'typedi';
import EventBusService from './EventBusService';
import { CronJob as cron } from 'cron';
import {
  CronJobRepository,
  CronJobRepositoryId,
} from '../repositories/CronJobRepository';
import { CronJob } from '../models/CronJob';
import BaseService from './BaseService';

export enum CronServiceEvents {
  CREATE = 'cron.create',
  UPDATE = 'cron.update',
  DELETE = 'cron.delete',
  START = 'cron.start',
  STOP = 'cron.stop',
  INIT = 'cron.init',
  TRIGGER = 'cron.trigger',
  FAIL = 'cron.fail',
}

class CronService extends BaseService {
  private readonly jobs: { [key: string]: cron } = {};

  constructor(
    @Inject()
    private readonly eventBusService: EventBusService,
    @Inject(CronJobRepositoryId)
    private readonly cronJobRepository: typeof CronJobRepository
  ) {
    super(eventBusService, CronServiceEvents.FAIL);
  }

  async create(id: string, event: string, interval: string): Promise<CronJob> {
    return await this.error(async () => {
      const job = new CronJob();
      job.id = id;
      job.event = event;
      job.interval = interval;

      const res = await this.cronJobRepository.create(job);
      if (!res) return;

      await this.cronJobRepository.save(job);

      await this.setupJob(job);
      await this.eventBusService.emit(CronServiceEvents.CREATE, job);
      return job;
    });
  }

  private async setupJob(job: CronJob) : Promise<boolean> {
    return await this.error(async () => {
      const actual: cron = new cron(job.interval, async () => {
        await this.eventBusService.emit(job.event, job);
      });
      this.jobs[job.id] = actual;
      actual.start();
      return true;
    });
  }

  async init() : Promise<boolean> {
    return await this.error(async () => {
      const jobs = await this.get();
      for (const job of jobs) await this.setupJob(job);
      await this.eventBusService.emit(CronServiceEvents.INIT, jobs);
      return true;
    });
  }

  async remove(id: string) : Promise<boolean> {
    return await this.error(async () => {
      const job = await this.find(id);
      if (!job) return;
      this.jobs[id].stop();
      await this.cronJobRepository.delete(job.id);
      const res = delete this.jobs[id];
      await this.eventBusService.emit(CronServiceEvents.DELETE, job);
      return res;
    });
  }

  async pause(id: string) : Promise<boolean> {
    return await this.error(async () => {
      this.jobs[id].stop();
      await this.eventBusService.emit(CronServiceEvents.STOP, { id });
      return true;
    });
  }

  async restart(id: string) : Promise<boolean> {
    return await this.error(async () => {
      this.jobs[id].start();
      await this.eventBusService.emit(CronServiceEvents.START, { id });
      return true;
    });
  }

  async get(): Promise<CronJob[]> {
    return await this.error(async () => {
      return this.cronJobRepository.find();
    });
  }

  async find(id: string): Promise<CronJob> {
    return await this.error(async () => {
      return this.cronJobRepository.findOne({ where: { id } });
    });
  }

  async trigger(id: string) : Promise<boolean> {
    return await this.error(async () => {
      const job = await this.find(id);
      if (!job) return;
      await this.eventBusService.emit(job.event, job);
      await this.eventBusService.emit(CronServiceEvents.TRIGGER, job);
      return true;
    });
  }
}

export default CronService;
