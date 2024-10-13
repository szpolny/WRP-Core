import type { PrismaClient } from "@prisma/client";
import { prefix } from "..";
import type { Deferrals } from "../citizenfx.types";
import LicenseController from "./license";
import RolesController from "./roles";

export default class PlayersController {
  private prisma: PrismaClient;
  private licenseController: LicenseController;
  private rolesController: RolesController;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
    this.licenseController = new LicenseController();
    this.rolesController = new RolesController(prisma);

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

    setTimeout(() => {
      const steamId = this.licenseController.getLicense(player);

      if (steamId === undefined) {
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
