import { APISelectMenuOption, ButtonBuilder, ButtonStyle, EmbedBuilder, StringSelectMenuBuilder, TextBasedChannel } from "discord.js";
import { ActionRow } from "structure/ActionRow";
import { SubCommand } from "structure/interaction/command/SubCommand";

export default new SubCommand({
    name: "roles",
    async execute(interaction) {
        interaction.deferReply()
            .then(() => interaction.deleteReply());

        if (interaction.channel == null) return;

        await loveSelect(interaction.channel);
        await dmSelect(interaction.channel);
        await pingRelatedSelect(interaction.channel);
        await gamesSelect(interaction.channel);
        await nsfwPass(interaction.channel);
    },
});

// eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
const genderSelect = async (channel: TextBasedChannel) => {
    const embed = new EmbedBuilder()
        .setColor("Blue")
        .setTitle(":restroom: 『성별선택』")
        .setDescription("본인의 성별을 선택해 주세요");
    const row = new ActionRow(
        new ButtonBuilder()
            .setCustomId("selectroles_male")
            .setEmoji("👦")
            .setLabel("남자")
            .setStyle(ButtonStyle.Primary),
        new ButtonBuilder()
            .setCustomId("selectroles_female")
            .setEmoji("👧")
            .setLabel("여자")
            .setStyle(ButtonStyle.Primary),
    );
    return channel.send({ embeds: [embed], components: [row] });
};

// eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
const ageSelect = async (channel: TextBasedChannel) => {
    const embed = new EmbedBuilder()
        .setColor("Blue")
        .setTitle("⏱️ 『나이대 선택』")
        .setDescription("본인의 나이를 선택해 주세요");
    const row = new ActionRow(
        new ButtonBuilder()
            .setCustomId("selectroles_adult")
            .setEmoji("🍷")
            .setLabel("성인")
            .setStyle(ButtonStyle.Primary),
        new ButtonBuilder()
            .setCustomId("selectroles_highschool")
            .setEmoji("📖")
            .setLabel("고등학생")
            .setStyle(ButtonStyle.Primary),
        new ButtonBuilder()
            .setCustomId("selectroles_middleschool")
            .setEmoji("📏")
            .setLabel("중학생")
            .setStyle(ButtonStyle.Primary),
    );
    return channel.send({ embeds: [embed], components: [row] });
};

const loveSelect = async (channel: TextBasedChannel) => {
    const embed = new EmbedBuilder()
        .setColor("Blue")
        .setTitle("🧡 『애인 유무』")
        .setDescription("현재 상태를 선택해 주세요");
    const row = new ActionRow(
        new ButtonBuilder()
            .setCustomId("selectroles_couple")
            .setEmoji("💘")
            .setLabel("커플")
            .setStyle(ButtonStyle.Primary),
        new ButtonBuilder()
            .setCustomId("selectroles_single")
            .setEmoji("🤍")
            .setLabel("솔로")
            .setStyle(ButtonStyle.Primary),
        new ButtonBuilder()
            .setCustomId("selectroles_foreveralone")
            .setEmoji("💙")
            .setLabel("모솔")
            .setStyle(ButtonStyle.Primary),
        new ButtonBuilder()
            .setCustomId("selectroles_relationship_hide")
            .setEmoji("🤫")
            .setLabel("애인 비공개")
            .setStyle(ButtonStyle.Primary),
    );
    return channel.send({ embeds: [embed], components: [row] });
};

const dmSelect = async (channel: TextBasedChannel) => {
    const embed = new EmbedBuilder()
        .setColor("Blue")
        .setTitle("📨 『DM 여부』")
        .setDescription("DM을 허용 여부를 선택해 주세요");
    const row = new ActionRow(
        new ButtonBuilder()
            .setCustomId("selectroles_dm_allow")
            .setEmoji("⭕")
            .setLabel("DM 허용")
            .setStyle(ButtonStyle.Primary),
        new ButtonBuilder()
            .setCustomId("selectroles_dm_disallow")
            .setEmoji("❌")
            .setLabel("DM 비허용")
            .setStyle(ButtonStyle.Primary),
    );
    return channel.send({ embeds: [embed], components: [row] });
};

const pingRelatedSelect = async (channel: TextBasedChannel) => {
    const embed = new EmbedBuilder()
        .setColor("Blue")
        .setTitle("📌 『알람 관련』 (선택)")
        .setDescription("알람 관련된 역할을 선택해 주세요");
    const row = new ActionRow(
        new ButtonBuilder()
            .setCustomId("selectroles_announcement")
            .setEmoji("📢")
            .setLabel("공지 알림 받기")
            .setStyle(ButtonStyle.Primary),
        new ButtonBuilder()
            .setCustomId("selectroles_giveaway")
            .setEmoji("🎉")
            .setLabel("이벤트 알림 받기")
            .setStyle(ButtonStyle.Primary),
    );
    return channel.send({ embeds: [embed], components: [row] });
};

const gamesSelect = async (channel: TextBasedChannel) => {
    const embed = new EmbedBuilder()
        .setColor("Blue")
        .setTitle("🎮 『게임 선택』 (선택)")
        .setDescription("플레이 하시는 게임들을 선택해 주세요");
    const options: Array<APISelectMenuOption> = [
        {
            label: "리그오브레전드",
            value: "leagueOfLegends",
        },
        {
            label: "오버워치",
            value: "overwatch",
        },
        {
            label: "배틀그라운드",
            value: "battlegrounds",
        },
        {
            label: "발로란트",
            value: "valorant",
        },
        {
            label: "메이플스토리",
            value: "maplestory",
        },
        {
            label: "피파 온라인",
            value: "fifaonline",
        },
        {
            label: "카트라이더",
            value: "kartrider",
        },
        {
            label: "마인크래프트",
            value: "minecraft",
        },
        {
            label: "스팀",
            value: "steam",
        },
    ];
    const row1 = new ActionRow<StringSelectMenuBuilder>(
        new StringSelectMenuBuilder()
            .setCustomId("selectroles_games")
            .setPlaceholder("게임들을 고르세요!")
            .setMinValues(0)
            .setMaxValues(options.length)
            .setOptions(
                options,
            ),
    );

    return channel.send({ embeds: [embed], components: [row1] });
};

const nsfwPass = async (channel: TextBasedChannel) => {
    const embed = new EmbedBuilder()
        .setColor("Red")
        .setTitle("🔞 『위험구역 출입증』")
        .setDescription("위험구역에서는 대한민국 법을 위반하지 않는 한 어떠한 행위도 제재하지 않습니다.\n"
                        + "출입증을 얻은 상태에서 한번 더 누르시면 제거됩니다.");
    const row = new ActionRow(
        new ButtonBuilder()
            .setCustomId("selectroles_nsfwpass")
            .setEmoji("🔞")
            .setLabel("출입증 받기")
            .setStyle(ButtonStyle.Primary),
    );
    return channel.send({ embeds: [embed], components: [row] });
};