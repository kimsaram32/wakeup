import { guildSettings } from "../../entities/guild-settings.ts";
import { runRecord } from "../../entities/run-record.ts";
import { voiceChannelUsers } from "../../entities/voice-channel-users.ts";
import { InteractionHandler } from "../types.ts";

export const runInteractionHandler: InteractionHandler = {
  name: "출첵",
  async execute(interaction) {
    const guildId = interaction.guildId;
    if (!guildId) {
      return;
    }
    const guild = await interaction.client.guilds.fetch(guildId);
    const { adminRoleId, targetRoleId } = await guildSettings.get(guildId);

    const userIds = await voiceChannelUsers.get(guildId);
    const members = await guild.members.fetch({ user: userIds });
    const targetMembers = members.filter((member) =>
      member.roles.cache.has(targetRoleId)
    );
    const date = Temporal.Now.zonedDateTimeISO("Asia/Seoul");

    await runRecord.createMany(
      targetMembers.map((member) => ({
        guildId,
        userId: member.user.id,
        date,
      })),
    );

    interaction.reply("출첵");
  },
};
