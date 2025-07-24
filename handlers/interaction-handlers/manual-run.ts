import { InteractionHandler } from "../types.ts";

export const manualRunInteractionHandler: InteractionHandler = {
  name: "출첵_수동",
  execute(interaction) {
    const targetMemberId = interaction.options.getUser("점호_참여자")!.id;

    console.log(targetMemberId);

    interaction.reply("출첵");
  },
};
