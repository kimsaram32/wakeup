import { Config } from "../../config.ts";
import { guildSettings } from "../../entities/guild-settings.ts";
import { runRecord } from "../../entities/run-record.ts";
import { isWeekday } from "../../utils/is-weekday.ts";
import { InteractionHandler } from "../types.ts";

export const manualRunInteractionHandler: InteractionHandler = {
  name: "출첵_수동",
  async execute(interaction) {
    const userId = interaction.options.getUser("점호_참여자")?.id;
    if (!userId) {
      interaction.reply("점호 참여자를 입력해주세요");
      return;
    }

    const guildId = interaction.guildId;
    if (!guildId) {
      return;
    }

    const date = Temporal.Now.zonedDateTimeISO(Config.timezone);
    if (!isWeekday(date.dayOfWeek)) {
      interaction.reply("점호 가능 날짜가 아닙니다");
      return;
    }

    const guild = await interaction.client.guilds.fetch(guildId);

    const { adminRoleId, targetRoleId } = await guildSettings.get(guildId) ??
      // deno-lint-ignore no-explicit-any
      {} as any;
    if (!adminRoleId || !targetRoleId) {
      interaction.reply("설정이 필요합니다");
      return;
    }

    const targetRole = await guild.roles.fetch(targetRoleId);
    if (!targetRole) {
      return;
    }

    if (!targetRole.members.some((member) => member.user.id === userId)) {
      interaction.reply("점호 참여자가 아닙니다");
      return;
    }

    await runRecord.create({
      guildId,
      userId: userId,
      date,
    });

    interaction.reply("출첵");
  },
};
