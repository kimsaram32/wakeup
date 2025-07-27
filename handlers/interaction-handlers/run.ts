import { EmbedBuilder } from "discord.js";
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
    const { adminRoleId, targetRoleId } =
      // deno-lint-ignore no-explicit-any
      (await guildSettings.get(guildId)) ?? ({} as any);
    if (!adminRoleId || !targetRoleId) {
      interaction.reply("설정이 필요합니다");
      return;
    }

    const userIds = await voiceChannelUsers.get(guildId);

    await guild.members.fetch();
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

    const participatedMemberIds = await runRecord.getMemberIdsParticipatedToday(
      guildId,
      date,
    );

    const dateFormatter = new Intl.DateTimeFormat("ko", {
      dateStyle: "long"
    });

    interaction.reply({
      embeds: [
        new EmbedBuilder()
          .setTitle(`${dateFormatter.format(date.toPlainDate())} 기상점호`)
          .setDescription(
            participatedMemberIds.map((id) => `- <@${id}>`).join("\n"),
          ),
      ],
    });
  },
};
