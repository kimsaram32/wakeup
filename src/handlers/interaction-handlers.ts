import { manualRunInteractionHandler } from "./interaction-handlers/manual-run.ts";
import { runInteractionHandler } from "./interaction-handlers/run.ts";
import { settingsInteractionHandler } from "./interaction-handlers/settings.ts";
import { showStreakInteractionHandler as streakInteractionHandler } from "./interaction-handlers/streak.ts";
import { InteractionHandler } from "./types.ts";

const interactionHandlers = [
  settingsInteractionHandler,
  runInteractionHandler,
  manualRunInteractionHandler,
  streakInteractionHandler,
];
export const interactionHandlersMap = new Map<
  InteractionHandler["name"],
  InteractionHandler["execute"]
>();

for (const handler of interactionHandlers) {
  interactionHandlersMap.set(handler.name, handler.execute);
}
