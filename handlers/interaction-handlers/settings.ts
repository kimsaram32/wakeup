import { guildSettings } from "../../entities/guild-settings.ts";
import { InteractionHandler } from "../types.ts";

export const settingsInteractionHandler: InteractionHandler = {
  name: "설정",
  async execute(interaction) {
    const guildId = interaction.guildId;
    if (!guildId) {
      return;
    }

    const targetChannelId = interaction.options.getChannel("점호_채널")?.id;
    const targetRoleId = interaction.options.getRole("점호_참여자_역할")?.id;
    const adminRoleId = interaction.options.getRole("관리자_역할")?.id;

    await guildSettings.update(guildId, {
      targetChannelId,
      targetRoleId,
      adminRoleId,
    });

    interaction.reply({
      content: "Added",
    });
  },
};
