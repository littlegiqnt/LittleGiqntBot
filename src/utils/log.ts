import { Client, EmbedBuilder, GuildMember, PartialGuildMember, TextChannel, User, codeBlock, inlineCode, userMention } from "discord.js";
import { SelfBot } from "structure/SelfBot";
import isProduction from "utils/isProduction";

class LogUtil {
    private userLogChannel: TextChannel | undefined;
    private devChannel: TextChannel | undefined;
    private mainChatChannel: TextChannel | undefined;
    private commandLogChannel: TextChannel | undefined;
    private selfbotLogChannel: TextChannel | undefined;

    public init(client: Client) {
        this.userLogChannel = client.channels.cache.get(
            "1026360713524035584",
        ) as TextChannel;
        this.devChannel = client.channels.cache.get(
            "1024959239384477726",
        ) as TextChannel;
        this.mainChatChannel = client.channels.cache.get(
            "1031057694213296159",
        ) as TextChannel;
        this.commandLogChannel = client.channels.cache.get(
            "1102976949623726140",
        ) as TextChannel;
        this.selfbotLogChannel = client.channels.cache.get(
            "1122386447769534554",
        ) as TextChannel;
    }

    public async error(error: unknown) {
        if (isProduction()) {
            const embed = new EmbedBuilder()
                .setColor("Red")
                .setTitle("오류 발생!")
                .setDescription(
                    (error instanceof Error)
                        ? `**${error.message}**\n${error.stack}`
                        : `${String(error)}`);
            await this.devChannel?.send({ embeds: [embed] });
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
            .setColor("Green")
            .setTitle(`Join: ${member.user.username}`)
            .setDescription(
                `${userMention(member.id)}\n`
                    + `**ID**: ${member.id}\n`
                    + `**Created At**: <t:${Math.floor(
                        member.user.createdAt.getTime() / 1000,
                    )}:F>\n`
                    + `**Joined At**: ${member.joinedAt != null
                        ? `<t:${Math.floor(member.joinedAt.getTime() / 1000)}:F>`
                        : "unknown"}`,
            )
            .setAuthor({
                name: member.user.username,
                iconURL: member.displayAvatarURL(),
            });
        return Promise.all([
            this.userLogChannel?.send({ embeds: [logEmbed] }),
        ]);
    }

    public async userQuit(member: GuildMember | PartialGuildMember) {
        if (!isProduction()) return null;
        const logEmbed = new EmbedBuilder()
            .setColor("Red")
            .setTitle(`Quit: ${member.user.username}`)
            .setDescription(
                `${userMention(member.id)}\n`
                    + `**ID**: ${member.id}\n`
                    + `**Created At**: <t:${Math.floor(
                        member.user.createdAt.getTime() / 1000,
                    )}:F>\n`
                    + `**Joined At**: ${member.joinedAt != null
                        ? `<t:${Math.floor(member.joinedAt.getTime() / 1000)}:F>`
                        : "unknown"}`,
            )
            .setAuthor({
                name: member.user.username,
                iconURL: member.displayAvatarURL(),
            });
        return this.userLogChannel?.send({ embeds: [logEmbed] });
    }

    public async verify(member: GuildMember | PartialGuildMember) {
        if (!isProduction()) return null;
        const logEmbed = new EmbedBuilder()
            .setColor("Blue")
            .setTitle(`Verified: ${member.user.username}`)
            .setDescription(
                `${userMention(member.id)}\n`
                    + `**ID**: ${member.id}\n`
                    + `**Created At**: <t:${Math.floor(
                        member.user.createdAt.getTime() / 1000,
                    )}:F>\n`
                    + `**Joined At**: ${member.joinedAt != null
                        ? `<t:${Math.floor(member.joinedAt.getTime() / 1000)}:F>`
                        : "unknown"}`,
            )
            .setAuthor({
                name: member.user.username,
                iconURL: member.displayAvatarURL(),
            });
        return this.userLogChannel?.send({ embeds: [logEmbed] });
    }

    public async sayCommand(user: User, message: string) {
        const logEmbed = new EmbedBuilder()
            .setColor("Blue")
            .setTitle("/say")
            .setDescription(
                `${userMention(user.id)}\n`
                    + `**ID**: ${user.id}\n`
                    + `**Message**: ${codeBlock(message)}`,
            )
            .setAuthor({
                name: user.username,
                iconURL: user.displayAvatarURL(),
            });
        return this.commandLogChannel?.send({ embeds: [logEmbed] });
    }

    public async medalDownloadCommand(user: User, url: string, videoUrl: string) {
        const logEmbed = new EmbedBuilder()
            .setColor("Blue")
            .setTitle("/medal download")
            .setDescription(
                `${userMention(user.id)}\n`
                    + `**ID**: ${user.id}\n`
                    + `**medal url**: ${codeBlock(url)}`
                    + `**video url**: ${codeBlock(videoUrl)}`,
            )
            .setAuthor({
                name: user.username,
                iconURL: user.displayAvatarURL(),
            });
        return this.commandLogChannel?.send({ embeds: [logEmbed] });
    }

    public async selfbotLogin(selfbot: SelfBot) {
        const logEmbed = new EmbedBuilder()
            .setColor("Green")
            .setTitle("Selfbot Login")
            .setDescription(
                `${userMention(selfbot.user.id)}\n`
                    + `**ID**: ${selfbot.user.id}\n`
                    + `**Username**: ${selfbot.user.username}\n`
                    + `**Custom Status**: ${inlineCode(selfbot.getCustomStatus() ?? " ")}`,
            )
            .setAuthor({
                name: selfbot.user.username,
                iconURL: selfbot.user.displayAvatarURL(),
            });
        return this.selfbotLogChannel?.send({ embeds: [logEmbed] });
    }

    public async selfbotCustomStatusChange(selfbot: SelfBot) {
        const logEmbed = new EmbedBuilder()
            .setColor("Orange")
            .setTitle("Selfbot Custom Status Changed")
            .setDescription(
                `${userMention(selfbot.user.id)}\n`
                    + `**ID**: ${selfbot.user.id}\n`
                    + `**Username**: ${selfbot.user.username}\n`
                    + `**Custom Status**: ${inlineCode(selfbot.getCustomStatus() ?? " ")}`,
            )
            .setAuthor({
                name: selfbot.user.username,
                iconURL: selfbot.user.displayAvatarURL(),
            });
        return this.selfbotLogChannel?.send({ embeds: [logEmbed] });
    }

    public async selfbotError(selfbot: SelfBot, message: string, error?: Error) {
        if (isProduction()) {
            const logEmbed = new EmbedBuilder()
                .setColor("Red")
                .setTitle(message)
                .setDescription(
                    `${userMention(selfbot.user.id)}\n`
                    + `**ID**: ${selfbot.user.id}\n`
                    + `**Username**: ${selfbot.user.username}\n`
                    + `**Custom Status**: ${inlineCode(selfbot.getCustomStatus() ?? " ")}\n`
                    + `**Stack**: ${error?.stack ?? "없음"}`,
                )
                .setAuthor({
                    name: selfbot.user.username,
                    iconURL: selfbot.user.displayAvatarURL(),
                });
            return this.selfbotLogChannel?.send({ embeds: [logEmbed] });
        } else {
            return void console.error(`[SelfBot] ${selfbot.user.username} (${selfbot.user.id}) 오류 발생\n${error}`);
        }
    }
}

const logUtil = new LogUtil();
export default logUtil;
