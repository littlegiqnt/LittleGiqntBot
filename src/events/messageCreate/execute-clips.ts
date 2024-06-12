import type { Message } from "discord.js";
import { userMention } from "discord.js";
import createMessageCreateEventListener from "./createMessageCreateEventListener";

const urlRegex = /https?:\/\/(?:www\.)?[-\w@:%.+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b[-\w()@:%+.~#?&/=]*/;
const imageUrlRegex = /https?:\/\/.*\.(?:png|jpg)/;

export default createMessageCreateEventListener(async (msg) => {
    if (msg.author.bot) return;
    if (msg.channelId !== "1124266410458222612" || msg.member == null) return;
    if (!urlRegex.test(msg.content) && msg.attachments.size === 0) {
        await removeMsg(msg);
        return;
    }
    if (imageUrlRegex.test(msg.content)) {
        await removeMsg(msg);
        return;
    }
    if (!msg.attachments.every((attachment) => attachment.contentType?.startsWith("video/mp4"))) {
        await removeMsg(msg);
        return;
    }
    await msg.startThread({
        name: `${msg.author.username}님의 클립`,
    });
});

const removeMsg = async (msg: Message) => {
    await msg.delete();
    await msg.channel.send({
        content: `${userMention(msg.author.id)} 이 채널에는 동영상만 올리실 수 있어요!`,
        allowedMentions: {
            users: [msg.author.id],
        },
    });
};
