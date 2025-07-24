import "@std/dotenv/load";
import { Client, Events, GatewayIntentBits } from "discord.js";

// todo: validations
const Config = {
  discord: {
    appId: Deno.env.get("DISCORD_APP_ID") as string,
    botToken: Deno.env.get("DISCORD_BOT_TOKEN") as string,
  },
};

const client = new Client({
  intents: [GatewayIntentBits.GuildVoiceStates],
});

client.on(Events.ClientReady, () => {
  console.log("Bot is running");
});

client.login(Config.discord.botToken);
