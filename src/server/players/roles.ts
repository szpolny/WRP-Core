import type { PrismaClient, Role } from "@prisma/client";
import { prefix } from "..";
import LicenseController from "./license";

export default class RolesController {
  private prisma: PrismaClient;
  private licenseController: LicenseController;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
    this.licenseController = new LicenseController();

    RegisterCommand(
      "setrole",
      async (source: number, args: string[]) => {
        let consoleSource = true;
        if (source > 0) {
          const license = this.licenseController.getLicense(source);
          const origin = await this.prisma.player.findUnique({
            where: { steamId: license },
          });

          if (!origin || origin.role !== "ADMIN") {
            TriggerClientEvent("chat:addMessage", source, {
              args: [prefix, " You don't have permission to use this command."],
            });
            return;
          }

          consoleSource = false;
        }

        if (args.length !== 2) {
          if (consoleSource) {
            console.log(`${prefix} Usage: /setrole [steamId] [role]`);
          } else {
            TriggerClientEvent("chat:addMessage", source, {
              args: [prefix, " Usage: /setrole [steamId] [role]"],
            });
          }
          return;
        }

        const steamId = args[0];
        const role = args[1];

        let roleAsEnum: Role;

        switch (role.toLowerCase()) {
          case "user":
            roleAsEnum = "USER";
            break;
          case "admin":
            roleAsEnum = "ADMIN";
            break;
          default:
            if (consoleSource) {
              console.log(`${prefix} Invalid role.`);
            } else {
              TriggerClientEvent("chat:addMessage", source, {
                args: [prefix, " Invalid role."],
              });
            }
            return;
        }

        const prismaResult = await this.changeRole(steamId, roleAsEnum);

        if (!prismaResult) {
          if (consoleSource) {
            console.log(`${prefix} Player not found.`);
          } else {
            TriggerClientEvent("chat:addMessage", source, {
              args: [prefix, " Player not found."],
            });
          }
          return;
        }

        if (consoleSource) {
          console.log(`${prefix} Role changed to ${roleAsEnum}.`);
        } else {
          TriggerClientEvent("chat:addMessage", source, {
            args: [prefix, ` Role changed to ${roleAsEnum}.`],
          });
        }
      },
      false,
    );
  }

  changeRole(steamId: string, role: Role) {
    return this.prisma.player.update({ where: { steamId }, data: { role } });
  }
}
