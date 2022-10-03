import { AppDataSource } from "./repositories/data-source"

AppDataSource.initialize().then(async () => {

}).catch(error => console.log(error))
