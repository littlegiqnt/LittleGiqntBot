import { TextCommand } from "structure/TextCommand";

export default new TextCommand({
    name: "reboot",
    async execute(msg) {
        if (msg.author.id !== "454927000490999809") {
            return;
        }
        await msg.reply({ content: "끄아악 죽는다" });
        process.exit(1);
    },
});