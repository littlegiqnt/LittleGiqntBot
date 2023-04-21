import type { ClientOptions } from "discord.js";
import { Client, GatewayIntentBits as Intents } from "discord.js";
import type { AllEventListener } from "./EventListener";

export interface BotOptions extends Omit<ClientOptions, "intents"> {
    readonly token: string
    readonly intents?: Array<Intents>
}
export default class Bot extends Client {
    public constructor(options: BotOptions) {
        super({
            ...options,
            allowedMentions: options.allowedMentions ?? {
                repliedUser: false,
            },
            intents: options.intents ?? [
                Intents.Guilds,
                Intents.GuildMessages,
                Intents.MessageContent,
                Intents.GuildMembers,
                Intents.GuildPresences,
                Intents.GuildVoiceStates,
            ],
        });
        this.token = options.token;
    }

    public registerEvents(events: Array<Array<AllEventListener>>) {
        for (const event of events) {
            for (const eventListener of event) {
                super.on(eventListener.eventName, eventListener.listener);
            }
        }
    }

    public async login() {
        return super.login(this.token!);
    }
}
