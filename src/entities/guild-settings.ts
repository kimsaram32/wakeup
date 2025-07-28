import { knex } from "../utils/postgres.ts";

export type GuildSettings = {
  id: string;
  targetChannelId: string;
  targetRoleId: string;
  adminRoleId: string;
};

export const guildSettings = {
  async get(guildId: string): Promise<GuildSettings | null> {
    const result = await knex("guild_settings")
      .select("target_channel_id", "target_role_id", "admin_role_id")
      .where("id", guildId)
      .first();

    if (!result) {
      return null;
    }

    return {
      id: guildId,
      targetChannelId: result.target_channel_id,
      targetRoleId: result.target_role_id,
      adminRoleId: result.admin_role_id,
    };
  },

  async update(
    guildId: string,
    updated: Partial<Omit<GuildSettings, "id">>,
  ): Promise<void> {
    const payload = {
      target_channel_id: updated.targetChannelId,
      target_role_id: updated.targetRoleId,
      admin_role_id: updated.adminRoleId,
    };
    if (!Object.values(payload).filter(Boolean).length) {
      return;
    }

    await knex.transaction(async (t) => {
      if ((await t("guild_settings").where("id", guildId)).length) {
        await t("guild_settings").where("id", guildId).update(payload);
      } else {
        await t("guild_settings").insert({ ...payload, id: guildId });
      }
    });
  },
};
