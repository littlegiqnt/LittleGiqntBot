import { TextCommand } from "structure/TextCommand";

export default new TextCommand({
    name: "eval",
    async execute(msg, args) {
        if (msg.author.id !== "454927000490999809") {
            return;
        }
        eval(args);
    },
});