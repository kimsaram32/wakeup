import { REST, Routes } from "discord.js";
import commands from "./commands/commands.json" with { type: "json" };
import { Config } from "./config.ts";

const rest = new REST({ version: "10" }).setToken(Config.discord.botToken);

try {
  console.log("Started refreshing application commands");

  await rest.put(Routes.applicationCommands(Config.discord.appId), {
    body: commands,
  });

  console.log("Successfully reloaded application commands");
} catch (error) {
  console.error(error);
}
