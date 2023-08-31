/* eslint-disable no-lonely-if */
import type { ButtonInteraction, MessageComponentInteraction, Role } from "discord.js";
import { GuildMember } from "discord.js";
import rolesManager from "structure/RolesManager";
import TaskQueue from "structure/TaskQueue";
import { handleErrorReply } from "utils/discordUtils";
import createInteractionCreateEventListener from "./createInteractionCreateEventListener";

export default createInteractionCreateEventListener(async (interaction) => {
    if (!interaction.isButton()) return;

    if (interaction.customId.startsWith("selectroles")) {
        processSelectRoles(interaction);
    }
});

const workQueue = new Map<string, TaskQueue>();

const processSelectRoles = (interaction: ButtonInteraction) => {
    let queue = workQueue.get(interaction.user.id);
    if (queue == null) {
        queue = new TaskQueue();
        workQueue.set(interaction.user.id, queue);
    }
    queue.enqueue(async () => {
        await interaction.deferReply({ ephemeral: true });

        const { member } = interaction;
        if (!(member instanceof GuildMember)) {
            handleErrorReply(new Error("member가 GuildMember가 아님"), interaction);
            return;
        }
        switch (interaction.customId) {
            case "selectroles_announcement": {
                const role: Role = rolesManager.get("announcementPing");
                handleSelectableRole(role, member, interaction);
                return;
            }
            case "selectroles_giveaway": {
                const role: Role = rolesManager.get("giveawayPing");
                handleSelectableRole(role, member, interaction);
                return;
            }
            case "selectroles_nsfwpass": {
                const role: Role = rolesManager.get("nsfwpass");
                handleSelectableRole(role, member, interaction);
                return;
            }
            default: {
                interaction.editReply({ content: "실패했어요.. 관리자에게 문의해주세요!" });
                return;
            }
        }

        interaction.editReply({ content: "<a:check:1061576200075620362> 설정되었어요!" });
    });
};

const handleSelectableRole = async (role: Role, member: GuildMember, interaction: MessageComponentInteraction) => {
    if (member.roles.cache.has(role.id)) {
        await member.roles.remove(role);
        interaction.editReply({ content: "➖ 해당 역할을 제거했어요!" });
    } else {
        await member.roles.add(role);
        interaction.editReply({ content: "➕ 해당 역할을 추가했어요!" });
    }
};
