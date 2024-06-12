import {
    EmbedBuilder,
} from "discord.js";
import type {
    ApplicationCommandOptionChoiceData,
    AutocompleteInteraction,
    ChatInputCommandInteraction,

    ApplicationCommandOptionData as CommandArg,
    ApplicationCommandSubCommandData as SubCommandArg,
    ApplicationCommandSubGroupData as SubGroupArg,
} from "discord.js";
import type LocaleOption from "utils/types/LocaleOption";
import type Locales from "utils/types/LocaleOptionWithEn";
import type { CommandOptions } from "./Command";
import { Command } from "./Command";

export type CommandOption = Exclude<CommandArg, SubCommandArg | SubGroupArg>;
type TransformedArgs = [interaction: ChatInputCommandInteraction];
type AutocompleteOption = (interaction: AutocompleteInteraction) =>
    ApplicationCommandOptionChoiceData[] | undefined | Promise<ApplicationCommandOptionChoiceData[] | undefined>;

export interface BaseSlashCommandOptions extends CommandOptions<TransformedArgs> {
    readonly description?: Locales;
    readonly options?: CommandOption[];
    readonly autocomplete?: AutocompleteOption;
    readonly onlySlash?: boolean;
}

export abstract class BaseSlashCommand<T> extends Command<ChatInputCommandInteraction, TransformedArgs> {
    private readonly _autocomplete?: AutocompleteOption;
    public readonly descriptions: LocaleOption;
    public cooldown?: number;
    public readonly options: CommandOption[];
    public textAliases?: string[];
    public readonly onlySlash: boolean;
    protected depth = 0;
    private lastExecutedAt = new Map<string, number>();

    private static localeAliasMap = {
        en: "en-US",
    };

    public constructor(options: BaseSlashCommandOptions) {
        super(options);
        this.options = options.options ?? [];
        this.descriptions = Object.fromEntries(Object.entries(options.description ?? { "en-US": "-" })
            .map(([key, value]) => [key in BaseSlashCommand.localeAliasMap
                ? BaseSlashCommand.localeAliasMap[key as keyof typeof BaseSlashCommand.localeAliasMap]
                : key, value] as const));
        this._autocomplete = options.autocomplete;
        this.onlySlash = options.onlySlash ?? false;
    }

    public override async execute(interaction: ChatInputCommandInteraction) {
        if (this.cooldown != null) {
            const last = this.lastExecutedAt.get(interaction.user.id);
            if (last != null && Date.now() - last <= this.cooldown) {
                const secondsLeft = Math.floor((this.cooldown - (Date.now() - last)) / 100) / 10;
                await interaction.reply({
                    embeds: [
                        new EmbedBuilder()
                            .setColor("Yellow")
                            .setDescription(`${secondsLeft}초 후 다시 시도해주세요.`),
                    ],
                });
                return;
            }
            this.lastExecutedAt.set(interaction.user.id, Date.now());
        }
        return super.execute(interaction);
    }

    public async autocomplete(interaction: AutocompleteInteraction) {
        if (this._autocomplete == null) {
            return interaction.respond([]);
        }
        return interaction.respond(await this._autocomplete(interaction) ?? []);
    }

    protected override transform(interaction: ChatInputCommandInteraction): [ChatInputCommandInteraction] {
        return [interaction];
    }

    protected abstract toRaw(): T;

    protected getRawPart() {
        return {
            name: this.name,
            nameLocalizations: this.nameLocale,
            description: this.descriptions["en-US"] ?? "(none)",
            descriptionLocalizations: this.descriptions,
        };
    }
}
