import { ApplicationCommandOptionType, EmbedBuilder } from "discord.js";
import { SlashCommand } from "structure/interaction/command/SlashCommand";
import { isNormalTextChannel } from "utils/discordUtils";

export default new SlashCommand({
    name: "clear",
    description: {
        en: "Delete messages",
        ko: "메세지 삭제",
    },
    options: [
        {
            type: ApplicationCommandOptionType.Integer,
            name: "amount",
            description: "Amount of messages to delete",
            descriptionLocalizations: {
                ko: "지울 메세지 개수",
            },
            required: true,
        },
    ],
    execute: async (interaction) => {
        const { channel } = interaction;
        const amount = interaction.options.getInteger("amount")!;
        if (channel == null || !isNormalTextChannel(channel)) return;

        await interaction.deferReply({ ephemeral: true });

        const size = (await channel.bulkDelete(amount).catch(() => undefined))?.size ?? 0;

        const embed = new EmbedBuilder()
            .setColor("Green")
            .setTitle("삭제 성공!")
            .setDescription(`총 ${size}/${amount}개의 메세지가 삭제됐어요!`);

        await interaction.editReply({ embeds: [embed] });
    },
});
