export type GuildSettings = {
  id: string;
  targetChannelId: string;
  targetRoleId: string;
  adminRoleId: string;
};

export const guildSettings = {
  async get(guildId: string): Promise<GuildSettings> {
    return {
      id: guildId,
      targetChannelId: "foo",
      targetRoleId: "foo",
      adminRoleId: "foo",
    };
  },

  async update(
    guildId: string,
    updated: Partial<Omit<GuildSettings, "id">>,
  ): Promise<void> {
    guildId;
    updated;
  },
};
