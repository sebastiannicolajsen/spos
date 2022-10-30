import { Inject, Service } from 'typedi';
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

export type CronJobData = CronJob & {
  status: boolean;
};

@Service()
class CronService extends BaseService {
  private static readonly jobs: { [key: string]: cron } = {};
  private static readonly jobs_status: { [key: string]: boolean } = {};

  constructor(
    @Inject()
    private readonly eventBusService: EventBusService,
    @Inject(CronJobRepositoryId)
    private readonly cronJobRepository: typeof CronJobRepository
  ) {
    super(eventBusService, CronServiceEvents.FAIL);
  }

  private wrap(job: CronJob): CronJobData {
    return {
      ...job,
      status: CronService.jobs_status[job.id],
    };
  }

  async create(
    id: string,
    event: string,
    interval: string
  ): Promise<CronJobData> {
    return await this.error(async () => {

      if(CronService.jobs[id]) return;

      const job = new CronJob();
      job.id = id;
      job.event = event;
      job.interval = interval;

      const res = await this.cronJobRepository.create(job);
      if (!res) return;

      await this.cronJobRepository.save(job);

      await this.setupJob(job);
      await this.eventBusService.emit(CronServiceEvents.CREATE, job);
      return this.wrap(job);
    });
  }

  private async setupJob(job: CronJob): Promise<boolean> {
    return await this.error(async () => {
      const actual: cron = new cron(job.interval, async () => {
        await this.eventBusService.emit(job.event, job);
      });
      CronService.jobs[job.id] = actual;
      CronService.jobs_status[job.id] = true;
      actual.start();
      return true;
    });
  }

  async init(): Promise<boolean> {
    return await this.error(async () => {
      const jobs = await this.get();
      if(!jobs || jobs.length === 0) return;
      for (const job of jobs) await this.setupJob(job);
      await this.eventBusService.emit(CronServiceEvents.INIT, jobs);
      return true;
    });
  }

  async delete(id: string): Promise<boolean> {
    return await this.error(async () => {
      const job = await this.find(id);
      if (!job) return false;
      CronService.jobs[id].stop();
      await this.cronJobRepository.delete(job.id);
      const res = delete CronService.jobs[id];
      await this.eventBusService.emit(CronServiceEvents.DELETE, job);
      return res;
    });
  }

  async pause(id: string): Promise<boolean> {
    return await this.error(async () => {
      if (!CronService.jobs[id]) return false;
      if (!CronService.jobs_status[id]) return false;
      CronService.jobs[id].stop();
      CronService.jobs_status[id] = false;
      await this.eventBusService.emit(CronServiceEvents.STOP, { id });
      return true;
    });
  }

  async restart(id: string): Promise<boolean> {
    return await this.error(async () => {
      if (!CronService.jobs[id]) return false;
      if (CronService.jobs_status[id]) return false;
      CronService.jobs[id].start();
      CronService.jobs_status[id] = true;
      await this.eventBusService.emit(CronServiceEvents.START, { id });
      return true;
    });
  }

  async update(id: string, toUpdate = { event: null, interval: null }) {
    return await this.error(async () => {
      const job = await this.find(id);
      if (!job) return;
      if (toUpdate.event) job.event = toUpdate.event;
      if (toUpdate.interval) job.interval = toUpdate.interval;
      await this.cronJobRepository.save(job);
      await this.eventBusService.emit(CronServiceEvents.UPDATE, job);
      return job;
    });
  }

  async get(): Promise<CronJobData[]> {
    return await this.error(async () => {
      return (await this.cronJobRepository.find()).map(this.wrap);
    });
  }

  async find(id: string): Promise<CronJobData> {
    return await this.error(async () => {
      return this.wrap(await this.cronJobRepository.findOne({ where: { id } }));
    });
  }

  async trigger(id: string): Promise<boolean> {
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
