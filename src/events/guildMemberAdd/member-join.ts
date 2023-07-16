import { GUILD_ID } from "config";
import { reloadMembersCount } from "utils/discordUtils";
import logUtil from "utils/log";
import createGuildMemberAddEventListener from "./createGuildMemberAddEventListener";

export default createGuildMemberAddEventListener(async (member) => {
    // return if it is not my personal private server
    if (member.guild.id !== GUILD_ID) return;

    reloadMembersCount(member.client);
    if (!member.pending) {
        logUtil.userJoin(member);
    }
});
