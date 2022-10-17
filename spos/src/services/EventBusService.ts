import { Service } from "typedi"

@Service()
class EventBusService {


    constructor(){
        // setup redis
    }

    async emit (event: string, data: any): Promise<void> {
        console.log({event, data})
    }

}

export default EventBusService
