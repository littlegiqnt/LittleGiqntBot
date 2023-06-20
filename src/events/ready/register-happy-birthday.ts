import { GUILD_ID } from "config";
import { Client, EmbedBuilder, GuildMember, userMention } from "discord.js";
import { scheduleJob } from "node-schedule";
import dbManager from "structure/DBManager";
import logger from "structure/Logger";
import { isNormalTextChannel } from "utils/checkChannel";
import { getRandomInt } from "utils/utils";
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
    const birthdayUsers: Array<GuildMember> = [];
    for (const user of users) {
        const member = guild.members.cache.get(user.id) ?? await guild.members.fetch(user.id);
        if (member == null) continue;
        birthdayUsers.push(member);
    }
    if (birthdayUsers.length <= 0) return;

    const channel = guild.channels.cache.get("1100430961243586723");
    if (channel == null || !isNormalTextChannel(channel)) {
        logger.error("생일 알림 채널 못찾음!!");
        return;
    }

    const specialUsers: Array<GuildMember> = [];
    birthdayUsers.forEach((m) => {
        if (getRandomInt(1, 10) === 1) {
            specialUsers.push(m);
        }
    });

    const embeds: Array<EmbedBuilder> = [];

    embeds.push(new EmbedBuilder()
        .setColor("Aqua")
        .setTitle("생일 축하해요! 🎉")
        .setDescription("오늘은 "
            + `${birthdayUsers.map(((m) => userMention(m.id)))
                .join(", ")}님의 생일이에요!\n`
            + "다같이 축하의 메세지를 보내봐요."));
    if (specialUsers.length !== 0) {
        embeds.push(new EmbedBuilder()
            .setColor("Gold")
            .setTitle("앗! 그리고 이번에는 특별 상품 수령자가 있어요!")
            .setDescription("10%의 확률로 "
            + `${specialUsers.map(((m) => userMention(m.id)))
                .join(", ")}님은 이벤트에 당첨됐답니다! 축하드려요!!\n상품은 작은거인님이 직접 선물로 드릴거에요.`));
    }
    channel.send({
        embeds: embeds,
    });
};
