import { EmbedBuilder, GuildMember } from "discord.js";
import dbManager from "structure/DBManager";
import { SubCommand } from "structure/interaction/command/SubCommand";

export default new SubCommand({
    name: "remove",
    nameLocales: {
        ko: "지우기",
    },
    description: {
        en: "Do you want me to forget everything about your relationship?",
        ko: "제가 연인사이에 관련된 내용을 잊기를 원하시나요?",
    },
    async execute(interaction) {
        await interaction.deferReply({ ephemeral: false });
        const member = interaction.member;
        if (!(member instanceof GuildMember)) {
            throw new Error("member가 GuildMember가 아님");
        }
        const user = await dbManager.loadUser(member.id);
        if (user.coupleSince == null) {
            const embed = new EmbedBuilder()
                .setColor("Blue")
                .setTitle("어.. 이미 저는 모르고 있어요!")
                .setDescription("혹시 저한테 말해주신 적이 없는 건 아닌가요..?");
            interaction.editReply({ embeds: [embed] });
            return;
        }
        user.coupleSince = undefined;
        const embed = new EmbedBuilder()
            .setColor("Green")
            .setDescription("어엇.. 잊어버렸어요..");
        interaction.editReply({ embeds: [embed] });
    },
});
