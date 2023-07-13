import { GUILD_ID } from "config";
import rolesManager from "structure/RolesManager";
import { reloadMembersCount } from "utils/discordUtils";
import logUtil from "utils/log";
import createGuildMemberAddEventListener from "./createGuildMemberAddEventListener";

export default createGuildMemberAddEventListener(async (member) => {
    // return if it is not my personal private server
    if (member.guild.id !== GUILD_ID) return;

    member.roles.add([
        rolesManager.get("dividerRoleProfile"),
        rolesManager.get("dividerRoleNotice"),
        rolesManager.get("dividerRoleGames"),
        rolesManager.get("dividerRoleUser"),
    ]);

    reloadMembersCount(member.client);
    if (!member.pending) {
        logUtil.userJoin(member);
    }
});
