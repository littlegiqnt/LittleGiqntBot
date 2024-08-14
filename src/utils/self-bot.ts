import { GUILD_ID } from "config";
import type { Client, GuildMember } from "discord.js";
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
    // selfbot.on("debug", (message) => {
    //     console.log(message);
    // });
    selfbot.on("error", (error) => {
        console.error(error);
        logUtil.selfbotError(selfbot, "에러 발생", error).catch((error) => logUtil.error(error));
    });
    await selfbot.connect();
    logUtil.selfbotLogin(selfbot).catch((error) => logUtil.error(error));
    selfbot.editStatus("idle");
    selfbot.editAFK(true);

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

export const createAllSelfbots = async (client: Client<true>) => {
    const users = await dbManager.User.find({ "selfbot.token": { $ne: null } });
    const guild = await client.guilds.fetch(GUILD_ID);
    await Promise.all(users.map((user) =>
        guild.members.fetch(user._id)
            .then((member) => loginSelfBot(member.user))
            .catch(() => dbManager.User.updateOne({ _id: user._id }, { $unset: { "selfbot.token": "" } })),
    ));
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
