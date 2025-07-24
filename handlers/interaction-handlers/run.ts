import { InteractionHandler } from "../types.ts";

export const runInteractionHandler: InteractionHandler = {
  name: "출첵",
  execute(interaction) {
    interaction.reply("출첵");
  },
};
