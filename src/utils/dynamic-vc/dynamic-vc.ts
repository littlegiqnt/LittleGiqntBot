import { DYNAMIC_VC_MAX_NUMBER } from "config";
import type { CategoryChannel, Client, GuildMember, VoiceChannel } from "discord.js";
import { ChannelType } from "discord.js";
import TaskQueue from "structure/TaskQueue";

export class DynamicVcManager {
    public static readonly PREFIX = "🎤┃통화방 ";
    public static allInstances: Array<DynamicVcManager> = [];

    protected channels: Array<VoiceChannel> = [];
    protected category!: CategoryChannel;

    private createQueue = new TaskQueue();

    public constructor(public readonly categoryId: string, public readonly createChannelId: string) {
        DynamicVcManager.allInstances.push(this);
    }

    public async init(client: Client): Promise<unknown> {
        const cate = await client.channels.fetch(this.categoryId);
        if (cate == null || cate.type !== ChannelType.GuildCategory) return null;
        this.category = cate;
        await this.category.fetch();

        const children = this.category.children.cache;
        return await Promise.all(children.map(async (c) => {
            if (c.type !== ChannelType.GuildVoice || !c.name.startsWith(DynamicVcManager.PREFIX)) return;

            const num = this.getVoiceChannelNumber(c.name);
            if (Number.isNaN(num) || num > DYNAMIC_VC_MAX_NUMBER || num < 1 || c.members.size === 0) {
                await c.delete();
                return;
            }
            this.channels[num - 1] = c;
        }));
    }

    public onJoinCreateChannel(member: GuildMember) {
        this.createQueue.enqueue(async () => {
            if (this.channels.length >= DYNAMIC_VC_MAX_NUMBER) {
                await member.voice?.disconnect();
                return;
            }
            const num = this.getAvailableNumber();
            this.channels[num - 1] = await this.category.children.create({
                type: ChannelType.GuildVoice,
                name: DynamicVcManager.PREFIX + num,
            });
            await member.voice?.setChannel(this.channels[num - 1]);
        });
    }

    private getAvailableNumber(): number {
        for (let i = 0; i < this.channels.length; i++) {
            if (this.channels[i] === undefined) {
                return i + 1;
            }
        }
        return this.channels.length + 1;
    }

    private getVoiceChannelNumber(channelName: string) {
        return Number.parseInt(channelName.substring(DynamicVcManager.PREFIX.length));
    }

    public onLeaveCreateChannel(channel: VoiceChannel) {
        this.createQueue.enqueue(async () => {
            if (!channel.name.startsWith(DynamicVcManager.PREFIX)) return;
            if (channel.members.size === 0) {
                const num = this.getVoiceChannelNumber(channel.name);
                await channel.delete();
                delete this.channels[num - 1];
            }
        });
    }
}
