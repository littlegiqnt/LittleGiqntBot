import { Client, CustomStatus } from "discord.js-selfbot-v13";

export class SelfBot {
    protected customStatus?: string;

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
        console.log(`[SelfBot] ${this.userId} ${this.client.user.username} : 로그인 성공`);
        this.client.user.setStatus("idle");
        if (this.customStatus != null) {
            const a = new CustomStatus()
                .setState(this.customStatus);
            this.client.user?.setActivity(a);
        }
        this.client.user.setAFK(true);
    }

    public setCustomStatus(customStatus: string | undefined): boolean {
        this.customStatus = customStatus;
        if (this.client.isReady()) {
            if (customStatus != null) {
                const a = new CustomStatus()
                    .setState(customStatus);
                this.client.user?.setActivity(a);
                this.client.user?.setAFK(true);
                return true;
            }
        }
        return false;
    }
}