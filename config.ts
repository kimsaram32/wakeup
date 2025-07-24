import "@std/dotenv/load";

export const Config = {
  discord: {
    appId: Deno.env.get("DISCORD_APP_ID") as string,
    botToken: Deno.env.get("DISCORD_BOT_TOKEN") as string,
  },
  postgres: {
    url: Deno.env.get("POSTGRES_URL") as string,
  },
  redis: {
    url: Deno.env.get("REDIS_URL") as string,
  }
};
