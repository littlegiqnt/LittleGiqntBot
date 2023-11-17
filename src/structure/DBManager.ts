import { connect, connection, model, set } from "mongoose";
import type { IUser } from "schema/userSchema";
import { userSchema } from "schema/userSchema";

export class DbManager {
    public readonly User = model<IUser>("User", userSchema);

    /**
     * Connect to the db
     */
    public async connect(uri: string) {
        console.log("Connecting to DB...");
        set("strictQuery", false);
        return connect(uri, {
            connectTimeoutMS: 3000,
        })
            .catch((error) => {
                throw error;
            })
            .finally(() => console.log("Connected to DB"));
    }

    public isConnected(): boolean {
        return connection.readyState === 1;
    }

    public async loadUser(id: string) {
        const user = await this.User.findById(id);
        if (user == null) {
            return await this.User.create({
                _id: id,
            });
        }
        return user;
    }
}

const dbManager = new DbManager();
export default dbManager;
