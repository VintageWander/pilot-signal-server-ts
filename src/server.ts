import { WebSocketServer } from "ws";
import { ipService, verifier } from "./services";
import { CONNS_TYPE, GROUPS_TYPE, PEERS_TYPE, WebSocketEvent } from "./types";
import { SIGNALING_MESSAGE_TYPES } from "./constants";

export const GROUPS: GROUPS_TYPE = {};
export const PEERS: PEERS_TYPE = {};
export const CONNS: CONNS_TYPE = {};

const wss = new WebSocketServer({
  port: 9090,
});

wss.on("connection", (ws, req) => {
  let ipAddress = req.headers["x-forwarded-for"];
  if (ipAddress === undefined) {
    ipAddress = req.socket.remoteAddress;
    if (ipAddress === undefined) {
      throw new Error(
        "Cannot read ip address from x-forwarded-for header or req.socket.remoteAddress"
      );
    }
  } else if (Array.isArray(ipAddress) && typeof ipAddress[0] === "string") {
    ipAddress = ipAddress[0];
  } else if (typeof ipAddress !== "string") {
    throw new Error("IP address was not a string: " + ipAddress);
  }

  const ip = ipService.ip4v2(ipAddress);

  let groupId: unknown;
  let peerId: unknown;
  let connId: unknown;

  ws.on("message", async (event: string) => {
    console.log("--------------------------------------------");
    const { type, data } = JSON.parse(event) as WebSocketEvent;
    const allowedReq = await verifier.verifyToken(type, data.groupToken);
    console.log("Data :", allowedReq, type, data);
    if (!allowedReq) return;
  });
});
