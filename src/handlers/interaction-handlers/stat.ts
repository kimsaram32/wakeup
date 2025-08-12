import { EmbedBuilder } from "discord.js";
import { InteractionHandler } from "../types.ts";
import { runRecord } from "../../entities/run-record.ts";
import { Config } from "../../config.ts";

const START_DATE = Temporal.ZonedDateTime.from(
  "2025-07-28T00:00:00Z[Asia/Seoul]",
);

function buildHeatMap(
  dates: Temporal.ZonedDateTime[],
  startDate: Temporal.ZonedDateTime,
  endDate: Temporal.ZonedDateTime,
): boolean[][] | null {
  if (!dates.length) {
    return null;
  }

  const totalDays =
    Math.ceil(startDate.until(endDate).total({ unit: "days" }) / 7) * 7;

  const heatMap = Array.from(
    { length: 5 },
    () => Array.from({ length: totalDays / 7 }, () => false),
  );

  for (const date of dates) {
    const index = date.since(startDate).total({ unit: "days" });
    heatMap[index % 7][Math.floor(index / 7)] = true;
  }

  return heatMap;
}

export const showStatInteractionHandler: InteractionHandler = {
  name: "참여자_기록",
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

    const today = Temporal.Now.zonedDateTimeISO(Config.timezone);
    const endDate = today
      .add(Temporal.Duration.from({ days: 7 - today.dayOfWeek }))
      .startOfDay();

    const runRecords = await runRecord.getByMemberId(guildId, userId);
    const dates = runRecords.map((record) => record.date);
    const heatMap = buildHeatMap(dates, START_DATE, endDate);
    const dayNames = ["월", "화", "수", "목", "금", "토", "일"];

    const formattedHeatmap = heatMap &&
      heatMap
        .map(
          (row, index) =>
            `${dayNames[index]} ${row.map((x) => (x ? "🟩" : "⬜️")).join("")}`,
        )
        .join("\n");

    interaction.reply({
      embeds: [
        new EmbedBuilder()
          .setTitle("점호 기록")
          .setDescription(
            `<@${userId}>\n${
              formattedHeatmap
                ? "```" + formattedHeatmap + "```"
                : "기록이 없습니다"
            }`,
          ),
      ],
    });
  },
};
