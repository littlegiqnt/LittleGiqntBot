import { ActivityType } from "discord.js";
import rolesManager from "structure/RolesManager";
import { reloadMembersCount } from "utils/discordUtils";
import { manager1 } from "utils/dynamic-vc";
import logUtil from "utils/log";
import { isProduction } from "utils/utils";
import createReadyEventListener from "./createReadyEventListener";

export default createReadyEventListener(async (client) => {
    client.user.setActivity({
        name: "뭘봐",
        type: ActivityType.Custom,
    });
    client.user.setStatus("dnd");

    await rolesManager.load(client);
    await logUtil.init(client);
    await reloadMembersCount(client);
    await manager1.init(client);

    if (isProduction) {
        await logUtil.devChannel?.send({ content: `봇 켜짐!\nEnvironment: ${process.env.NODE_ENV}` });
    }
    console.log("Bot is ready");
});
