import type { Locale } from "discord.js";
import type PartiallyRequired from "./PartiallyRequired";

type Locales = PartiallyRequired<Record<Locale | "en", string>, "en">;
export default Locales;
