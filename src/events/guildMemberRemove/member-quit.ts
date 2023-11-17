import { GUILD_ID } from "config";
import { reloadMembersCount } from "utils/discordUtils";
import logUtil from "utils/log";
import createGuildMemberRemoveEventListener from "./createGuildMemberRemoveEventListener";

export default createGuildMemberRemoveEventListener(async (member) => {
    // return if it is not my personal private server
    if (member.guild.id !== GUILD_ID) return;
    await Promise.all([
        reloadMembersCount(member.client),
        logUtil.userQuit(member),
    ]);
});
