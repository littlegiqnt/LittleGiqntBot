import type { Client, GuildMember, PartialGuildMember, TextChannel } from "discord.js";
import { EmbedBuilder, userMention } from "discord.js";
import { description, title } from "templates/join";
import isProduction from "utils/isProduction";

class Logger {
    private userWelcomeChannel: TextChannel | undefined;
    private userLogChannel: TextChannel | undefined;
    private devChannel: TextChannel | undefined;
    private mainChatChannel: TextChannel | undefined;

    public init(client: Client) {
        this.userWelcomeChannel = client.channels.cache.get(
            "1023191661167263859",
        ) as TextChannel;
        this.userLogChannel = client.channels.cache.get(
            "1026360713524035584",
        ) as TextChannel;
        this.devChannel = client.channels.cache.get(
            "1024959239384477726",
        ) as TextChannel;
        this.mainChatChannel = client.channels.cache.get(
            "1031057694213296159",
        ) as TextChannel;
    }

    public async error(error: unknown) {
        if (!(error instanceof Error)) {
            return;
        }
        if (isProduction()) {
            try {
                const embed = new EmbedBuilder()
                    .setColor(0xff5733)
                    .setTitle("오류 발생!")
                    .setDescription(`**${error.message}**\n${error.stack}`);
                await this.devChannel?.send({ embeds: [embed] });
            } catch (e) {
                console.log(error);
                console.log(e);
                return;
            }
        } else {
            console.log(error);
        }
    }

    public async debug(message: string) {
        try {
            const embed = new EmbedBuilder()
                .setColor("Grey")
                .setTitle("디버그")
                .setDescription(message);
            await this.devChannel?.send({ embeds: [embed] });
        } catch (e) {
            this.error(e);
            return;
        }
    }

    public async userJoin(member: GuildMember) {
        if (!isProduction()) return null;
        const logEmbed = new EmbedBuilder()
            .setColor(0x00ff00)
            .setTitle(`Join: ${member.user.tag}`)
            .setDescription(
                `${userMention(member.id)}\n`
                    + `**ID**: ${member.id}\n`
                    + `**Created At**: <t:${Math.floor(
                        member.user.createdAt.getTime() / 1000,
                    )}:F>\n`
                    + `**Joined At**: <t:${Math.floor(
                        member.joinedAt!.getTime() / 1000,
                    )}:F>`,
            )
            .setThumbnail(member.displayAvatarURL());
        const welcomeEmbed = new EmbedBuilder()
            .setColor(0x00ff00)
            .setTitle(title)
            .setDescription(description(member));
        return Promise.all([
            this.userLogChannel?.send({ embeds: [logEmbed] }),
            this.userWelcomeChannel?.send({
                embeds: [welcomeEmbed],
                content: userMention(member.id),
                allowedMentions: { parse: ["users"] },
            }),
        ]);
    }

    public async userQuit(member: GuildMember | PartialGuildMember) {
        if (!isProduction()) return null;
        const logEmbed = new EmbedBuilder()
            .setColor(0xee4b2b)
            .setTitle(`Quit: ${member.user.tag}`)
            .setDescription(
                `${userMention(member.id)}\n`
                    + `**ID**: ${member.id}\n`
                    + `**Created At**: <t:${Math.floor(
                        member.user.createdAt.getTime() / 1000,
                    )}:F>\n`
                    + `**Joined At**: <t:${Math.floor(
                        member.joinedAt!.getTime() / 1000,
                    )}:F>`,
            )
            .setThumbnail(member.displayAvatarURL());
        return this.userLogChannel?.send({ embeds: [logEmbed] });
    }

    public async stepOneVerify(member: GuildMember | PartialGuildMember) {
        if (!isProduction()) return null;
        const logEmbed = new EmbedBuilder()
            .setColor(0x0096ff)
            .setTitle(`Verified(Step 1): ${member.user.tag}`)
            .setDescription(
                `${userMention(member.id)}\n`
                    + `**ID**: ${member.id}\n`
                    + `**Created At**: <t:${Math.floor(
                        member.user.createdAt.getTime() / 1000,
                    )}:F>\n`
                    + `**Joined At**: <t:${Math.floor(
                        member.joinedAt!.getTime() / 1000,
                    )}:F>`,
            )
            .setThumbnail(member.displayAvatarURL());

        return this.userLogChannel?.send({ embeds: [logEmbed] });
    }
}

const logger = new Logger();
export default logger;
