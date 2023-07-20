import { SlashCommand } from "structure/interaction/command/SlashCommand";
import download from "./download";

export default new SlashCommand({
    name: "medal",
    description: {
        en: "Medal.tv util command",
        ko: "Medal.tv 유용한 명령어들",
    },
    subCommands: [
        download,
    ],
});