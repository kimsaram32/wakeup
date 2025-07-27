import { redisPromise } from "../utils/redis.ts";

export type VoiceChannelUsers = {
  guildId: string;
  userIds: string[];
};

const toKey = (guildId: string) => `voiceChannel${guildId}`;

export const voiceChannelUsers = {
  async get(guildId: string): Promise<string[]> {
    const redis = await redisPromise;
    return await redis.sMembers(toKey(guildId));
  },

  async add(guildId: string, userId: string): Promise<void> {
    const redis = await redisPromise;
    await redis.sAdd(toKey(guildId), userId);
  },

  async remove(guildId: string, userId: string): Promise<void> {
    const redis = await redisPromise;
    await redis.sRem(toKey(guildId), userId);
  },
};
