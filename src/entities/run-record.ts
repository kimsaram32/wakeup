import { Config } from "../config.ts";
import { knex } from "../utils/postgres.ts";

export type RunRecord = {
  guildId: string;
  userId: string;
  date: Temporal.ZonedDateTime;
};

const padded = (x: number) => String(x).padStart(2, "0");

function formatZoneDateTimeToPostgresDate(zdt: Temporal.ZonedDateTime) {
  return `${zdt.year}-${padded(zdt.month)}-${padded(zdt.day)}`;
}

function formatZoneDateTimeToPostgresTimestamp(zdt: Temporal.ZonedDateTime) {
  return [
    formatZoneDateTimeToPostgresDate(zdt),
    `${padded(zdt.hour)}:${padded(zdt.minute)}:${padded(zdt.second)}`,
    zdt.offset,
  ].join(" ");
}

function postgresDateWithTimezone(expr: string) {
  return `DATE(${expr} AT TIME ZONE '${Config.timezone}')`;
}

export const runRecord = {
  async getAll(guildId: string): Promise<RunRecord[]> {
    const result = await knex("run_record")
      .select("user_id")
      .select(knex.raw(`${postgresDateWithTimezone('created_at')} as date`))
      .where("guild_id", guildId)
      .groupBy("user_id")
      .groupBy(knex.raw(`${postgresDateWithTimezone('created_at')}`));

    return result.map((row: { user_id: string; date: Date }) => ({
      guildId,
      userId: row.user_id,
      date: row.date.toTemporalInstant().toZonedDateTimeISO(Config.timezone),
    }));
  },

  async getMemberIdsParticipatedToday(
    guildId: string,
    date: Temporal.ZonedDateTime,
  ): Promise<string[]> {
    const result = await knex("run_record")
      .select("user_id")
      .where("guild_id", guildId)
      .whereRaw(`${postgresDateWithTimezone('created_at')} = ?`, [
        formatZoneDateTimeToPostgresDate(date),
      ])
      .groupBy("user_id");

    return result.map((row) => row.user_id);
  },

  async create(newRecord: RunRecord): Promise<void> {
    await knex("run_record").insert({
      guild_id: newRecord.guildId,
      user_id: newRecord.userId,
      created_at: formatZoneDateTimeToPostgresTimestamp(newRecord.date),
    });
  },

  async createMany(newRecords: RunRecord[]): Promise<void> {
    if (!newRecords.length) {
      return;
    }

    await knex("run_record").insert(
      newRecords.map((newRecord) => ({
        guild_id: newRecord.guildId,
        user_id: newRecord.userId,
        created_at: formatZoneDateTimeToPostgresTimestamp(newRecord.date),
      })),
    );
  },
};
