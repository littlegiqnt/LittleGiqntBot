import { SlashCommand } from "structure/interaction/command/SlashCommand";
import days from "./days";
import since from "./since";
import remove from "./remove";

export default new SlashCommand({
    name: "couple",
    nameLocales: {
        ko: "커플",
    },
    subCommands: [since, days, remove],
});
