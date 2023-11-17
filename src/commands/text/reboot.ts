import { OWNER_ID } from "config";
import { TextCommand } from "structure/TextCommand";

export default new TextCommand({
    name: "reboot",
    execute: async (msg) => {
        if (msg.author.id !== OWNER_ID) {
            return;
        }
        await msg.reply({ content: "끄아악 죽는다" });
        process.exit(1);
    },
});
