import { GUILD_ID } from "config";
import type { GuildMember } from "discord.js";
import { User } from "discord.js";
import dbManager from "structure/DBManager";
import { SelfBot } from "structure/SelfBot";
import type { Message, MessageSearchOptions, Snowflake, TextChannel } from "discord.js-selfbot-v13";
import { Collection } from "discord.js-selfbot-v13";

const selfbots = new Map<string, SelfBot>();

const removeSelfBot = (userId: string) => {
    const selfbot = selfbots.get(userId);
    if (selfbot == null) return;
    selfbot.client.destroy();
    selfbots.delete(userId);
};

export const loginSelfBot = async (user: User): Promise<boolean> => {
    removeSelfBot(user.id);

    const userDb = await dbManager.loadUser(user.id);
    const token = userDb.selfbot.token;

    // 설정된 토큰 없으면
    if (token == null) return false;

    const selfbot = new SelfBot(user, token, userDb.selfbot.customStatus);
    if (!await selfbot.login()) return false;

    selfbot.client.on("unhandledPacket", (packet) => {
        if (packet.t !== "SESSIONS_REPLACE") return;
        selfbot.updatePresence();
    });

    selfbot.client.on("messageCreate", async (msg) => {
        if (msg.author.id !== selfbot.client.user?.id) return;

        // purge all messages in dm
        if (msg.content.startsWith("!recent")) {
            const target = msg.mentions.parsedUsers.first();
            if (target == null) return;
            await msg.reply(`최근 메시지를 가져오는 중...`);
            const profile = await target.getProfile() as {
                mutual_guilds: Array<{ id: string; nick: string }>;
            };
            // get recent messages of the target in all channels
            const messages = new Collection<Snowflake, Message>();
            for await (const guildId of profile.mutual_guilds.map((guild) => guild.id)) {
                const guild = await selfbot.client.guilds.fetch(guildId);
                try {
                    const textChannel = guild.channels.cache.find((channel) => channel.type === "GUILD_TEXT") as TextChannel;
                    if (textChannel == null) {
                        throw new Error(`TextChannel not found in guild ${guild.name}`);
                    }
                    const result = await textChannel.messages.search({
                        authors: [target.id],
                    } as MessageSearchOptions);
                    const first = result.messages.first();
                    if (first != null) messages.set(first.id, first);
                } catch (error) {
                    console.error(error);
                }
            }
            const iterator = messages
                .sort((a, b) => a.createdTimestamp - b.createdTimestamp)
                .values();
            const lines: string[] = [];
            for (const message of iterator) {
                if (lines.length >= 100) {
                    break;
                }
                lines.push(message.url);
            }
            await msg.reply(lines.join("\n"));
        }
    });

    selfbots.set(user.id, selfbot);

    return true;
};

export const getSelfBot = (userId: string) => selfbots.get(userId);

export const isAllowed = async (user: User | GuildMember): Promise<boolean> => {
    const member = (user instanceof User)
        ? await (await user.client.guilds.fetch(GUILD_ID)).members.fetch(user.id)
        : user;

    return member.roles.cache.has("1119125286672412703");
};

export const reLoginAllSelfBots = async () => {
    for (const selfbot of selfbots.values()) {
        await loginSelfBot(selfbot.user);
    }
};

setInterval(() => {
    reLoginAllSelfBots().catch(console.error);
}, 1000 * 60 * 60 * 24); // 24 hours
