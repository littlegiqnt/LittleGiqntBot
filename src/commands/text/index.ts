import type { TextCommand } from "structure/TextCommand";
import evaljs from "./evaljs";
import reboot from "./reboot";

const commands: Array<TextCommand> = [
    evaljs,
    reboot,
];

export default commands;
