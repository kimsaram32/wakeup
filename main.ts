import "@std/dotenv/load";
import { Client, Events, GatewayIntentBits } from "discord.js";
import { Config } from "./config.ts";
import { interactionHandlersMap } from "./handlers/interaction-handlers.ts";

// todo: validations
const client = new Client({
  intents: [GatewayIntentBits.GuildVoiceStates],
});

client.on(Events.InteractionCreate, (interaction) => {
  // todo: support more commands
  if (!interaction.isChatInputCommand()) {
    return;
  }
  const execute = interactionHandlersMap.get(interaction.commandName);
  execute?.(interaction);
});

client.on(Events.ClientReady, () => {
  console.log("Bot is running");
});

client.login(Config.discord.botToken);
