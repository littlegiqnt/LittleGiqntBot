import { OWNER_ID } from "config";
import { onEveryDay } from "events/ready/register-happy-birthday";
import dbManager from "structure/DBManager";
import { SlashCommand } from "structure/interaction/command/SlashCommand";

export default new SlashCommand({
    name: "test",
    async execute(interaction) {
        if (interaction.user.id !== OWNER_ID) return;

        const user = await dbManager.loadUser(OWNER_ID);
        user.birthday.month = 4;
        user.birthday.day = 25;
        await user.save();

        onEveryDay(interaction.client);
    },
});
