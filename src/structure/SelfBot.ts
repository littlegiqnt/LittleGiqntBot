import { Client } from "discord.js-selfbot-v13";

export class SelfBot {
    public readonly client = new Client({
        syncStatus: true,
        checkUpdate: false,
    });

    public constructor(public readonly userId: string, public readonly token: string) {
    }

    /**
     * login
     */
    public async login() {
        try {
            await this.client.login(this.token);
        } catch (e) {
            console.log(`[SelfBot] ${this.userId} : 로그인 실패`);
            throw e;
        }
        if (this.client.user?.id !== this.userId) {
            this.client.destroy();
            console.log(`[SelfBot] ${this.userId} : 유저 아이디가 일치하지 않아 실행 실패`);
            throw new Error("유저 아이디가 일치하지 않아 실패");
        }
        console.log(`[SelfBot] ${this.userId} ${this.client.user.tag} : 로그인 성공`);
        this.client.user.setStatus("idle");
        this.client.user.setAFK(true);
    }
}