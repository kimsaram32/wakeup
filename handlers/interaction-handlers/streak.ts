import { InteractionHandler } from "../types.ts";

export const showStreakInteractionHandler: InteractionHandler = {
  name: "스트릭",
  execute(interaction) {
    interaction.reply("스트릭");
  },
};
