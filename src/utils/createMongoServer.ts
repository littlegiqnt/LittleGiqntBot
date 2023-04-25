import { MongoMemoryServer } from "mongodb-memory-server";

export default async () => {
    const mongod = await MongoMemoryServer.create({
        binary: {
            version: "4.4.19",
        },
    });
    return mongod.getUri();
};