import { ApplicationCommandOptionType } from "discord.js";
import dbManager from "structure/DBManager";
import { SubCommand } from "structure/interaction/command/SubCommand";
import { allowedUsers, loginSelfBot } from "utils/self-bot";

export default new SubCommand({
    name: "token",
    nameLocales: {
        ko: "토큰",
    },
    args: [
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
        },
    ],
    async execute(interaction) {
        // 허용되지 않은 유저라면
        if (!allowedUsers.includes(interaction.user.id)) {
            interaction.reply("사용 권한이 없어요!");
            return;
        }

        await interaction.deferReply({ ephemeral: true });
        const userDb = await dbManager.loadUser(interaction.user.id);
        userDb.selfbot.token = interaction.options.getString("token")!;
        await userDb.save();
        if (await loginSelfBot(interaction.user.id)) {
            interaction.editReply({ content: "실행되었어요!" });
        } else {
            interaction.editReply({ content: "오류가 발생했어요! 올바른 토큰을 입력했는지 확인해 주세요." });
        }
    },
});