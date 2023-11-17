import { SubCommand } from "structure/interaction/command/SubCommand";
import { getSelfBot, isAllowed } from "utils/self-bot";

export default new SubCommand({
    name: "status",
    nameLocales: {
        ko: "현재상태",
    },
    execute: async (interaction) => {
        // 허용되지 않은 유저라면
        if (!await isAllowed(interaction.user)) {
            await interaction.reply({ content: "사용 권한이 없어요!", ephemeral: true });
            return;
        }

        const selfbot = getSelfBot(interaction.user.id);
        if (selfbot == null) {
            await interaction.reply({ content: "실행되고 있는 계정이 없어요!", ephemeral: true });
            return;
        }

        if (selfbot.client.isReady()) {
            await interaction.reply({ content: "켜져있어요!", ephemeral: true });
        } else {
            await interaction.reply({ content: "꺼져있어요..", ephemeral: true });
        }
    },
});
