import "@std/dotenv/load";
import { Client, Events, GatewayIntentBits } from "discord.js";
import { Config } from "./config.ts";

// todo: validations
const client = new Client({
  intents: [GatewayIntentBits.GuildVoiceStates],
});

client.on(Events.InteractionCreate, (interaction) => {
  console.log(interaction)
})

client.on(Events.ClientReady, () => {
  console.log("Bot is running");
});

client.login(Config.discord.botToken);
