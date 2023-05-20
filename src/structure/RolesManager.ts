import { GUILD_ID } from "config";
import type { Client, Role } from "discord.js";
type RolesIdType = Record<string, string>;

class RolesManager {
    private readonly rolesIdGroups = {
        dividers: {
            dividerRoleProfile: "1023196714078830705",
            dividerRoleNotice: "1024229642598621195",
            dividerRoleGames: "1024239485732540477",
            dividerRoleUser: "1023196824812650506",
        },
        games: {
            leagueOfLegends: "1024239585653432330",
            overwatch: "1024241275307827210",
            battlegrounds: "1024240063388848180",
            valorant: "1024240492470358026",
            maplestory: "1024241375841099776",
            fifaonline: "1024241527033176094",
            kartrider: "1024240335192334417",
            minecraft: "1024239931951939625",
            steam: "1024241637423075429",
        },
    } satisfies Record<string, RolesIdType>;

    public readonly rolesId = {
        ...this.rolesIdGroups.dividers,
        owner: "1023192476573519912",
        manager: "1023228298907627542",
        stepOneVerified: "1023192667372388412",
        male: "1023192732090515536",
        female: "1023192805339824239",
        foreign: "1041510912370163732",
        adult: "1023204873489100821",
        highschool: "1023192920116957194",
        middleschool: "1023192855700832416",
        couple: "1023193785343148042",
        single: "1023193735179288696",
        foreveralone: "1040961057553928262",
        lovePrivate: "1040959570379538462",
        announcement: "1024229806193258506",
        dmAllow: "1024229137809952778",
        dmDisallow: "1024229118583255060",
        giveaway: "1027775934645932093",
        nsfwpass: "1108720383747686470",
        ...this.rolesIdGroups.games,
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
