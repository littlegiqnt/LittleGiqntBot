import { VoiceChannel, VoiceState } from "discord.js";
import { DynamicVcManager } from "utils/dynamic-vc/dynamic-vc";
import createVoiceStateUpdateEventListener from "./createVoiceStateUpdateEventListener";

export default createVoiceStateUpdateEventListener(async (oldState, newState) => {
    if (oldState.channel == null && newState.channel != null) { // join
        checkJoin(newState);
    } else if (oldState.channel != null && newState.channel == null) { // leave
        checkLeave(oldState);
    } else { // change
        checkJoin(newState);
        checkLeave(oldState);
    }
});

const checkJoin = (state: VoiceState) => {
    if (state.member == null) return;
    DynamicVcManager.allInstances.every((v) => {
        if (v.createChannelId !== state.channelId) {
            return true;
        }
        v.onJoinCreateChannel(state.member!);
        return false;
    });
};

const checkLeave = (state: VoiceState) => {
    if (state.channel == null) return;
    DynamicVcManager.allInstances.every((v) => {
        if (v.categoryId !== state.channel?.parentId) {
            return true;
        }
        v.onLeaveCreateChannel(state.channel as VoiceChannel);
        return false;
    });
};