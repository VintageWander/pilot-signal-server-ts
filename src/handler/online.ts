import { WebSocket } from "ws";
import { WebSocketEventData } from "../types";
import { v4 as uuidv4 } from "uuid";
import { CONNS, PEERS } from "../server";

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
};
