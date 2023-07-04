import { v4 as uuidv4 } from "uuid";
import { WebSocket } from "ws";

import { SIGNALING_MESSAGE_TYPES } from "../constants";
import { CONNS, PEERS } from "../server";
import { GlobalIds, WebSocketEventData } from "../types";
import { sendMessage } from "./message";

export const handleOnline = (
  ws: WebSocket,
  data: WebSocketEventData,
  ip: string,
  globalIds: GlobalIds
): void => {
  const { desc } = data;
  if (!desc) return;
  globalIds.peerId = uuidv4();
  globalIds.connId = uuidv4();
  CONNS[globalIds.connId] = ws;
  PEERS[globalIds.peerId] = { connId: globalIds.connId, desc, ip };

  sendMessage(ws, SIGNALING_MESSAGE_TYPES.ONLINE, { peerId: globalIds.peerId });
};
