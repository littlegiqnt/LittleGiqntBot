import { Locale } from "discord.js";
import i18next, { TOptions } from "i18next";
import I18NexFsBackend, { FsBackendOptions } from "i18next-fs-backend";
import isProduction from "./isProduction";
import logUtil from "./log";

i18next.use(I18NexFsBackend).init<FsBackendOptions>({
    fallbackLng: "en",
    defaultNS: "default",
    debug: !isProduction(),
    backend: {
        loadPath: "/locales/{{lng}}/{{ns}}.json",
    },
}, (err) => {
    logUtil.error(err);
});

export const msg = (locale: Locale) => (key: string, options?: TOptions) => i18next.t(key, { lng: locale, ...options });