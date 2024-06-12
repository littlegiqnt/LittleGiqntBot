import { EmbedBuilder, userMention } from "discord.js";
import { SubCommand } from "structure/interaction/command/SubCommand";
import reminders from "./reminders";

export default new SubCommand({
    name: "cancel",
    nameLocales: {
        ko: "취소",
    },
    description: {
        en: "Do you want to cancel the reminder?",
        ko: "알림을 취소할까요?",
    },
    execute: async (interaction) => {
        const user = interaction.user;
        const reminder = reminders.get(user.id);

        if (reminder == null) {
            await interaction.reply({ embeds: [
                new EmbedBuilder()
                    .setColor("Red")
                    .setTitle("어엇")
                    .setDescription(`${userMention(user.id)}님에게 예정되어 있는 알림이 없어요!`),
            ] });
            return;
        }

        clearTimeout(reminder.timer);
        reminders.delete(user.id);
        await interaction.reply({ embeds: [
            new EmbedBuilder()
                .setColor("Blue")
                .setTitle("성공")
                .setDescription("알림이 취소되었어요!"),
        ] });
    },
});
