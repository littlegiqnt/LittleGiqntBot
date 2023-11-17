import logUtil from "utils/log";
import createGuildMemberUpdateEventListener from "./createGuildMemberUpdate";

export default createGuildMemberUpdateEventListener(async (oldMember, member) => {
    if ((oldMember.pending ?? false) && !member.pending && !member.user.bot) {
        await logUtil.userJoin(member);
    }
});
