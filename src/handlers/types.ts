import { ChatInputCommandInteraction, ClientEvents } from "discord.js";

export type EventHandler<T extends keyof ClientEvents> = {
  name: T;
  execute: (...args: ClientEvents[T]) => void;
};

export function defineEventHandler<T extends keyof ClientEvents>(
  handler: EventHandler<T>,
): EventHandler<T> {
  return handler;
}

export type InteractionHandler = {
  name: string;
  execute: (interaction: ChatInputCommandInteraction) => void;
};
