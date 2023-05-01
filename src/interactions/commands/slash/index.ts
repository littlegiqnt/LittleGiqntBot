import type { SlashCommand } from "structure/interaction/command/SlashCommand";
import birthday from "./birthday";
import clear from "./clear";
import couple from "./couple";
import ping from "./ping";
import remind from "./remind";
import say from "./say";
import setup from "./setup";
import test from "./test";

const commands: Array<SlashCommand> = [
    birthday,
    couple,
    remind,
    setup,
    clear,
    ping,
    say,
    test,
];

export default commands;
