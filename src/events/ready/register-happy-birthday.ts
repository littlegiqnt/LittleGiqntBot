import { Client } from "discord.js";
import { scheduleJob } from "node-schedule";
import dbManager from "structure/DBManager";
import createReadyEventListener from "./createReadyEventListener";

export default createReadyEventListener(async (client) => {
    scheduleJob("0 0 * * *", () => onEveryDay(client));
});

export const onEveryDay = async (client: Client) => {
    const today = new Date();
    const month = today.getMonth() + 1;
    const day = today.getDate();
    console.log(`${month}월 ${day}일`);
    const users = await dbManager.User.find({
        birthday: {
            month: month,
            day: day,
        },
    });
    for (const u of users) {
        const user = client.users.cache.get(u.id) ?? await client.users.fetch(u.id);
        console.log(user.tag);
    }
};
