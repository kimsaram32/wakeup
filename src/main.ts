import "@std/dotenv/load";
import { Client, Events, GatewayIntentBits } from "discord.js";
import { Config } from "./config.ts";
import { eventHandlers } from "./handlers/event-handlers.ts";

// todo: validations
const client = new Client({
  intents: [GatewayIntentBits.GuildVoiceStates, GatewayIntentBits.GuildMembers],
});

for (const eventHandler of eventHandlers) {
  client.on(eventHandler.name, eventHandler.execute);
}

client.on(Events.ClientReady, () => {
  console.log("Bot is running");
});

client.login(Config.discord.botToken);
