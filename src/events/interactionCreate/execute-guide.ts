import { ButtonBuilder, ButtonInteraction, ButtonStyle, EmbedBuilder, GuildMember, channelMention } from "discord.js";
import { ActionRow } from "structure/ActionRow";
import rolesManager from "structure/RolesManager";
import { handleErrorReply } from "utils/discordUtils";
import logUtil from "utils/log";
import createInteractionCreateEventListener from "./createInteractionCreateEventListener";

export default createInteractionCreateEventListener(async (interaction) => {
    if (!interaction.isButton()) return;

    if (interaction.customId.startsWith("guide_")) {
        try {
            await processGuide(interaction);
        } catch (e) {
            handleErrorReply(e, interaction);
        }
    }
});

const processGuide = async (interaction: ButtonInteraction) => {
    const { member } = interaction;
    if (!(member instanceof GuildMember)) {
        handleErrorReply(new Error("member가 GuildMember가 아님"), interaction);
        return;
    }
    if (interaction.customId === "guide_1") {
        const embed = new EmbedBuilder()
            .setColor("White")
            .setTitle("서버 커뮤니티에 참여하시려고요?")
            .setDescription(`먼저 ${channelMention("1095308252956340244")}에서 규칙을 꼼꼼히 읽어주세요.`);
        const row = new ActionRow(
            new ButtonBuilder()
                .setCustomId("guide_2")
                .setEmoji("✔️")
                .setLabel("숙지했어요")
                .setStyle(ButtonStyle.Primary),
        );
        interaction.reply({ embeds: [embed], components: [row], ephemeral: true });
    } else if (interaction.customId.startsWith("guide_2")) {
        await member.roles.add(rolesManager.get("community"));
        const embed = new EmbedBuilder()
            .setColor("Green")
            .setTitle("✅ 완료")
            .setDescription(`성별을 ${interaction.customId === "guide_3_male" ? "남자" : "여자"}로 설정했어요.\n`
                + "이제 서버에서 활동하실 수 있어요!");
        logUtil.verify(member);
        interaction.update({ embeds: [embed], components: [] });
    }
};