import { AppDataSource } from "../repositories/data-source";
import { sellers } from "./sellers/sellers";

// import all seedings


console.log("Connecting to db ...")
AppDataSource.initialize().then(async () => {
    console.log("Seeding database ...")
    sellers()
}).catch(error => console.log(error)).finally(() => {
    console.log("Seeding done.")
})
