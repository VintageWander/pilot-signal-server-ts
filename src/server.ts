import dotenv from "dotenv";
import { WebSocketServer } from "ws";

import { PORT } from "./config";
import { SIGNALING_MESSAGE_TYPES } from "./constants";
import { handleMessage } from "./handler";
import { sendMessage } from "./handler/message";
import { groupServices, ipService, verifier } from "./services";
import {
  CONNS_TYPE,
  GROUPS_TYPE,
  GlobalIds,
  PEERS_TYPE,
  WebSocketEvent,
} from "./types";

dotenv.config();

export const GROUPS: GROUPS_TYPE = {};
export const PEERS: PEERS_TYPE = {};
export const CONNS: CONNS_TYPE = {};

const wss = new WebSocketServer({
  port: PORT,
});

wss.on("connection", (ws, req) => {
  /* 
    The ipAddress variable should have a value of this format: 
    ::ffff:1.2.3.4
  */
  let ipAddress = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
  if (!ipAddress) {
    throw new Error(
      "Cannot read ip address from x-forwarded-for header or req.socket.remoteAddress"
    );
  } else if (Array.isArray(ipAddress) && typeof ipAddress[0] === "string") {
    ipAddress = ipAddress[0];
  } else if (typeof ipAddress !== "string") {
    throw new Error("IP address was not a string");
  }

  const ip = ipService.ip4v2(ipAddress);

  let globalIds: GlobalIds = {
    groupId: "",
    peerId: "",
    connId: "",
  };

  ws.on("message", async (event: string) => {
    console.log("--------------------------------------------");
    const { type, data } = JSON.parse(event) as WebSocketEvent;
    const allowedReq = await verifier.verifyToken(type, data.groupToken);
    console.log("Data :", allowedReq, type, data);
    if (!allowedReq) return;

    handleMessage(ws, type, data, ip, globalIds);
    console.log("GROUPS: ", GROUPS);
    console.log("PEERS: ", PEERS);
  });

  const close = () => {
    if (!PEERS[globalIds.peerId]) return;
    const peer = PEERS[globalIds.peerId];
    if (!peer) return;
    const { connId } = peer;
    delete CONNS[connId];
    delete PEERS[globalIds.peerId];

    const { peers = [], host } = groupServices.removePeer(
      globalIds.groupId,
      globalIds.peerId
    );
    const updatedPeerIds = [...peers];
    updatedPeerIds.forEach((peerId) => {
      const peer = PEERS[peerId];
      if (peer) {
        sendMessage(CONNS[peer.connId], SIGNALING_MESSAGE_TYPES.LEAVE_GROUP, {
          peerId,
          host,
        });
      }
    });
  };

  ws.on("close", () => {
    close();
  });
});
