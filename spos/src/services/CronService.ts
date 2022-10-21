import { Inject } from "typedi";
import EventBusService from "./EventBusService";
import { CronJob as cron } from "cron";
import { CronJobRepository, CronJobRepositoryId } from "../repositories/CronJobRepository";
import { CronJob } from "../models/CronJob";

export enum CronServiceEvents {
  CREATE = "cron.create",
  UPDATE = "cron.update",
  DELETE = "cron.delete",
  START = "cron.start",
  STOP = "cron.stop",
  INIT = "cron.init",
  TRIGGER = "cron.trigger",
}

class CronService {

  private readonly jobs : {[key: string]: cron} = {};

  constructor(
    @Inject()
    private readonly eventBusService: EventBusService,
    @Inject(CronJobRepositoryId)
    private readonly cronJobRepository: typeof CronJobRepository
  ) {
  }

  async create(id: string, event: string, interval: string) : Promise<CronJob> {
    const job = new CronJob();
    job.id = id;
    job.event = event;
    job.interval = interval;

    const res = await this.cronJobRepository.create(job);
    if(!res) return;

    await this.cronJobRepository.save(job);
    
    await this.setupJob(job);
    await this.eventBusService.emit(CronServiceEvents.CREATE, job);
    return job;
  }

  private async setupJob(job: CronJob){
    const actual : cron = new cron(job.interval, async () => {
      await this.eventBusService.emit(job.event, job);
    })
    this.jobs[job.id] = actual;
    actual.start();
  }

  async init(){
    const jobs = await this.get();
    for(const job of jobs) await this.setupJob(job);
    await this.eventBusService.emit(CronServiceEvents.INIT, jobs);
  }

  async remove(id: string){
    const job = await this.find(id);
    if(!job) return;
    this.jobs[id].stop();
    await this.cronJobRepository.delete(job.id);
    delete this.jobs[id];
    await this.eventBusService.emit(CronServiceEvents.DELETE, job);
  }

  async pause(id: string){
    this.jobs[id].stop();
    await this.eventBusService.emit(CronServiceEvents.STOP, {id});
  }

  async restart(id: string){
    this.jobs[id].start();
    await this.eventBusService.emit(CronServiceEvents.START, {id});
  }

  async get() : Promise<CronJob[]>{
    return this.cronJobRepository.find();
  }

  async find(id: string) : Promise<CronJob> {
    return this.cronJobRepository.findOne({where: {id}});
  }

  async trigger(id: string){
    const job = await this.find(id);
    if(!job) return;
    await this.eventBusService.emit(job.event, job);
    await this.eventBusService.emit(CronServiceEvents.TRIGGER, job);
  }




}

export default CronService;
