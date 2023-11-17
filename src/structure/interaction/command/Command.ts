import type LocaleOption from "utils/types/LocaleOption";
import type { InteractionOptions } from "../Interaction";
import { Interaction } from "../Interaction";

export interface CommandOptions<Args extends unknown[]> extends InteractionOptions<Args> {
    readonly name: string
    readonly nameLocales?: LocaleOption
}

export abstract class Command<T, Args extends unknown[] = [T]> extends Interaction<T, Args> {
    public readonly name: string;
    public readonly nameLocale?: LocaleOption;

    public constructor(options: CommandOptions<Args>) {
        super(options);
        this.name = options.name;
        this.nameLocale = options.nameLocales;
    }
}
