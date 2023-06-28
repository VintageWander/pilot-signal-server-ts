import { WebSocket } from "ws";
import { SIGNALING_MESSAGE_TYPES } from "../constants";
import { WebSocketEvent } from "../types";

export const sendMessage = (
  client: WebSocket | undefined,
  type: SIGNALING_MESSAGE_TYPES,
  data: object
): void => {
  console.log("Send message: ", !!client, type, data);
  if (!client) return;
  client.send(JSON.stringify({ type, data } as WebSocketEvent));
  console.log("--------------------------------------------");
};
