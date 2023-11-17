import logUtil from "utils/log";
import { isProduction } from "./utils";

export default () => {
    process.on("uncaughtException", (err) => {
        console.log(err);
        if (isProduction) {
            logUtil.error(err)
                .then(() => process.exit(1)).catch(() => { /* empty */ });
        }
    });
};
