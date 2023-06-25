import { ApplicationCommandOptionType } from "discord.js";
import { SubCommand } from "structure/interaction/command/SubCommand";
import { getSelfBot, isAllowed } from "utils/self-bot";

export default new SubCommand({
    name: "customstatus",
    nameLocales: {
        ko: "사용자지정상태",
    },
    optionalArgs: [
        {
            type: ApplicationCommandOptionType.String,
            name: "custom_status",
            nameLocalizations: {
                ko: "사용자지정상태",
            },
            description: "Custom status to set",
            descriptionLocalizations: {
                ko: "설정할 사용자 지정 상태",
            },
        },
    ],
    async execute(interaction) {
        // 허용되지 않은 유저라면
        if (!await isAllowed(interaction.user)) {
            interaction.reply({ content: "사용 권한이 없어요!", ephemeral: true });
            return;
        }

        const customstatus = interaction.options.getString("custom_status") ?? undefined;
        const selfbot = getSelfBot(interaction.user.id);
        if (selfbot == null || !selfbot.client.isReady()) {
            interaction.reply({ content: "실행되고 있는 계정이 없어요!", ephemeral: true });
            return;
        }
        if (selfbot.setCustomStatus(customstatus)) {
            interaction.reply({ content: "사용자 지정 상태를 설절했어요!", ephemeral: true });
        } else {
            interaction.reply({
                content: "설정하지 못했어요. 현재 계정이 실행되고 있는지 확인해 보세요.",
                ephemeral: true,
            });
        }
    },
});