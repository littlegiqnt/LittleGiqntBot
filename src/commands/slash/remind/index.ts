import { SlashCommand } from "structure/interaction/command/SlashCommand";
import cancel from "./cancel";
import set from "./set";

export default new SlashCommand({
    name: "remind",
    nameLocales: {
        ko: "알림",
    },
    subCommands: [
        set,
        cancel,
    ],
});
