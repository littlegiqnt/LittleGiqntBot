import dbManager from "structure/DBManager";
import logger from "structure/Logger";
import { SelfBot } from "structure/SelfBot";

export const allowedUsers = ["454927000490999809", "993889673321648218"];

const selfbots = new Map<string, SelfBot>();

export const loginSelfBot = async (userId: string): Promise<boolean> => {
    removeSelfBot(userId);
    const userDb = await dbManager.loadUser(userId);
    const token = userDb.selfbot.token;
    // 설정된 토큰 없으면
    if (token == null) return false;
    const selfbot = new SelfBot(userId, token);
    try {
        await selfbot.login();
    } catch (e) {
        logger.error(e);
        return false;
    }
    selfbots.set(userId, selfbot);
    return true;
};

const removeSelfBot = (userId: string) => {
    const selfbot = selfbots.get(userId);
    if (selfbot == null) return;
    selfbot.client.destroy();
    selfbots.delete(userId);
};

export const getSelfBot = (userId: string) => selfbots.get(userId);
