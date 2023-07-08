import * as axios from "axios";

export default class MedalApi {
    private axios: axios.AxiosInstance;

    public constructor() {
        this.axios = axios.create({
            withCredentials: true,
        });
    }

    public async authentificate(username: string, password: string) {
        if (username == null || password == null) {
            throw new Error("Username or password missing");
        }

        const { data: user } = await this.axios.post("https://api-v2.medal.tv/authentication", {
            password,
            userName: username,
        });
        this.axios.interceptors.request.use((config) => {
            config.headers["x-authentication"] = `${user.userId},${user.key}`;
            return config;
        });
    }

    public async guestAuthentificate() {
        const password = "superstrongpassword";
        const { data: user } = await this.axios.post("https://api-v2.medal.tv/users", {
            email: "guest",
            password,
            userName: "guest",
        });
        const username = user.displayName;
        await this.authentificate(username, password);
    }

    public async getUser(userId: string) {
        const userUrl = `https://api-v2.medal.tv/users/${userId}`;
        const { data: user } = await this.axios.get(userUrl);
        return user;
    }

    public async listVideos(userId: string, max?: number, categoryId?: string) {
        let objs: Array<axios.AxiosResponse> = [];
        let data = null;
        let offset = 0;
        const category = categoryId != null
            ? `&categoryId=${categoryId}`
            : "";
        const maxPerRequest = 1000;
        // eslint-disable-next-line no-constant-condition
        while (true) {
            const limit = max != null
                ? Math.min(max - offset, maxPerRequest)
                : maxPerRequest;
            data = (
            // eslint-disable-next-line no-await-in-loop
                await this.axios.get(
                    `https://api-v2.medal.tv/content?userId=${userId}${category}&limit=${limit}&offset=${offset}`,
                )
            ).data;

            objs = [...objs, ...data];
            offset += data.length;
            if (data.length === 0 || data.length < limit || limit < maxPerRequest) {
                break;
            }
        }
        return objs;
    }

    public async loadUserIdFromUsername(username: string) {
        try {
            const { data } = await this.axios.get(`https://medal.tv/api/users?username=${username}`);
            if (data.length === 0) {
                console.error(`No user found for '${username}'`);
                return null;
            }
            return data[0].userId;
        } catch (e) {
            console.error(e);
        }
        return null;
    }

    public async loadUserIdFromUrl(userUrl: string) {
        const userIdInUrl = userUrl.match(/\/users\/([0-9]+(\/|$))/);
        if (userIdInUrl?.[1] != null) {
            return userIdInUrl[1];
        }
        const usernameInUrl = userUrl.match(/\/u\/(.+)/);
        if (usernameInUrl?.[1] != null) {
            return this.loadUserIdFromUsername(usernameInUrl[1]);
        }
        return null;
    }

    public async getContent(contentId: string) {
        const { data: content } = await this.axios.get(`https://medal.tv/api/content/${contentId}`);
        const quality = ["1080", "720", "480", "360", "240", "144"];
        const bestQuality = quality.find((q) => content[`contentUrl${q}p`]);
        content.bestQuality = bestQuality;
        content.contentUrlBestQuality = content[`contentUrl${bestQuality}p`];
        return content;
    }

    public async loadClipIdFromUrl(clipUrl: string) {
        const regex = /clips\/([^/]+)/;
        const match = clipUrl.match(regex);
        return match?.[1];
    }
}