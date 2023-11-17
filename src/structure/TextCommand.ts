import type { Message } from "discord.js";
import { PREFIX } from "../config";

export interface TextCommandOptions {
    readonly name: string
    readonly execute: (msg: Message, args: string) => void | Promise<void>
}

export class TextCommand {
    protected readonly name;
    private readonly _execute: (msg: Message, args: string) => void | Promise<void>;
    public constructor(options: TextCommandOptions) {
        this.name = options.name;
        this._execute = options.execute;
    }

    public isMine(msg: Message): boolean {
        return msg.content.toLowerCase()
            .startsWith((PREFIX + this.name).toLowerCase())
            && msg.content.slice(PREFIX.length) != null;
    }

    public execute(msg: Message) {
        return this._execute(msg, msg.content.slice(PREFIX.length + this.name.length));
    }
}
