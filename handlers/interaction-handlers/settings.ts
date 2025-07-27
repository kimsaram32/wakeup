import { ChannelType } from "discord.js";
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

    if (targetChannelId) {
      const guild = await interaction.client.guilds.fetch(guildId);
      const channel = await guild.channels.fetch(targetChannelId);
      if (!channel || channel.type !== ChannelType.GuildVoice) {
        interaction.reply("점호 채널은 음성 채널이어야 합니다");
        return;
      }
    }

    await guildSettings.update(guildId, {
      targetChannelId,
      targetRoleId,
      adminRoleId,
    });

    interaction.reply({
      content: "설정되었습니다",
    });
  },
};
