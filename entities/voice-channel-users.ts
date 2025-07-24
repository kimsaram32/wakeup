export type VoiceChannelUsers = {
  guildId: string;
  userIds: string[];
};

export const voiceChannelUsers = {
  async get(guildId: string): Promise<string[]> {
    return [];
  },

  async add(guildId: string, userId: string): Promise<void> {},

  async remove(guildId: string, userId: string): Promise<void> {},
};
