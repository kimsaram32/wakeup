import { guildSettings } from "../../entities/guild-settings.ts";
import { runRecord } from "../../entities/run-record.ts";
import { voiceChannelUsers } from "../../entities/voice-channel-users.ts";
import { InteractionHandler } from "../types.ts";

export const manualRunInteractionHandler: InteractionHandler = {
  name: "출첵_수동",
  async execute(interaction) {
    const userId = interaction.options.getUser("점호_참여자")!.id;

    const guildId = interaction.guildId;
    if (!guildId) {
      return;
    }
    const guild = await interaction.client.guilds.fetch(guildId);

    const targetMember = await guild.members.fetch(userId);
    const { adminRoleId, targetRoleId } = await guildSettings.get(guildId);

    if (!targetMember.roles.cache.has(targetRoleId)) {
      interaction.reply("점호 참여자가 아닙니다");
      return;
    }

    const date = Temporal.Now.zonedDateTimeISO("Asia/Seoul");

    await runRecord.create({
      guildId,
      userId: userId,
      date,
    });

    interaction.reply("출첵");
  },
};
