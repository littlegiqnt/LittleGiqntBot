import { ActivityType } from "discord.js";
import rolesManager from "structure/RolesManager";
import { isNormalTextChannel, reloadMembersCount } from "utils/discordUtils";
import { manager1 } from "utils/dynamic-vc";
import isProduction from "utils/isProduction";
import logUtil from "utils/log";
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
    logUtil.init(client);
    reloadMembersCount(client);
    manager1.init(client);

    console.log("Bot is ready");
});
