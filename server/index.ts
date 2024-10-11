import type { Deferrals } from "./citizenfx.types";

on(
  "playerConnecting",
  (
    name: string,
    setKickReason: (reason: string) => void,
    deferrals: Deferrals,
  ) => {
    deferrals.defer();
    const player = global.source;

    setTimeout(() => {
      const identifiers = getPlayerIdentifiers(player);

      let steamId: string | null = null;

      for (const identifier of identifiers) {
        if (identifier.includes("steam:")) {
          steamId = identifier;
          break;
        }
      }

      if (!steamId) {
        setKickReason("Steam must be running to join this server.");
        deferrals.done("Steam must be running to join this server.");
      }

      setTimeout(() => deferrals.done(), 1);
    }, 1);
  },
);
