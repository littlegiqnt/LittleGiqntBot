import { SubCommand } from "structure/interaction/command/SubCommand";
import { isAllowed, loginSelfBot } from "utils/self-bot";

export default new SubCommand({
    name: "relogin",
    nameLocales: {
        ko: "재로그인",
    },
    async execute(interaction) {
        // 허용되지 않은 유저라면
        if (!await isAllowed(interaction.user)) {
            interaction.reply({ content: "사용 권한이 없어요!", ephemeral: true });
            return;
        }

        await interaction.deferReply({ ephemeral: true });
        if (await loginSelfBot(interaction.user.id)) {
            interaction.editReply({ content: "실행되었어요!" });
        } else {
            interaction.editReply({ content: "오류가 발생했어요! 올바른 토큰을 입력했는지 확인해 주세요." });
        }
    },
});