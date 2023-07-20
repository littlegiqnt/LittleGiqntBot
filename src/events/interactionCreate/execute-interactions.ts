import commands from "commands/slash";
import { Interaction as DInteraction } from "discord.js";
import { Interaction } from "structure/interaction/Interaction";
import { handleErrorReply } from "utils/discordUtils";
import createInteractionCreateEventListener from "./createInteractionCreateEventListener";

export default createInteractionCreateEventListener(async (interaction) => {
    if (interaction.isChatInputCommand()) {
        travel(commands, interaction);
    }/* else if (interaction.isButton()) {
        travel(buttons, interaction);
    } */
});

const travel = async <T extends DInteraction>(executables: Array<Interaction<T>>, interaction: T) => {
    for (const executable of executables) {
        if (executable.isMine(interaction)) {
            try {
                await executable.execute(interaction);
            } catch (e) {
                handleErrorReply(e, interaction);
            }
        }
    }
};