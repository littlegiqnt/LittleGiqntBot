import { config } from "dotenv";
import Bot from "structure/Bot";
import dbManager from "structure/DBManager";
import registerExceptionListener from "utils/registerExceptionListener";
import { DB_URI } from "config";
import events from "./events";

config();
export const bot: Bot = new Bot({
    token: process.env.TOKEN!,
});

(async () => {
    await dbManager.connect(DB_URI);

    bot.registerEvents(events);
    await bot.login()
        .then(() => {
            registerExceptionListener();
        });
})().catch(() => process.exit(1));
