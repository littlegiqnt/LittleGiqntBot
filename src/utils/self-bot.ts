import { GUILD_ID } from "config";
import { GuildMember, User } from "discord.js";
import dbManager from "structure/DBManager";
import { SelfBot } from "structure/SelfBot";

const selfbots = new Map<string, SelfBot>();

export const loginSelfBot = async (user: User): Promise<boolean> => {
    removeSelfBot(user.id);
    const userDb = await dbManager.loadUser(user.id);
    const token = userDb.selfbot.token;
    // 설정된 토큰 없으면
    if (token == null) return false;
    const selfbot = new SelfBot(user, token);
    if (!await selfbot.login()) return false;
    selfbots.set(user.id, selfbot);
    return true;
};

const removeSelfBot = (userId: string) => {
    const selfbot = selfbots.get(userId);
    if (selfbot == null) return;
    selfbot.client.destroy();
    selfbots.delete(userId);
};

export const getSelfBot = (userId: string) => selfbots.get(userId);

export const isAllowed = async (user: User | GuildMember): Promise<boolean> => {
    const member = (user instanceof User)
        ? await (await user.client.guilds.fetch(GUILD_ID)).members.fetch(user.id)
        : user;

    return member.roles.cache.has("1119125286672412703");
};