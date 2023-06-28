import logUtil from "utils/log";
import isProduction from "./isProduction";

export default async () => {
    process.on("uncaughtException", (err) => {
        console.log(err);
        if (isProduction()) {
            logUtil.error(err)
                .then(() => process.exit(1));
        }
    });
};
