import { Events } from "discord.js";
import { defineEventHandler } from "../types.ts";
import { interactionHandlersMap } from "../interaction-handlers.ts";

export const interactionCreateEventHandler = defineEventHandler({
  name: Events.InteractionCreate,
  execute(interaction) {
    // todo: support more commands
    if (!interaction.isChatInputCommand()) {
      return;
    }
    const execute = interactionHandlersMap.get(interaction.commandName);
    execute?.(interaction);
  },
});
