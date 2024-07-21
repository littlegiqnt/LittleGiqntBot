import mongoose, { STATES, connect, model } from "mongoose";
import type { IUser } from "schema/userSchema";
import { userSchema } from "schema/userSchema";

export class DbManager {
    public readonly User = model<IUser>("User", userSchema);

    /**
     * Connect to the db
     */
    public async connect(uri: string) {
        console.log("Connecting to DB...");
        mongoose.set("strictQuery", false);
        return await connect(uri, {
            connectTimeoutMS: 3000,
        })
            .catch((error) => {
                throw error;
            })
            .finally(() => console.log("Connected to DB"));
    }

    public isConnected(): boolean {
        return mongoose.connection.readyState === STATES.connected;
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
