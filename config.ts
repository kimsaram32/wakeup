import "@std/dotenv/load";

export const Config = {
  discord: {
    appId: Deno.env.get("DISCORD_APP_ID") as string,
    botToken: Deno.env.get("DISCORD_BOT_TOKEN") as string,
  },
};
