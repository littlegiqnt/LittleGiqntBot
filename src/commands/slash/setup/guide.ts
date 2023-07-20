import { ButtonBuilder, ButtonStyle, EmbedBuilder, TextChannel } from "discord.js";
import { ActionRow } from "structure/ActionRow";
import { SubCommand } from "structure/interaction/command/SubCommand";
import { isNormalTextChannel } from "utils/discordUtils";

export default new SubCommand({
    name: "guide",
    async execute(interaction) {
        interaction.deferReply()
            .then(() => interaction.deleteReply());

        if (interaction.channel == null || !isNormalTextChannel(interaction.channel)) return;

        await send(interaction.channel);
    },
});

const send = async (channel: TextChannel) => {
    const embed = new EmbedBuilder()
        .setColor("Orange")
        .setTitle("✨ 커뮤니티")
        .setDescription(
            "서버 커뮤니티에서 사람들과 대화하고, 니트로 무료 나눔 등의 이벤트에 참여하고 싶으시다면 버튼을 눌러주세요!\n"
            + "커뮤니티에 참여하지 않으셔도 공지는 받을 수 있어요.",
        );
    const row = new ActionRow<ButtonBuilder>(
        new ButtonBuilder()
            .setCustomId("guide_1")
            .setLabel("커뮤니티 참여하기")
            .setStyle(ButtonStyle.Primary),
    );
    await channel.send({ embeds: [embed], components: [row] });
};