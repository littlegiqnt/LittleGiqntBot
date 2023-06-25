import { ButtonBuilder, ButtonInteraction, ButtonStyle, EmbedBuilder, GuildMember } from "discord.js";
import { ActionRow } from "structure/ActionRow";
import rolesManager from "structure/RolesManager";
import handleErrorReply from "utils/handleErrorReply";
import logger from "utils/log";
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
            .setColor("Blue")
            .setTitle("🧑‍🤝‍🧑 성별선택")
            .setDescription("먼저, 성별을 선택해 주세요!");
        const row = new ActionRow(
            new ButtonBuilder()
                .setCustomId("guide_2_male")
                .setEmoji("👦")
                .setLabel("남자")
                .setStyle(ButtonStyle.Primary),
            new ButtonBuilder()
                .setCustomId("guide_2_female")
                .setEmoji("👧")
                .setLabel("여자")
                .setStyle(ButtonStyle.Primary),
        );
        interaction.reply({ embeds: [embed], components: [row], ephemeral: true });
    } else if (interaction.customId.startsWith("guide_2_")) {
        if (interaction.customId === "guide_2_male") {
            await Promise.all([
                member.roles.add(rolesManager.get("male")),
                member.roles.remove(rolesManager.get("female")),
            ]);
        } else if (interaction.customId === "guide_2_female") {
            await Promise.all([
                member.roles.remove(rolesManager.get("male")),
                member.roles.add(rolesManager.get("female")),
            ]);
        } else {
            throw new Error("지정되지 않은 customId");
        }
        const embed = new EmbedBuilder()
            .setColor("Blue")
            .setTitle("⏱️ 나이 선택")
            .setDescription(`좋아요! 성별을 ${interaction.customId === "guide_2_male"
                ? "남자"
                : "여자"}로 설정했어요. 이제는 나이를 알려주세요!\n`
                            + "..혹시 나이 공개가 싫으시다면 비공개로 설정할 수는 있어요.");
        const row = new ActionRow(
            new ButtonBuilder()
                .setCustomId("guide_3_adult")
                .setEmoji("🍷")
                .setLabel("성인")
                .setStyle(ButtonStyle.Primary),
            new ButtonBuilder()
                .setCustomId("guide_3_highschool")
                .setEmoji("📖")
                .setLabel("고등학생")
                .setStyle(ButtonStyle.Primary),
            new ButtonBuilder()
                .setCustomId("guide_3_middleschool")
                .setEmoji("📏")
                .setLabel("중학생")
                .setStyle(ButtonStyle.Primary),
        );
        interaction.update({ embeds: [embed], components: [row] });
    } else if (interaction.customId.startsWith("guide_3_")) {
        let ko = "";
        if (interaction.customId === "guide_3_adult") {
            await Promise.all([
                member.roles.add(rolesManager.get("adult")),
                member.roles.remove(rolesManager.get("highschool")),
                member.roles.remove(rolesManager.get("middleschool")),
            ]);
            ko = "성인";
        } else if (interaction.customId === "guide_3_highschool") {
            await Promise.all([
                member.roles.remove(rolesManager.get("adult")),
                member.roles.add(rolesManager.get("highschool")),
                member.roles.remove(rolesManager.get("middleschool")),
            ]);
            ko = "고등학생";
        } else if (interaction.customId === "guide_3_middleschool") {
            await Promise.all([
                member.roles.remove(rolesManager.get("adult")),
                member.roles.remove(rolesManager.get("highschool")),
                member.roles.add(rolesManager.get("middleschool")),
            ]);
            ko = "중학생";
        } else {
            throw new Error("지정되지 않은 customId");
        }
        await member.roles.add(rolesManager.get("stepOneVerified"));
        const embed = new EmbedBuilder()
            .setColor("Blue")
            .setTitle("✔️ 완료")
            .setDescription(`나이를 ${ko}로 설정했어요.\n`
                        + "이제 서버에서 활동하실 수 있어요!");
        logger.verify(member);
        interaction.update({ embeds: [embed], components: [] });
    }
};