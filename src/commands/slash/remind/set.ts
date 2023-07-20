import { ApplicationCommandOptionType, EmbedBuilder, codeBlock, userMention } from "discord.js";
import { SubCommand } from "structure/interaction/command/SubCommand";
import reminders from "./reminders";

export default new SubCommand({
    name: "set",
    nameLocales: {
        ko: "설정",
    },
    description: {
        en: "Remind me later!",
        ko: "좀 있다 다시 알려줘!",
    },
    args: [
        {
            type: ApplicationCommandOptionType.Integer,
            name: "hour",
            nameLocalizations: {
                ko: "시간",
            },
            description: "How many hours later should I remind you?",
            descriptionLocalizations: {
                ko: "몇 시간 후에 알려드릴까요?",
            },
        },
        {
            type: ApplicationCommandOptionType.Integer,
            name: "minute",
            nameLocalizations: {
                ko: "분",
            },
            description: "How many minutes later should I remind you?",
            descriptionLocalizations: {
                ko: "몇 분 후에 알려드릴까요?",
            },
        },
    ],
    optionalArgs: [
        {
            type: ApplicationCommandOptionType.String,
            name: "message",
            nameLocalizations: {
                ko: "메세지",
            },
            description: "What message should I remind you with?",
            descriptionLocalizations: {
                ko: "어떤 메세지와 함께 알려드릴까요?",
            },
        },
    ],
    async execute(interaction) {
        await interaction.deferReply();
        const user = interaction.user;
        const hours = interaction.options.getInteger("hour") ?? 0;
        const minutes = interaction.options.getInteger("minute") ?? 0;
        const message = interaction.options.getString("message") ?? "설정하신 메세지가 없어요";

        if (hours < 0 || minutes < 0) {
            interaction.editReply({ embeds: [
                new EmbedBuilder()
                    .setColor("Red")
                    .setTitle("어엇")
                    .setDescription("마이너스 일 수는 없어요"),
            ] });
            return;
        } else if (hours === 0 && minutes === 0) {
            interaction.editReply({ embeds: [
                new EmbedBuilder()
                    .setColor("Red")
                    .setTitle("어엇")
                    .setDescription("지금 바로 알려드리라고요..?"),
            ] });
            return;
        }

        const ms = 1000 * 60 * (minutes + (hours * 60));
        const timeout: ReturnType<typeof setTimeout> = setTimeout(() => {
            reminders.delete(user.id);
            interaction.channel?.send({
                content: userMention(user.id),
                embeds: [
                    new EmbedBuilder()
                        .setColor("Purple")
                        .setTitle("알림!")
                        .setDescription(`전에 부탁하셨던 알림이에요!\n${
                            codeBlock(message)}`),
                ],
                allowedMentions: { users: [user.id] },
            });
        }, ms);

        reminders.set(user.id, {
            userId: interaction.user.id,
            timeout: timeout,
            end: Date.now() + ms,
        });

        interaction.editReply({ embeds: [
            new EmbedBuilder()
                .setColor("Green")
                .setTitle("기억했어요!")
                .setDescription(`${hours}시간 ${minutes}분 후에 알려드릴게요`),
        ] });
    },
});