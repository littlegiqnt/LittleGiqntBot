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
    selfbot.client.destroy();
    selfbots.delete(userId);
};

export const loginSelfBot = async (user: User): Promise<boolean> => {
    removeSelfBot(user.id);

    const userDb = await dbManager.loadUser(user.id);
    const token = userDb.selfbot.token;

    // 설정된 토큰 없으면
    if (token == null) return false;

    const selfbot = new SelfBot(user, token, userDb.selfbot.customStatus);
    if (!await selfbot.login()) return false;

    selfbot.client.on("unhandledPacket", async (packet) => {
        if (packet.t !== "SESSIONS_REPLACE") return;

        // const sessions = packet.d as {
        //     status: string
        //     session_id: string
        //     client_info: {
        //         version: number
        //         os: string
        //         client: string
        //     }
        // }[];

        // if (sessions.find(s => s.client_info.client === "web" && s.status !== "idle") == null) return;

        // loginSelfBot(user).catch(e => logUtil.selfbotError(selfbot, "세션 갱신 실패", e as Error));

        selfbot.client.user?.setAFK(true);
        console.log(`[selfbot] ${selfbot.user.username} AFK 세션 갱신`);
    });

    selfbots.set(user.id, selfbot);

    return true;
};

export const getSelfBot = (userId: string) => selfbots.get(userId);

export const isAllowed = async (user: User | GuildMember): Promise<boolean> => {
    const member = (user instanceof User)
        ? await (await user.client.guilds.fetch(GUILD_ID)).members.fetch(user.id)
        : user;

    return member.roles.cache.has("1119125286672412703");
};
