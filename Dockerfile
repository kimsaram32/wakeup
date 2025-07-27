FROM denoland/deno:latest

WORKDIR /app

COPY deno.json deno.lock .
RUN deno install

COPY src .

ENTRYPOINT ["deno", "run", "--unstable-temporal", "-A", "main.ts"]
