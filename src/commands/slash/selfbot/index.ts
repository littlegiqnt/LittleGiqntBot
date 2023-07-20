import { GUILD_ID } from "config";
import { SlashCommand } from "structure/interaction/command/SlashCommand";
import customStatus from "./custom-status";
import relogin from "./relogin";
import status from "./status";
import token from "./token";

export default new SlashCommand({
    name: "selfbot",
    nameLocales: {
        ko: "셀프봇",
    },
    subCommands: [
        relogin,
        status,
        token,
        customStatus,
    ],
    guildId: GUILD_ID,
});
