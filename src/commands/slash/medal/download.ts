import { ApplicationCommandOptionType, EmbedBuilder } from "discord.js";
import { SubCommand } from "structure/interaction/command/SubCommand";
import logUtil from "utils/log";
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
    options: [
        {
            type: ApplicationCommandOptionType.String,
            name: "url",
            description: "url of the medal clip",
            required: true,
        },
    ],
    execute: async (interaction) => {
        const url = interaction.options.getString("url")!;
        const clip = await getMedalClip(url) as { [key: string]: string } | null;
        if (clip == null) {
            await interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor("Red")
                        .setTitle("클립을 가져오지 못했어요!")
                        .setDescription("혹시 url를 잘못 입력하신건 아닌지 확인해 보세요.\nFailed to fetch."),
                ],
            });
            await logUtil.medalDownloadCommand(interaction.user, url, "failed");
        } else {
            await interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor("Green")
                        .setTitle(`${clip.contentTitle ?? "Untitled"} - Medal Clip`)
                        .setImage(clip[`thumbnail${clip.bestQuality}p`])
                        .setDescription(`Raw Video Link: [Click](${clip.contentUrlBestQuality})`),
                ],
            });
            await logUtil.medalDownloadCommand(interaction.user, url, clip.contentUrlBestQuality);
        }
    },
});
