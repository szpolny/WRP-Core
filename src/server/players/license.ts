export default class LicenseController {
  getLicense(player: number | string) {
    let steamId: string | undefined = undefined;

    for (let i = 0; i < GetNumPlayerIdentifiers(String(player)); i++) {
      const identifier = GetPlayerIdentifier(String(player), i);

      if (identifier.startsWith("steam:")) {
        steamId = identifier;
        break;
      }
    }

    return steamId;
  }
}
