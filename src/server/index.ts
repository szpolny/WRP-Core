import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import PlayersController from "./players";

export const prefix = "[WRP]";

class Server {
  private prisma: PrismaClient;
  private players: PlayersController;

  constructor() {
    this.prisma = new PrismaClient({
      datasources: {
        db: {
          url: process.env.DATABASE_URL,
        },
      },
    });

    this.players = new PlayersController(this.prisma);

    on("onResourceStart", (resourceName: string) =>
      this.$onResourceStart(resourceName),
    );

    on("onResourceStop", (resourceName: string) =>
      this.$onResourceStop(resourceName),
    );
  }

  $onResourceStart(resourceName: string) {
    if (GetCurrentResourceName() !== resourceName) {
      return;
    }

    const steamApiKey = GetConvar("steam_webApiKey", "");

    if (
      steamApiKey === "" ||
      steamApiKey === "null" ||
      steamApiKey === "none"
    ) {
      console.error(
        "Please set the steam_webApiKey convar in your server.cfg file.",
      );
    }
  }

  $onResourceStop(resourceName: string) {
    if (GetCurrentResourceName() !== resourceName) {
      return;
    }

    this.prisma.$disconnect().then(() => console.log("Prisma disconnected."));
  }
}

new Server();
