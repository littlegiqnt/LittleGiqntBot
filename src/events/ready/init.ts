import { ActivityType } from "discord.js";
import logger from "structure/Logger";
import rolesManager from "structure/RolesManager";
import { isNormalTextChannel } from "utils/checkChannel";
import { manager1 } from "utils/dynamic-vc";
import isProduction from "utils/isProduction";
import reloadMembersCount from "utils/reloadMembersCount";
import createReadyEventListener from "./createReadyEventListener";

export default createReadyEventListener(async (client) => {
    client.user.setActivity("응애", { type: ActivityType.Playing });
    client.user.setStatus("dnd");

    if (isProduction()) {
        const devChannel = client.channels.cache.get("1024959239384477726")!;
        if (isNormalTextChannel(devChannel)) {
            devChannel.send({ content: `봇 켜짐!\nEnvironment: ${process.env.NODE_ENV}` });
        }
    }
    rolesManager.load(client);
    logger.init(client);
    reloadMembersCount(client);
    manager1.init(client);

    console.log("Bot is ready");
});
