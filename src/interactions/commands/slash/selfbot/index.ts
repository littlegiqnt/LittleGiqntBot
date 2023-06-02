import { SlashCommand } from "structure/interaction/command/SlashCommand";
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
    ],
});
