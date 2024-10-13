import type { PrismaClient } from "@prisma/client";
import { prefix } from "..";
import type { Deferrals } from "../citizenfx.types";

export default class PlayersController {
  private prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;

    on(
      "playerConnecting",
      (
        name: string,
        setKickReason: (reason: string) => void,
        deferrals: Deferrals,
      ) => {
        this.$playerConnecting(global.source, name, setKickReason, deferrals);
      },
    );
  }

  $playerConnecting(
    player: number | string,
    name: string,
    setKickReason: (reason: string) => void,
    deferrals: Deferrals,
  ) {
    deferrals.defer();

    let steamId: string | null = null;

    setTimeout(() => {
      for (let i = 0; i < GetNumPlayerIdentifiers(String(player)); i++) {
        const identifier = GetPlayerIdentifier(String(player), i);

        if (identifier.startsWith("steam:")) {
          steamId = identifier;
          break;
        }
      }

      if (!steamId) {
        setKickReason(`${prefix} Steam is required to play on this server.`);
        deferrals.done(`${prefix} Steam is required to play on this server.`);
      }

      setTimeout(
        () => deferrals.update(`${prefix} We are checking your data...`),
        1,
      );

      if (steamId) {
        this.prisma.player.findUnique({ where: { steamId } }).then((player) => {
          if (!player) {
            this.prisma.player
              .create({
                data: { name, steamId: steamId as string },
              })
              .then(() => {
                setTimeout(() => deferrals.done(), 1);
              });
          } else {
            setTimeout(() => deferrals.done(), 1);
          }
        });
      } else {
        setKickReason(`${prefix} Steam is required to play on this server.`);
        deferrals.done(`${prefix} Steam is required to play on this server.`);
      }
    }, 1);
  }
}
