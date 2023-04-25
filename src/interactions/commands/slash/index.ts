import type { SlashCommand } from "structure/interaction/command/SlashCommand";
import birthday from "./birthday";
import clear from "./clear";
import couple from "./couple";
import ping from "./ping";
import say from "./say";
import setup from "./setup";
import test from "./test";

const commands: Array<SlashCommand> = [
    ping,
    setup,
    couple,
    clear,
    birthday,
    say,
    test,
];

export default commands;
