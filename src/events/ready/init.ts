import { ActivityType } from "discord.js";
import rolesManager from "structure/RolesManager";
import { isNormalTextChannel, reloadMembersCount } from "utils/discordUtils";
import { manager1 } from "utils/dynamic-vc";
import logUtil from "utils/log";
import { isProduction } from "utils/utils";
import createReadyEventListener from "./createReadyEventListener";

export default createReadyEventListener(async (client) => {
    client.user.setActivity("응애", { type: ActivityType.Playing });
    client.user.setStatus("dnd");

    await rolesManager.load(client);
    await logUtil.init(client);
    await reloadMembersCount(client);
    await manager1.init(client);

    if (isProduction) {
        const devChannel = client.channels.cache.get("1024959239384477726")!;
        if (isNormalTextChannel(devChannel)) {
            await devChannel.send({ content: `봇 켜짐!\nEnvironment: ${process.env.NODE_ENV}` });
        }
    }
    console.log("Bot is ready");
});
