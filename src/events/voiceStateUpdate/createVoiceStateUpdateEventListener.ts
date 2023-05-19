import { createEventListenerFactory } from "structure/EventListener";

const voiceStateUpdateEventListener = createEventListenerFactory("voiceStateUpdate");
export default voiceStateUpdateEventListener;