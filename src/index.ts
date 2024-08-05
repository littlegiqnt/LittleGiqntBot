import Bot from "structure/Bot";
import dbManager from "structure/DBManager";
import registerExceptionListener from "utils/registerExceptionListener";
import { DB_URI } from "config";
import events from "./events";

export const bot: Bot = new Bot({
    token: process.env.TOKEN!,
});

let isTerminating = false;
const terminate = () => {
    if (isTerminating) return;
    isTerminating = true;
    bot.destroy()
        .then(() => process.exit(0))
        .catch((error) => {
            console.error(error);
            process.exit(1);
        });
};
process.on("SIGINT", terminate);
process.on("SIGTERM", terminate);

(async () => {
    await dbManager.connect(DB_URI);

    bot.registerEvents(events);
    await bot.login()
        .then(() => {
            registerExceptionListener();
        });
})().catch((error) => {
    console.error(error);
    process.exit(1);
});
