import { runRecord } from "../../entities/run-record.ts";
import { InteractionHandler } from "../types.ts";

export const showStreakInteractionHandler: InteractionHandler = {
  name: "스트릭",
  async execute(interaction) {
    const guildId = interaction.guildId;
    if (!guildId) {
      return;
    }
    const records = await runRecord.getAll(guildId);
    console.log(records);
  },
};
