import { CronJobRepository } from "../../../repositories/CronJobRepository"


export const cronJobs = async () => {
    const cronJob = await CronJobRepository.create({
        id: "test",
        event: "test.no_subscriber",
        interval: "* * */1 * * *"
    })
    await CronJobRepository.save(cronJob)
}