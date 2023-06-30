import { WebSocket } from "ws";

import { SIGNALING_MESSAGE_TYPES } from "../constants";

export interface GROUPS_TYPE {
  [groupId: string]: GROUP_TYPE;
}

export interface GROUP_TYPE {
  desc: WebSocketEventDataDesc;
  peerIds: string[];
  host: string;
  groupToken: string;
}

export interface PEERS_TYPE {
  [peerId: string]: PEER_TYPE;
}
export interface PEER_TYPE {
  connId: string;
  desc: WebSocketEventDataDesc;
  ip: string;
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
  isp: string;
  location: string;
  os: string;
}

export interface LocationResponse {
  data: {
    data: {
      ISP: string;
    };
  };
}
