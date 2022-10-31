import { CronJob } from "../../../models/CronJob";
import { CronJobRepository } from "../../../repositories/CronJobRepository"


export const cronJobs = async () => {
    const job = new CronJob();
    job.id = "test"
    job.event = "test"
    job.interval = "0 0 */1 * * *"
    await CronJobRepository.create(job)
    await CronJobRepository.save(job)
}