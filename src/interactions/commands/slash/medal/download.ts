import { ApplicationCommandOptionType, EmbedBuilder } from "discord.js";
import { SubCommand } from "structure/interaction/command/SubCommand";
import { getMedalClip } from "utils/medal/medalVid";

export default new SubCommand({
    name: "download",
    nameLocales: {
        ko: "다운로드",
    },
    description: {
        en: "Download medal clip",
        ko: "Medal 클립 다운로드",
    },
    args: [
        {
            type: ApplicationCommandOptionType.String,
            name: "url",
            description: "url of the medal clip",
        },
    ],
    async execute(interaction) {
        const clip = await getMedalClip(interaction.options.getString("url")!);
        if (clip == null) {
            interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor("Red")
                        .setTitle("클립을 가져오지 못했어요!")
                        .setDescription("혹시 url를 잘못 입력하신건 아닌지 확인해 보세요."),
                ],
            });
        } else {
            interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor("Green")
                        .setTitle(`${clip.contentTitle ?? "Untitled"} - Medal Clip`)
                        .setImage(clip[`thumbnail${clip.bestQuality}p`])
                        .setDescription(`Raw Video Link: [Click](${clip.contentUrlBestQuality})`),
                ],
            });
        }
    },
});