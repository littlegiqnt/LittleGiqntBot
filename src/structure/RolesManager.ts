import { GUILD_ID } from "config";
import type { Client, Role } from "discord.js";
type RolesIdType = Record<string, string>;

class RolesManager {
    private readonly rolesIdGroups = {
        // empty
    } satisfies Record<string, RolesIdType>;

    public readonly rolesId = {
        owner: "1023192476573519912",
        community: "1023192667372388412",
        male: "1023192732090515536",
        female: "1023192805339824239",
        announcementPing: "1024229806193258506",
        giveawayPing: "1027775934645932093",
        nsfwpass: "1108720383747686470",
    } satisfies RolesIdType;

    private roles: Partial<Record<keyof typeof this.rolesId, Role>> = {};

    public constructor(private guildId: string) {}

    public async load(client: Client) {
        const guild = await client.guilds.fetch(this.guildId);
        if (guild == null) return;
        const roles = await guild.roles.fetch();
        Object.entries(this.rolesId)
            .forEach(([name, id]) => {
                this.roles[name as keyof typeof this.rolesId] = roles.get(id)!;
            });
    }

    public get(name: keyof typeof this.rolesId): Role {
        return this.roles[name]!;
    }

    public getId(name: keyof typeof this.rolesId): string {
        return this.rolesId[name];
    }

    public async getGrouped(groupName: keyof typeof this.rolesIdGroups) {
        const ids = this.rolesIdGroups[groupName] satisfies RolesIdType;
        const roles: Array<Role> = [];
        Object.keys(ids)
            .forEach((name) => {
                const role = this.get(name as keyof typeof this.rolesId);
                if (role != null) {
                    roles.push(role);
                }
            });
        return roles;
    }
}

const rolesManager = new RolesManager(GUILD_ID);
export default rolesManager;
