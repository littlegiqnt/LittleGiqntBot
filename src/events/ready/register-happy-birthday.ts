import { GUILD_ID } from "config";
import { Client, EmbedBuilder, GuildMember, userMention } from "discord.js";
import { scheduleJob } from "node-schedule";
import dbManager from "structure/DBManager";
import logger from "structure/Logger";
import { isNormalTextChannel } from "utils/checkChannel";
import createReadyEventListener from "./createReadyEventListener";

export default createReadyEventListener(async (client) => {
    scheduleJob("0 0 * * *", () => onEveryDay(client));
});

export const onEveryDay = async (client: Client) => {
    const guild = await client.guilds.fetch(GUILD_ID);
    if (guild == null) logger.error("guild is null");
    const today = new Date();
    const month = today.getMonth() + 1;
    const day = today.getDate();
    console.log(`${month}월 ${day}일 생일 알림 처리 시작`);
    const users = await dbManager.User.find({
        /* eslint-disable @typescript-eslint/naming-convention */
        "birthday.month": month,
        "birthday.day": day,
        /* eslint-enable @typescript-eslint/naming-convention */
    });
    const specialUsers: Array<GuildMember> = [];
    for (const user of users) {
        const member = guild.members.cache.get(user.id) ?? await guild.members.fetch(user.id);
        if (member == null) continue;
        specialUsers.push(member);
    }
    if (specialUsers.length <= 0) return;

    const channel = guild.channels.cache.get("1100430961243586723");
    if (channel == null || !isNormalTextChannel(channel)) {
        logger.error("생일 알림 채널 못찾음!!");
        return;
    }
    const embed = new EmbedBuilder()
        .setColor("Aqua")
        .setTitle("생일 축하해요! 🎉")
        .setDescription("오늘은 "
            + `${specialUsers.map(((m) => userMention(m.id)))
                .join(", ")}님의 생일이에요!\n`
            + "다같이 축하의 메세지를 보내봐요.");
    channel.send({
        embeds: [embed],
    });
};
