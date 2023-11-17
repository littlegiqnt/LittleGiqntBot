import { ApplicationCommandOptionType } from "discord.js";
import type { ApplicationCommandSubCommandData, AutocompleteInteraction, ChatInputCommandInteraction } from "discord.js";
import { BaseSlashCommand } from "./BaseSlashCommand";

export class SubCommand extends BaseSlashCommand<ApplicationCommandSubCommandData> {
    public override isMine(interaction: ChatInputCommandInteraction | AutocompleteInteraction): boolean {
        return interaction.options.getSubcommand(false) === this.name;
    }

    public override toRaw(): ApplicationCommandSubCommandData {
        return {
            ...super.getRawPart(),
            type: ApplicationCommandOptionType.Subcommand as const,
            options: this.options,
        };
    }
}
