import { ApplicationCommandOptionType } from "discord.js";
import dbManager from "structure/DBManager";
import { SubCommand } from "structure/interaction/command/SubCommand";
import { isAllowed, loginSelfBot } from "utils/self-bot";

export default new SubCommand({
    name: "token",
    nameLocales: {
        ko: "토큰",
    },
    options: [
        {
            type: ApplicationCommandOptionType.String,
            name: "token",
            nameLocalizations: {
                ko: "토큰",
            },
            description: "Token of your account",
            descriptionLocalizations: {
                ko: "현재 계정의 토큰",
            },
            required: true,
        },
    ],
    execute: async (interaction) => {
        // 허용되지 않은 유저라면
        if (!await isAllowed(interaction.user)) {
            await interaction.reply({ content: "사용 권한이 없어요!", ephemeral: true });
            return;
        }

        await interaction.deferReply({ ephemeral: true });
        const userDb = await dbManager.loadUser(interaction.user.id);
        userDb.selfbot.token = interaction.options.getString("token")!;
        await userDb.save();
        if (await loginSelfBot(interaction.user)) {
            await interaction.editReply({ content: "실행되었어요!" });
        } else {
            await interaction.editReply({ content: "오류가 발생했어요! 올바른 토큰을 입력했는지 확인해 주세요." });
        }
    },
});
