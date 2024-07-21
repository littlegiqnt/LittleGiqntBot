import { ApplicationCommandOptionType, EmbedBuilder, GuildMember, userMention } from "discord.js";
import dbManager from "structure/DBManager";
import { SubCommand } from "structure/interaction/command/SubCommand";

export default new SubCommand({
    name: "set",
    nameLocales: {
        ko: "설정",
    },
    description: {
        en: "Tell me your birthday!",
        ko: "저한테 생일을 알려주세요!",
    },
    options: [
        {
            type: ApplicationCommandOptionType.Integer,
            name: "month",
            nameLocalizations: {
                ko: "월",
            },
            description: "What month is it?",
            descriptionLocalizations: {
                ko: "월을 입력해 주세요!",
            },
            required: true,
        },
        {
            type: ApplicationCommandOptionType.Integer,
            name: "day",
            nameLocalizations: {
                ko: "일",
            },
            description: "What day is it?",
            descriptionLocalizations: {
                ko: "일을 입력해 주세요!",
            },
            required: true,
        },
    ],
    execute: async (interaction) => {
        await interaction.deferReply({ ephemeral: false });
        const { member } = interaction;
        if (!(member instanceof GuildMember)) {
            throw new TypeError("member가 GuildMember가 아님");
        }
        const user = await dbManager.loadUser(member.id);

        if (user.birthday.month != null && user.birthday.day != null) {
            const embed = new EmbedBuilder()
                .setColor("Red")
                .setTitle("이미 생일을 말해주셨어요.")
                .setDescription(`${userMention(member.id)}님의 생일은 ${user.birthday.month}월 ${user.birthday.day}일로 기억해요!\n`
                + "만약 잘못 말해주셨다면 관리자에게 문의해 주세요.");
            await interaction.editReply({ embeds: [embed] });
            return;
        }

        const month = interaction.options.getInteger("month");
        const day = interaction.options.getInteger("day");
        if (month != null && month >= 1 && month <= 12
          && day != null && day >= 1 && day <= 31) {
            user.birthday.month = month;
            user.birthday.day = day;
            await user.save();
            const embed = new EmbedBuilder()
                .setColor("Green")
                .setTitle("생일을 기억할게요!")
                .setDescription(`${userMention(member.id)}님의 생일은 ${month}월 ${day}일 이에요!`);
            await interaction.editReply({ embeds: [embed] });
        } else {
            const embed = new EmbedBuilder()
                .setColor("Red")
                .setTitle("잘못된 날짜를 입력하셨어요!")
                .setDescription("다시 한번 확인해 주세요!");
            await interaction.editReply({ embeds: [embed] });
        }
    },
});
