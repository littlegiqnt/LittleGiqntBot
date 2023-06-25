import { User } from "discord.js";
import { Client, CustomStatus } from "discord.js-selfbot-v13";
import logger from "utils/log";

export class SelfBot {
    protected customStatus?: string;

    public readonly client = new Client({
        syncStatus: true,
        checkUpdate: false,
    });

    public constructor(public readonly user: User, public readonly token: string) {
    }

    /**
     * login
     */
    public async login(): Promise<boolean> {
        try {
            await this.client.login(this.token);
        } catch (e) {
            logger.selfbotError(
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
            this.client.destroy();
            logger.selfbotError(this, "로그인 중 오류 발생");
            return false;
        }

        // 만약 해당 계정이 셀프봇 주인이 아니라면
        if (this.client.user.id !== this.user.id) {
            this.client.destroy();
            logger.selfbotError(this, "유저 아이디가 일치하지 않아 실패");
            return false;
        }

        this.client.user.setStatus("idle");
        if (this.customStatus != null) {
            const a = new CustomStatus()
                .setState(this.customStatus);
            this.client.user.setActivity(a);
        }
        this.client.user.setAFK(true);

        // 로그
        logger.selfbotLogin(this);
        return true;
    }

    public setCustomStatus(customStatus: string | undefined): boolean {
        this.customStatus = customStatus;
        if (this.client.isReady()) {
            if (customStatus != null) {
                const a = new CustomStatus()
                    .setState(customStatus);
                this.client.user?.setActivity(a);
                this.client.user?.setAFK(true);
                logger.selfbotCustomStatusChange(this);
                return true;
            }
        }
        return false;
    }

    public getCustomStatus() {
        return this.customStatus;
    }
}