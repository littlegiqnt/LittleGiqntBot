import { GUILD_ID } from "config";
import { BaseInteraction, Channel, Client, EmbedBuilder, Message, TextChannel } from "discord.js";
import logUtil from "./log";

export const isNormalTextChannel = (channel: Channel): channel is TextChannel => channel.isTextBased() && !channel.isThread() && !channel.isDMBased();

export const reloadMembersCount = async (client: Client) => {
    const guild = await client.guilds.fetch(GUILD_ID);
    await guild.fetch();
    const memberCountChannel = guild.channels.cache.get("1023190822692323369");
    if (memberCountChannel == null) return;
    memberCountChannel.setName(`👤┃${guild.memberCount}명`);
};

export const handleErrorReply = async (error: unknown, replyTo?: BaseInteraction | Message) => {
    if (!(error instanceof Error)) {
        return;
    }
    logUtil.error(error);
    if (replyTo == null) return;

    const embed = new EmbedBuilder()
        .setColor("Red")
        .setTitle("엇, 오류가 발생했어요..")
        .setDescription("관리자에게 문의해 주세요!");
    if (replyTo instanceof Message) {
        replyTo.reply({ embeds: [embed] });
    } else if (replyTo.isRepliable()) {
        if (replyTo.deferred || replyTo.replied) {
            replyTo.editReply({ embeds: [embed] });
        } else {
            replyTo.reply({ embeds: [embed], ephemeral: true });
        }
    }
};