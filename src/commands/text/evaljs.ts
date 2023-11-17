import { OWNER_ID } from "config";
import { EmbedBuilder, escapeMarkdown } from "discord.js";
import { TextCommand } from "structure/TextCommand";
import { isProduction } from "utils/utils";

export default new TextCommand({
    name: isProduction ? "eval" : "testeval",
    execute: async (msg, args) => {
        if (msg.author.id !== OWNER_ID) {
            return;
        }
        try {
            // eslint-disable-next-line no-eval
            const result = String(await eval(args));
            await msg.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor("#FFFFFF")
                        .setTitle("Evaluation Result")
                        .setDescription(escapeMarkdown(result)),
                ],
            });
        } catch (e) {
            const embed = new EmbedBuilder()
                .setColor("#B10000")
                .setTitle("Evaluation Error");
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
