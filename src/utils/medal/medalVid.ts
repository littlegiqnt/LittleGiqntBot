/* eslint-disable ts/no-unsafe-return */
/* eslint-disable ts/no-unsafe-assignment */
import MedalApi from "./MedalApi";

export const getMedalClip = async (url: string) => {
    const api = new MedalApi();
    await api.guestAuthentificate();
    const clipId = await api.loadClipIdFromUrl(url);
    if (clipId == null) return undefined;
    const clip = await api.getContent(clipId);
    return clip;
};
