import type { SlashCommand } from "structure/interaction/command/SlashCommand";
import birthday from "./birthday";
import clear from "./clear";
import couple from "./couple";
import ping from "./ping";
import setup from "./setup";

const commands: Array<SlashCommand> = [ping, setup, couple, clear, birthday];

export default commands;
