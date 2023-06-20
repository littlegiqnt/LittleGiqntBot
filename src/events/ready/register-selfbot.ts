import { OWNER_ID } from "config";
import { scheduleJob } from "node-schedule";
import dbManager from "structure/DBManager";
import { getSelfBot, loginSelfBot } from "utils/self-bot";
import { getRandomInt } from "utils/utils";
import createReadyEventListener from "./createReadyEventListener";

export default createReadyEventListener(async () => {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    const users = await dbManager.User.find({ "selfbot.token": { $ne: null } });
    users.forEach((user) => {
        loginSelfBot(user.id);
    });
    onEveryDay();
});

const onEveryDay = () => {
    scheduleJob("0 0 * * *", async () => setTimeout(() => {
        const selfbot = getSelfBot(OWNER_ID);
        if (selfbot == null) return;
        selfbot.client.channels.fetch("877417656729362432")
            .then((channel) => {
                if (!channel?.isText()) return;
                channel.send("ㅊㅊ");
            });
    }, Math.floor(getRandomInt(2000, 13000))),
    );
};