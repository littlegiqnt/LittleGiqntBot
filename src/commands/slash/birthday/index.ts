import { SlashCommand } from "structure/interaction/command/SlashCommand";
import get from "./get";
import left from "./left";
import set from "./set";

export default new SlashCommand({
    name: "birthday",
    nameLocales: {
        ko: "생일",
    },
    subCommands: [get, set, left],
});
