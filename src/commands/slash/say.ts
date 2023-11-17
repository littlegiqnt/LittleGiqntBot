import { ApplicationCommandOptionType } from "discord.js";
import { SlashCommand } from "structure/interaction/command/SlashCommand";
import logUtil from "utils/log";

export default new SlashCommand({
    name: "say",
    options: [
        {
            type: ApplicationCommandOptionType.String,
            name: "message",
            description: "보낼 메세지",
            required: true,
        },
    ],
    execute: async (interaction) => {
        const msg = interaction.options.getString("message");
        if (msg == null) return;
        await logUtil.sayCommand(interaction.user, msg);
        await interaction.channel?.send({
            content: msg,
        });
        await interaction.reply({
            ephemeral: true,
            content: "✓",
        })
            .then(() => interaction.deleteReply());
    },
});
