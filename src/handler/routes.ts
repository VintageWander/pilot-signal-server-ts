import { WebSocket } from "ws";
import { SIGNALING_MESSAGE_TYPES } from "../constants";
import { WebSocketEventData } from "../types";
import {
  handleAnswer,
  handleCandidate,
  handleLeaveGroup,
  handleOffer,
  handleOnline,
} from ".";

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
    case SIGNALING_MESSAGE_TYPES.CANDIDATE:
      return handleCandidate(data);
    case SIGNALING_MESSAGE_TYPES.LEAVE_GROUP:
      return handleLeaveGroup(data);
    default:
      console.error(`Event type '${type}' is not supported`);
  }
};
