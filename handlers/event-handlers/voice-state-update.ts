import { voiceChannelUsers } from "../../entities/voice-channel-users.ts";
import { defineEventHandler } from "../types.ts";
import { Events } from "discord.js";

export const voiceStateUpdateEventHandler = defineEventHandler({
  name: Events.VoiceStateUpdate,
  async execute(_, voiceState) {
    const userId = voiceState.member?.user.id;
    if (!userId) {
      return;
    }

    const guildId = voiceState.guild.id;
    const left = !voiceState.channelId;

    if (left) {
      await voiceChannelUsers.remove(guildId, userId);
    } else {
      await voiceChannelUsers.add(guildId, userId);
    }
  },
});
