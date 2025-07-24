import { ChatInputCommandInteraction, ClientEvents } from "discord.js";

export type EventHandler<T extends keyof ClientEvents> = {
  name: T;
  execute: (...args: ClientEvents[T]) => void;
};

export type InteractionHandler = {
  name: string;
  execute: (interaction: ChatInputCommandInteraction) => void;
};
