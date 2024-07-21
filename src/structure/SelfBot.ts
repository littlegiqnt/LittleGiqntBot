import type { User } from "discord.js";
import type { PartialTypes, PresenceData } from "discord.js-selfbot-v13";
import { Client, CustomStatus } from "discord.js-selfbot-v13";
import logUtil from "utils/log";

export class SelfBot {
    public readonly client: Client;

    public constructor(
        public readonly user: User,
        public readonly token: string,
        protected customStatus?: string,
        protected partials?: Array<PartialTypes>,
    ) {
        this.client = new Client({
            partials: partials ?? [],
            presence: this.buildPresenceData(),
        });
    }

    /**
     * login
     */
    public async login(): Promise<boolean> {
        try {
            await this.client.login(this.token);
        } catch (e) {
            await logUtil.selfbotError(
                this,
                "로그인 실패",
                e instanceof Error
                    ? e
                    : undefined,
            );
            return false;
        }

        // 만약 클라이언트 유저가 null이라면
        if (this.client.user == null) {
            await this.client.logout();
            await logUtil.selfbotError(this, "로그인 중 오류 발생");
            return false;
        }

        // 만약 해당 계정이 셀프봇 주인이 아니라면
        if (this.client.user.id !== this.user.id) {
            await this.client.logout();
            await logUtil.selfbotError(this, "유저 아이디가 일치하지 않아 실패");
            return false;
        }
        await this.updatePresence();
        await logUtil.selfbotLogin(this);
        return true;
    }

    private buildPresenceData(): PresenceData {
        return {
            status: "idle",
            afk: true,
            activities: this.customStatus == null ? undefined : [new CustomStatus(this.client).setState(this.customStatus)],
        };
    }

    public updatePresence() {
        if (!this.client.isReady()) return;
        this.client.user?.setPresence(this.buildPresenceData());
    }

    public async setCustomStatus(customStatus: string | undefined): Promise<boolean> {
        this.customStatus = customStatus;
        this.updatePresence();
        await logUtil.selfbotCustomStatusChange(this);
        return true;
    }

    public getCustomStatus() {
        return this.customStatus;
    }
}
