import type { Role, StringSelectMenuInteraction } from "discord.js";
import { GuildMember } from "discord.js";
import rolesManager from "structure/RolesManager";
import handleErrorReply from "utils/handleErrorReply";
import createInteractionCreateEventListener from "./createInteractionCreateEventListener";

export default createInteractionCreateEventListener(async (interaction) => {
    if (!interaction.isStringSelectMenu()) return;

    try {
        if (interaction.customId === "selectroles_games") {
            await processSelectGames(interaction);
        }
    } catch (e) {
        handleErrorReply(e, interaction);
    }
});

const processSelectGames = async (interaction: StringSelectMenuInteraction) => {
    await interaction.deferReply({ ephemeral: true });

    const { member } = interaction;
    if (!(member instanceof GuildMember)) {
        throw new Error("member가 GuildMember가 아님");
    }

    const rolesToAdd: Array<Role> = [];
    interaction.values.forEach((value: string) => {
        const role = rolesManager.get(value as keyof typeof rolesManager.rolesId) ?? null;
        if (role == null) return;
        rolesToAdd.push(role);
    });
    await member.roles.remove(await rolesManager.getGrouped("games") ?? []);
    await member.roles.add(rolesToAdd);
    if (rolesToAdd.length === interaction.values.length) {
        interaction.editReply("선택하신 게임들로 적용해 드렸어요!");
    } else {
        interaction.editReply(`약간의 오류가 발생해서 선택하신 역할 중 ${rolesToAdd.length}개만 적용할 수 있었어요...ㅠㅠ 관리자에게 문의해 주세요!`);
    }
};
