import { WebSocket } from "ws";

import { SIGNALING_MESSAGE_TYPES } from "../constants";
import { GlobalIds, WebSocketEventData } from "../types";
import { handleAnswer } from "./answer";
import { handleCandidate } from "./candidate";
import { handleJoinGroup } from "./join";
import { handleLeaveGroup } from "./leave";
import { handleOffer } from "./offer";
import { handleOnline } from "./online";

export const handleMessage = (
  ws: WebSocket,
  type: SIGNALING_MESSAGE_TYPES,
  data: WebSocketEventData,
  ip: string,
  globalIds: GlobalIds
) => {
  switch (type) {
    case SIGNALING_MESSAGE_TYPES.ONLINE:
      return handleOnline(ws, data, ip, globalIds);
    case SIGNALING_MESSAGE_TYPES.OFFER:
      return handleOffer(data);
    case SIGNALING_MESSAGE_TYPES.ANSWER:
      return handleAnswer(data);
    case SIGNALING_MESSAGE_TYPES.CANDIDATE:
      return handleCandidate(data);
    case SIGNALING_MESSAGE_TYPES.JOIN_GROUP:
      return handleJoinGroup(ws, data, ip, globalIds);
    case SIGNALING_MESSAGE_TYPES.LEAVE_GROUP:
      return handleLeaveGroup(data);
    default:
      console.error(`Event type '${type}' is not supported`);
  }
};
