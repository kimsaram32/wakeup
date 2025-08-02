import { zip } from "@std/collections";
import { EmbedBuilder } from "discord.js";
import { guildSettings } from "../../entities/guild-settings.ts";
import { runRecord } from "../../entities/run-record.ts";
import { InteractionHandler } from "../types.ts";
import { Config } from "../../config.ts";
import { isWeekday } from "../../utils/is-weekday.ts";

function createRecordMap(
  records: { userId: string; date: Temporal.PlainDate }[],
) {
  const map = new Map<string, Set<string>>();
  for (const record of records) {
    if (map.has(record.userId)) {
      map.get(record.userId)!.add(record.date.toString());
    } else {
      map.set(record.userId, new Set([record.date.toString()]));
    }
  }
  return map;
}

export const showStreakInteractionHandler: InteractionHandler = {
  name: "스트릭",
  async execute(interaction) {
    const guildId = interaction.guildId;
    if (!guildId) {
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

    await guild.members.fetch();
    const targetRole = await guild.roles.fetch(targetRoleId);
    if (!targetRole) {
      return;
    }
    const targetMemberIds = targetRole.members
      .values()
      .map((member) => member.id)
      .toArray();
    console.log(targetMemberIds);

    const records = (await runRecord.getAll(guildId)).map(
      ({ userId, date }) => ({ userId, date: date.toPlainDate() }),
    );
    const recordMap = createRecordMap(records);

    const aDay = Temporal.Duration.from({ days: 1 });
    const today = Temporal.Now.plainDateISO(Config.timezone);

    const streaks = targetMemberIds.map((id) => {
      const set = recordMap.get(id);
      if (!set) return 0;

      let streak = 0;
      let currentDate = Temporal.PlainDate.from(today);

      while (true) {
        while (!isWeekday(currentDate.dayOfWeek)) {
          currentDate = currentDate.subtract(aDay);
        }
        if (!set.has(currentDate.toString())) {
          break;
        }
        currentDate = currentDate.subtract(aDay);
        streak++;
      }

      return streak;
    });

    const sortedMemberIdAndStreaks = zip(targetMemberIds, streaks).sort(
      (a, b) => b[1] - a[1],
    );

    interaction.reply({
      embeds: [
        new EmbedBuilder()
          .setTitle("점호 스트릭 현황")
          .setDescription(
            sortedMemberIdAndStreaks
              .map(
                ([id, streak], index) => `${index + 1}. <@${id}> (${streak}일)`,
              )
              .join("\n"),
          ),
      ],
    });
  },
};
