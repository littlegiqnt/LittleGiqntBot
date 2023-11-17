import { GUILD_ID } from "config";
import type { AutocompleteInteraction, ChatInputApplicationCommandData, ChatInputCommandInteraction } from "discord.js";
import { ApplicationCommandType } from "discord.js";
import type { BaseSlashCommandOptions } from "./BaseSlashCommand";
import { BaseSlashCommand } from "./BaseSlashCommand";
import type { SubCommand } from "./SubCommand";
import type { SubCommandGroup } from "./SubCommandGroup";

export interface SlashCommandOptions extends BaseSlashCommandOptions {
    readonly guildId?: string
}

export interface ParentSlashCommandOptions extends Pick<BaseSlashCommandOptions, "name" | "description"> {
    readonly subCommands: (SubCommand | SubCommandGroup)[]
    readonly guildId?: string
}

export class SlashCommand extends BaseSlashCommand<ChatInputApplicationCommandData> {
    public readonly subCommands: (SubCommand | SubCommandGroup)[] | null = null;

    public readonly guildId?: string;

    public constructor(options: SlashCommandOptions | ParentSlashCommandOptions) {
        super({
            // because of ts17009 need to create unnecessary anonymous function
            execute: interaction => this.execute(interaction),
            ...options,
        });
        if ("subCommands" in options) this.subCommands = options.subCommands;
        if ("guildId" in options) this.guildId = options.guildId;
        else this.guildId = GUILD_ID;
    }

    public override isMine(interaction: ChatInputCommandInteraction | AutocompleteInteraction): boolean {
        return interaction.commandName === this.name;
    }

    public override execute(interaction: ChatInputCommandInteraction) {
        if (this.subCommands !== null) {
            for (const subCommand of this.subCommands) {
                if (subCommand.isMine(interaction)) {
                    return subCommand.execute(interaction);
                }
            }
            throw new Error("execute 감지 실패");
        } else {
            return super.execute(interaction);
        }
    }

    public override toRaw(): ChatInputApplicationCommandData {
        return {
            ...super.getRawPart(),
            type: ApplicationCommandType.ChatInput as const,
            options: this.subCommands?.map(sub => sub.toRaw()) ?? this.options,
        };
    }
}
