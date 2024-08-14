import type { User } from "discord.js";
import { Client } from "eris";

export class SelfBot extends Client {
    public readonly owner: User;

    public constructor(
        user: User,
        token: string,
    ) {
        super(token, {
            intents: [],
        });
        this.owner = user;
    }
}
