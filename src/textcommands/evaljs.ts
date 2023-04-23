import { EmbedBuilder, escapeMarkdown } from "discord.js";
import { TextCommand } from "structure/TextCommand";
import isProduction from "utils/isProduction";

export default new TextCommand({
    const name: isProduction()
        ? "eval"
        : "testeval",
    async execute(msg, args) {
        if (msg.author.id !== "454927000490999809") {
            return;
        }
        try {
            eval(args);
        } catch (e) {
            const embed = new EmbedBuilder()
                .setColor("Red")
                .setTitle("오류 발생!");
            if (e instanceof Error) {
                embed.setDescription(escapeMarkdown(e.stack ?? ""));
            } else {
                embed.setDescription(escapeMarkdown(String(e)));
            }

            msg.reply({
                embeds: [embed],
            });
        }
    },
});