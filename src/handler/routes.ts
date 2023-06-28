import { WebSocket } from "ws";
import { handleOnline } from ".";
import { SIGNALING_MESSAGE_TYPES } from "../constants";
import { WebSocketEventData } from "../types";
import { handleOffer } from "./offer";
import { handleAnswer } from "./answer";

export const handleMessage = (
  ws: WebSocket,
  type: SIGNALING_MESSAGE_TYPES,
  data: WebSocketEventData,
  ip: string,
  peerId: string,
  connId: string
): void => {
  switch (type) {
    case SIGNALING_MESSAGE_TYPES.ONLINE:
      return handleOnline(ws, data, ip, peerId, connId);
    case SIGNALING_MESSAGE_TYPES.OFFER:
      return handleOffer(data);
    case SIGNALING_MESSAGE_TYPES.ANSWER:
      return handleAnswer(data);
    default:
      console.error(`Event type '${type}' is not supported`);
  }
};
