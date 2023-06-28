import { WebSocket } from "ws";
import { SIGNALING_MESSAGE_TYPES } from "../constants";
import { WebSocketEvent, WebSocketEventData } from "../types";

export const sendMessage = (
  client: WebSocket | undefined,
  type: SIGNALING_MESSAGE_TYPES,
  data: WebSocketEventData
): void => {
  console.log("Send message: ", !!client, type, data);
  if (!client) return;
  client.send(JSON.stringify({ type, data } as WebSocketEvent));
  console.log("--------------------------------------------");
};
