import { GUILD_ID } from "config";
import type { GuildMember } from "discord.js";
import { User } from "discord.js";
import dbManager from "structure/DBManager";
import { SelfBot } from "structure/SelfBot";
import logUtil from "./log";

const selfbots = new Map<string, SelfBot>();

const removeSelfBot = (userId: string) => {
    const selfbot = selfbots.get(userId);
    if (selfbot == null) return;
    selfbot.disconnect({ reconnect: false });
    selfbots.delete(userId);
};

export const loginSelfBot = async (user: User): Promise<boolean> => {
    removeSelfBot(user.id);

    const userDb = await dbManager.loadUser(user.id);
    const token = userDb.selfbot.token;

    // 설정된 토큰 없으면
    if (token == null) return false;

    const selfbot = new SelfBot(user, token);
    selfbot.on("ready", () => {
        selfbot.editAFK(true);
        selfbot.editStatus("idle");
    });
    selfbot.on("error", (error) => {
        console.error(error);
        logUtil.selfbotError(selfbot, "에러 발생", error).catch(console.error);
    });
    await selfbot.connect();

    selfbots.set(user.id, selfbot);

    return true;
};

export const getSelfBot = (userId: string) => selfbots.get(userId);

export const isAllowed = async (user: User | GuildMember): Promise<boolean> => {
    const member = (user instanceof User)
        ? await (await user.client.guilds.fetch(GUILD_ID)).members.fetch(user.id)
        : user;

    return member.roles.cache.has("1266000016267411570");
};

export const reLoginAllSelfBots = async () => {
    for (const selfbot of selfbots.values()) {
        await loginSelfBot(selfbot.owner);
    }
};

export const destroyAllSelfBots = () => {
    for (const selfbot of selfbots.values()) {
        try {
            selfbot.disconnect({ reconnect: false });
        } catch (error) {
            console.error(error);
        }
    }
    selfbots.clear();
};

setInterval(() => {
    reLoginAllSelfBots().catch(console.error);
}, 1000 * 60 * 60 * 24); // 24 hours
