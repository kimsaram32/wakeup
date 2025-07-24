import { knex } from "../utils/postgres.ts";

export type RunRecord = {
  guildId: string;
  userId: string;
  date: Temporal.ZonedDateTime;
};

const padded = (x: number) => String(x).padStart(2, "0");

function formatZoneDateTimeToPostgresTimestamp(zdt: Temporal.ZonedDateTime) {
  return [
    `${zdt.year}-${padded(zdt.month)}-${padded(zdt.day)}`,
    `${padded(zdt.hour)}:${padded(zdt.minute)}:${padded(zdt.second)}`,
    zdt.offset,
  ].join(" ");
}

export const runRecord = {
  async getAll(guildId: string): Promise<RunRecord[]> {
    const raw = await knex("run_record")
      .select("user_id", "created_at")
      .where("guild_id", guildId);
    return raw.map((record) => ({
      guildId,
      userId: record.user_id,
      date: record.created_at.toTemporalInstant().toZonedDateTimeISO("Asia/Seoul"),
    }));
  },

  async create(newRecord: RunRecord): Promise<void> {
    await knex("run_record").insert({
      guild_id: newRecord.guildId,
      user_id: newRecord.userId,
      created_at: formatZoneDateTimeToPostgresTimestamp(newRecord.date),
    });
  },

  async createMany(newRecords: RunRecord[]): Promise<void> {
    await knex("run_record").insert(
      newRecords.map((newRecord) => ({
        guild_id: newRecord.guildId,
        user_id: newRecord.userId,
        created_at: formatZoneDateTimeToPostgresTimestamp(newRecord.date),
      })),
    );
  },
};
