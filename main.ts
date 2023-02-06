import { createMedalApi } from "./api.ts";
import { MedalRepository } from "./medal.ts";


console.log("setting up...")
const oakApi = createMedalApi(new MedalRepository())

console.log("starting the api at port 8888")
await oakApi.listen({port: 8888})