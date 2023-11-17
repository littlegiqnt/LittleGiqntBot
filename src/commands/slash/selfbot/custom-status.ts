import { ApplicationCommandOptionType } from "discord.js";
import dbManager from "structure/DBManager";
import { SubCommand } from "structure/interaction/command/SubCommand";
import { getSelfBot, isAllowed, loginSelfBot } from "utils/self-bot";

export default new SubCommand({
    name: "customstatus",
    nameLocales: {
        ko: "사용자지정상태",
    },
    options: [
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
            required: false,
        },
    ],
    execute: async (interaction) => {
        // 허용되지 않은 유저라면
        if (!await isAllowed(interaction.user)) {
            await interaction.reply({ content: "사용 권한이 없어요!", ephemeral: true });
            return;
        }

        const customstatus = interaction.options.getString("custom_status") ?? undefined;
        const userDb = await dbManager.loadUser(interaction.user.id);
        userDb.selfbot.customStatus = customstatus;
        await userDb.save();

        const selfbot = getSelfBot(interaction.user.id);
        if (selfbot == null || !selfbot.client.isReady()) {
            if (await loginSelfBot(interaction.user)) {
                await interaction.reply({ content: "사용자 지정 상태가 변경되고, 계정이 꺼져있어 실행되었어요!", ephemeral: true });
            } else {
                await interaction.reply({ content: "사용자 지정 상태가 변경되었으나 계정 실행에 실패하였어요. 나중에 다시 시도해 보세요!", ephemeral: true });
            }
        } else {
            if (await selfbot.setCustomStatus(customstatus)) {
                await interaction.reply({ content: "사용자 지정 상태가 변경되었어요!", ephemeral: true });
            } else {
                await interaction.reply({ content: "사용자 지정 상태 변경에 실패하였어요.", ephemeral: true });
            }
        }
    },
});
