import MedalApi from "./MedalApi";

export const getMedalClip = async (url: string) => {
    const api = new MedalApi();
    await api.guestAuthentificate();
    const clipId = await api.getClipIdFromUrl(url);
    if (clipId == null) return undefined;
    const clip = await api.getContent(clipId);
    return clip;
};
