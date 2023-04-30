import { GUILD_ID } from "config";
import logger from "structure/Logger";
import reloadMembersCount from "utils/reloadMembersCount";
import createGuildMemberRemoveEventListener from "./createGuildMemberRemoveEventListener";

export default createGuildMemberRemoveEventListener(async (member) => {
    // return if it is not my personal private server
    if (member.guild.id !== GUILD_ID) return;

    reloadMembersCount(member.client);
    logger.userQuit(member);
});
