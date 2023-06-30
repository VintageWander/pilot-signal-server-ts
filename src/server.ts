import dotenv from "dotenv";
import { WebSocketServer } from "ws";

import { PORT } from "./config";
import { SIGNALING_MESSAGE_TYPES } from "./constants";
import { handleMessage } from "./handler";
import { sendMessage } from "./handler/message";
import { groupServices, ipService, verifier } from "./services";
import { CONNS_TYPE, GROUPS_TYPE, PEERS_TYPE, WebSocketEvent } from "./types";

dotenv.config();

export const GROUPS: GROUPS_TYPE = {};
export const PEERS: PEERS_TYPE = {};
export const CONNS: CONNS_TYPE = {};

const wss = new WebSocketServer({
  port: PORT,
});

wss.on("connection", (ws, req) => {
  let ipAddress = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
  if (!ipAddress) {
    throw new Error(
      "Cannot read ip address from x-forwarded-for header or req.socket.remoteAddress"
    );
  } else if (Array.isArray(ipAddress) && typeof ipAddress[0] === "string") {
    ipAddress = ipAddress[0];
  } else if (typeof ipAddress !== "string") {
    throw new Error("IP address was not a string: " + ipAddress);
  }

  const ip = ipService.ip4v2(ipAddress);

  let groupId: string;
  let peerId: string;
  let connId: string;

  ws.on("message", async (event: string) => {
    console.log("--------------------------------------------");
    const { type, data } = JSON.parse(event) as WebSocketEvent;
    const allowedReq = await verifier.verifyToken(type, data.groupToken);
    console.log("Data :", allowedReq, type, data);
    if (!allowedReq) return;

    await handleMessage(ws, type, data, ip, peerId, connId);
  });

  const close = () => {
    if (!PEERS[peerId]) return;
    const peer = PEERS[peerId];
    if (!peer) return;
    const { connId } = peer;
    delete CONNS[connId];
    delete PEERS[peerId];

    const { peers = [], host } = groupServices.removePeer(groupId, peerId);
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
