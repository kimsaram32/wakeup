import Knex from "knex";
import { Config } from "../config.ts";

export const knex = Knex({
  client: "pg",
  connection: Config.postgres.url,
  debug: true,
});
