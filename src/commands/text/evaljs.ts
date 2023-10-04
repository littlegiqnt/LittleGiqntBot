import { OWNER_ID } from "config";
import { EmbedBuilder, escapeMarkdown } from "discord.js";
import { TextCommand } from "structure/TextCommand";
import isProduction from "utils/isProduction";

export default new TextCommand({
    name: isProduction()
        ? "eval"
        : "testeval",
    async execute(msg, args) {
        if (msg.author.id !== OWNER_ID) {
            return;
        }
        try {
            const result = await eval(args.join(" ")) as unknown;
            await msg.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor("White")
                        .setTitle("Eval")
                        // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
                        .setDescription("" + result),
                ],
            });
        } catch (e) {
            const embed = new EmbedBuilder()
                .setColor("Red")
                .setTitle("오류 발생!");
            if (e instanceof Error) {
                embed.setDescription(escapeMarkdown(e.stack ?? ""));
            } else {
                embed.setDescription(escapeMarkdown(String(e)));
            }

            await msg.reply({
                embeds: [embed],
            });
        }
    },
});