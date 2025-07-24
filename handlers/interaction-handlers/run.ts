import { guildSettings } from "../../entities/guild-settings.ts";
import { runRecord } from "../../entities/run-record.ts";
import { voiceChannelUsers } from "../../entities/voice-channel-users.ts";
import { isWeekday } from "../../utils/is-weekday.ts";
import { InteractionHandler } from "../types.ts";

export const runInteractionHandler: InteractionHandler = {
  name: "출첵",
  async execute(interaction) {
    const guildId = interaction.guildId;
    if (!guildId) {
      return;
    }
    const date = Temporal.Now.zonedDateTimeISO("Asia/Seoul");
    if (!isWeekday(date.dayOfWeek)) {
      interaction.reply("점호 가능 날짜가 아닙니다");
      return;
    }

    const guild = await interaction.client.guilds.fetch(guildId);
    // deno-lint-ignore no-explicit-any
    const { adminRoleId, targetRoleId } = await guildSettings.get(guildId) ?? {} as any;
    if (!adminRoleId || !targetRoleId) {
      interaction.reply("설정이 필요합니다");
      return;
    }

    const userIds = await voiceChannelUsers.get(guildId);

    const targetRole = await guild.roles.fetch(targetRoleId);
    if (!targetRole) {
      return;
    }
    const targetUserIds = userIds.filter((userId) =>
      targetRole.members.some((member) => member.user.id === userId),
    );

    await runRecord.createMany(
      targetUserIds.map((userId) => ({ guildId, userId, date })),
    );

    interaction.reply("출첵");
  },
};
