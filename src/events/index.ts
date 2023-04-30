import type { AllEventListener } from "../structure/EventListener";
import guildMemberAdd from "./guildMemberAdd";
import guildMemberRemove from "./guildMemberRemove";
import guildMemberUpdate from "./guildMemberUpdate";
import interactionCreate from "./interactionCreate";
import messageCreate from "./messageCreate";
import ready from "./ready";

const events: Array<Array<AllEventListener>> = [
    ready,
    messageCreate,
    interactionCreate,
    guildMemberAdd,
    guildMemberRemove,
    guildMemberUpdate,
];

export default events;
