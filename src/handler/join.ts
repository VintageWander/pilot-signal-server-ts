import { v4 as uuidv4 } from "uuid";
import { WebSocket } from "ws";

import { SIGNALING_MESSAGE_TYPES } from "../constants";
import { CONNS, PEERS } from "../server";
import { groupServices, ipService, verifier } from "../services";
import { WebSocketEventData } from "../types";
import { sendMessage } from "./message";

export const handleJoinGroup = async (
  ws: WebSocket,
  data: WebSocketEventData,
  ip: string,
  peerId: string,
  groupId: string | undefined
) => {
  const { senderId, desc } = data;
  if (!senderId || !desc) return;
  const {
    data: { ISP: isp },
  } = await ipService.getLocation(ip);

  groupId = groupServices.evaluate({ ...desc, isp });

  let neighborIds: string[] = [];
  let groupToken = "";

  if (groupId) {
    const group = groupServices.getGroupById(groupId);
    if (!group) return;
    if (!group.peerIds) return;
    neighborIds = [...group.peerIds];
    if (!group.groupToken) return;
    groupToken = group.groupToken;
    groupServices.addPeer(groupId, senderId, desc);
  } else {
    groupId = uuidv4();
    groupToken = verifier.generateGroupToken({ groupId });
    groupServices.newGroup(groupId, groupToken, {
      peerId,
      desc: { ...desc, isp },
    });
  }

  const group = groupServices.getGroupById(groupId);
  if (!group) return;

  sendMessage(ws, SIGNALING_MESSAGE_TYPES.JOIN_GROUP, {
    groupId,
    neighborIds,
    groupToken,
    host: group.host,
  });

  neighborIds.forEach((neighborId) => {
    console.log("Each neighbour ", neighborId, PEERS);
    let peer = PEERS[neighborId];
    if (!peer) return;
    const { connId } = peer;
    sendMessage(CONNS[connId], SIGNALING_MESSAGE_TYPES.NEW_PEER, {
      groupId,
      peerId: senderId,
    });
  });
};
