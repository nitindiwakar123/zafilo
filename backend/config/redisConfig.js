import { createClient, SCHEMA_FIELD_TYPE } from "redis";
import { config } from "./config.js";

const redisClient = createClient({
    password: config.redisPassword
});

redisClient.on('error', () => {
    console.log("Error while connecting with redis!");
    process.exit(1);
});

await redisClient.connect();

// await redisClient.ft.create(
//   "userIdIdx",
//   {
//     "userId": { type: SCHEMA_FIELD_TYPE.TAG },
//   },
//   {
//     ON: "HASH",
//     PREFIX: "session:",
//   }
// );

export default redisClient;