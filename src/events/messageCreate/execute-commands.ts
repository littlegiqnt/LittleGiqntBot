import commands from "textcommands";
import createMessageCreateEventListener from "./createMessageCreateEventListener";
import { PREFIX } from "config";

export default createMessageCreateEventListener((msg) => {
    if (!msg.content.startsWith(PREFIX)) return;

    for (const command of commands) {
        if (command.isMine(msg)) {
            command.execute(msg);
            return;
        }
    }
});