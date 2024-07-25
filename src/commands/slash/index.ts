import type { SlashCommand } from "structure/interaction/command/SlashCommand";
import birthday from "./birthday";
import clear from "./clear";
import couple from "./couple";
import medal from "./medal";
import ping from "./ping";
import remind from "./remind";
import say from "./say";
import selfbot from "./selfbot";

const commands: Array<SlashCommand> = [
    birthday,
    clear,
    couple,
    medal,
    ping,
    remind,
    say,
    selfbot,
];

export default commands;
