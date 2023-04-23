import { ApplicationCommandOptionType } from "discord.js";
import { SlashCommand } from "structure/interaction/command/SlashCommand";

export default new SlashCommand({
    name: "say",
    args: [
        {
            type: ApplicationCommandOptionType.String,
            name: "message",
            description: "보낼 메세지",
        },
    ],
    execute(interaction) {
        const msg = interaction.options.getString("message");
        if (msg == null) return;
        interaction.channel?.send({
            content: msg,
        });
        interaction.reply({
            ephemeral: true,
            content: "✓",
        });
    },
});
