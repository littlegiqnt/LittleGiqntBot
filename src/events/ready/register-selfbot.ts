import dbManager from "structure/DBManager";
import { loginSelfBot } from "utils/self-bot";
import createReadyEventListener from "./createReadyEventListener";

export default createReadyEventListener(async () => {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    const users = await dbManager.User.find({ "selfbot.token": { $ne: null } });
    users.forEach((user) => {
        loginSelfBot(user.id);
    });
});
