import { v4 as uuidv4 } from "uuid";
import { WebSocket } from "ws";

import { SIGNALING_MESSAGE_TYPES } from "../constants";
import { CONNS, PEERS } from "../server";
import { WebSocketEventData } from "../types";
import { sendMessage } from "./message";

export const handleOnline = (
  ws: WebSocket,
  data: WebSocketEventData,
  ip: string,
  peerId: string,
  connId: string
): void => {
  const { desc } = data;
  if (!desc) return;
  peerId = uuidv4();
  connId = uuidv4();
  CONNS.connId = ws;
  PEERS.peerId = { connId, desc, ip };

  sendMessage(ws, SIGNALING_MESSAGE_TYPES.ONLINE, { peerId });
};
