import type { SlashCommand } from "structure/interaction/command/SlashCommand";
import admin from "./admin";
import birthday from "./birthday";
import clear from "./clear";
import couple from "./couple";
import ping from "./ping";
import setup from "./setup";

const commands: Array<SlashCommand> = [ping, setup, couple, clear, admin, birthday];

export default commands;
