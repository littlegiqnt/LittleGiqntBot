import { GUILD_ID } from "config";
import { SlashCommand } from "structure/interaction/command/SlashCommand";
import buttons from "./buttons";
import guide from "./guide";
import language from "./language";
import roles from "./roles";

export default new SlashCommand({
    name: "setup",
    subCommands: [buttons, guide, language, roles],
    guildId: GUILD_ID,
});
