import { interactionCreateEventHandler } from "./event-handlers/interaction-create.ts";
import { voiceStateUpdateEventHandler } from "./event-handlers/voice-state-update.ts";
import { EventHandler } from "./types.ts";

// deno-lint-ignore no-explicit-any
export const eventHandlers: EventHandler<any>[] = [
  voiceStateUpdateEventHandler,
  interactionCreateEventHandler,
];
