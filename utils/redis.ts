import { createClient } from "redis";
import { Config } from "../config.ts";

export const redisPromise = createClient({ url: Config.redis.url })
  .on("error", (err) => console.log("Redis Client Error", err))
  .connect();
