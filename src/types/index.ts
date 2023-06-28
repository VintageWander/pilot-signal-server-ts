import { SIGNALING_MESSAGE_TYPES } from "../constants";
import { WebSocket } from "ws";

export interface GROUPS_TYPE {
  [groupId: string]: {
    desc: WebSocketEventDataDesc;
    peerIds: string[];
    host: string;
  };
}

export interface PEERS_TYPE {
  [peerId: string]: {
    connId: string;
    desc: WebSocketEventDataDesc;
    ip: string;
  };
}

export interface CONNS_TYPE {
  [connId: string]: WebSocket | undefined;
}

export interface Token {
  groupId: string;
}

export interface WebSocketEvent {
  type: SIGNALING_MESSAGE_TYPES;
  data: WebSocketEventData;
}

export interface WebSocketEventData {
  senderId: string;
  groupToken?: string | undefined;
  groupId?: string | undefined;
  receiverId?: string | undefined;
  desc?: WebSocketEventDataDesc | undefined;
  offer?: string | undefined;
  answer?: string | undefined;
  candidate?: string | undefined;
}

export interface WebSocketEventDataDesc {
  sourceURL: string;
  userAgent: string;
}
