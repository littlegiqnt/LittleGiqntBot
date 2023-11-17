import commands from "commands/text";
import { PREFIX } from "config";
import createMessageCreateEventListener from "./createMessageCreateEventListener";

export default createMessageCreateEventListener(async (msg) => {
    if (!msg.content.startsWith(PREFIX)) return;

    for (const command of commands) {
        if (command.isMine(msg)) {
            await command.execute(msg);
            return;
        }
    }
});
