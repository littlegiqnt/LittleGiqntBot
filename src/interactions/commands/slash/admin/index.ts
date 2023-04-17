import { GUILD_ID } from "config";
import { SlashCommand } from "structure/interaction/command/SlashCommand";
import error from "./error";
import evaljs from "./evaljs";
import reboot from "./reboot";
import test from "./test";
import xp from "./xp";

export default new SlashCommand({
    name: "admin",
    subCommands: [xp, reboot, error, evaljs, test],
    guildId: GUILD_ID,
});
