import { GUILD_ID } from "config";
import logger from "structure/Logger";
import rolesManager from "structure/RolesManager";
import reloadMembersCount from "utils/reloadMembersCount";
import createGuildMemberAddEventListener from "./createGuildMemberAddEventListener";

export default createGuildMemberAddEventListener(async (member) => {
    // return if it is not my personal private server
    if (member.guild.id !== GUILD_ID) return;

    member.roles.add([
        rolesManager.get("dividerRoleGames"),
        rolesManager.get("dividerRoleNotice"),
        rolesManager.get("dividerRoleGames"),
        rolesManager.get("dividerRoleUser"),
    ]);

    reloadMembersCount(member.client);
    if (!member.pending) {
        logger.userJoin(member);
    }
});
