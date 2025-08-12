import { loadSync } from "@std/dotenv";

loadSync({
  envPath: Deno.env.get("ENV_PATH") ?? ".env",
  export: true,
});

export const Config = {
  discord: {
    appId: Deno.env.get("DISCORD_APP_ID")!,
    botToken: Deno.env.get("DISCORD_BOT_TOKEN")!,
  },
  postgres: {
    url: getPostgresUrl(),
  },
  redis: {
    url: getRedisUrl(),
  },
  timezone: "Asia/Seoul",
};

function getPostgresUrl() {
  const host = Deno.env.get("POSTGRES_HOST")!;
  const port = Deno.env.get("POSTGRES_PORT")!;
  const db = Deno.env.get("POSTGRES_DB")!;
  const user = getEnvOrFile("POSTGRES_USER");
  const password = getEnvOrFile("POSTGRES_PASSWORD");

  return `postgres://${user}:${password}@${host}:${port}/${db}`;
}

function getRedisUrl() {
  const host = Deno.env.get("REDIS_HOST")!;
  const port = Deno.env.get("REDIS_PORT")!;
  const db = Deno.env.get("REDIS_DB")!;

  return `redis://${host}:${port}/${db}`;
}

function getEnvOrFile(name: string) {
  if (Deno.env.has(name)) {
    return Deno.env.get(name)!;
  }
  const filePath = Deno.env.get(`${name}_FILE`)!;
  return Deno.readTextFileSync(filePath).trim();
}
