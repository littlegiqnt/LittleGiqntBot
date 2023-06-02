import { SubCommand } from "structure/interaction/command/SubCommand";
import { allowedUsers, getSelfBot } from "utils/self-bot";

export default new SubCommand({
    name: "status",
    nameLocales: {
        ko: "현재상태",
    },
    async execute(interaction) {
        // 허용되지 않은 유저라면
        if (!allowedUsers.includes(interaction.user.id)) {
            interaction.reply("사용 권한이 없어요!");
            return;
        }

        const selfbot = getSelfBot(interaction.user.id);
        if (selfbot == null) {
            interaction.reply({ content: "실행되고 있는 계정이 없어요!", ephemeral: true });
            return;
        }

        if (selfbot.client.isReady()) {
            interaction.reply({ content: "켜져있어요!", ephemeral: true });
        } else {
            interaction.reply({ content: "꺼져있어요..", ephemeral: true });
        }
    },
});