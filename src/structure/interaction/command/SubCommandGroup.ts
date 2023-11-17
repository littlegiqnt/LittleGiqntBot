import type { ApplicationCommandSubGroupData, AutocompleteInteraction, ChatInputCommandInteraction } from "discord.js";
import { ApplicationCommandOptionType } from "discord.js";
import type { BaseSlashCommandOptions } from "./BaseSlashCommand";
import { BaseSlashCommand } from "./BaseSlashCommand";
import type { SubCommand } from "./SubCommand";

export interface SubCommandGroupOptions extends Pick<BaseSlashCommandOptions, "name"> {
    readonly subCommands: SubCommand[]
}

export class SubCommandGroup extends BaseSlashCommand<ApplicationCommandSubGroupData> {
    public readonly subCommands: SubCommand[];

    public constructor(options: SubCommandGroupOptions) {
        super({
            execute: interaction => this.execute(interaction),
            ...options,
        });
        this.subCommands = options.subCommands;
    }

    public override execute(interaction: ChatInputCommandInteraction) {
        if (this.subCommands !== null) {
            for (const subCommand of this.subCommands) {
                if (subCommand.isMine(interaction)) return subCommand.execute(interaction);
            }
        }
        return super.execute(interaction);
    }

    public override isMine(interaction: ChatInputCommandInteraction | AutocompleteInteraction): boolean {
        return interaction.options.getSubcommandGroup(false) === this.name;
    }

    public override toRaw(): ApplicationCommandSubGroupData {
        return {
            ...super.getRawPart(),
            type: ApplicationCommandOptionType.SubcommandGroup as const,
            options: this.subCommands?.map(sub => sub.toRaw()),
        };
    }
}
