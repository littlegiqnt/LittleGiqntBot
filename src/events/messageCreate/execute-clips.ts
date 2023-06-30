import { Message, userMention } from "discord.js";
import createMessageCreateEventListener from "./createMessageCreateEventListener";

const urlRegex = /https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_+.~#?&/=]*)/;
const imageUrlRegex = /https?:\/\/.*\.(?:png|jpg)/;

export default createMessageCreateEventListener((msg) => {
    if (msg.author.bot) return;
    if (msg.channelId !== "1124266410458222612" || msg.member == null) return;
    if (!urlRegex.test(msg.content) && msg.attachments.size === 0) {
        removeMsg(msg);
        return;
    }
    if (imageUrlRegex.test(msg.content)) {
        removeMsg(msg);
        return;
    }
    msg.attachments.forEach((attachment) => {
        console.debug(msg.content);
        if (!attachment.contentType?.startsWith("video/mp4")) {
            removeMsg(msg);
            return;
        }
    });
    msg.startThread({
        name: `${msg.author.username}님의 클립`,
    });
});

const removeMsg = async (msg: Message) => {
    msg.delete();
    msg.channel.send({
        content: `${userMention(msg.author.id)} 이 채널에는 동영상만 올리실 수 있어요!`,
        allowedMentions: {
            users: [msg.author.id],
        },
    });
};