import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import type { Deferrals } from "./citizenfx.types";

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL,
    },
  },
});

on("resourceStart", (resourceName: string) => {
  if (GetCurrentResourceName() !== resourceName) {
    return;
  }

  const steamApiKey = GetConvar("steam_webApiKey", "");

  if (steamApiKey === "" || steamApiKey === "null" || steamApiKey === "none") {
    console.error(
      "Please set the steam_webApiKey convar in your server.cfg file.",
    );
  }
});

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
      } else {
        prisma.player.findUnique({ where: { steamId } }).then((player) => {
          if (!player) {
            prisma.player.create({ data: { name, steamId } }).then(() => {
              setTimeout(() => deferrals.done(), 1);
            });
          } else {
            setTimeout(() => deferrals.done(), 1);
          }
        });
      }
    }, 1);
  },
);

on("onResourceStop", (resourceName: string) => {
  if (GetCurrentResourceName() !== resourceName) {
    return;
  }

  prisma.$disconnect().then(() => console.log("Prisma disconnected."));
});
