import { Schema } from "mongoose";

// eslint-disable-next-line @typescript-eslint/naming-convention
export interface IUser {
    _id: string
    coupleSince?: Date
    birthday: {
        month: number
        day: number
    }
    selfbot: {
        token?: string
    }
}

export const userSchema = new Schema<IUser>({
    _id: String,
    coupleSince: { type: Date, required: false },
    birthday: { month: Number, day: Number },
    selfbot: { token: { type: String, required: false } },
});
