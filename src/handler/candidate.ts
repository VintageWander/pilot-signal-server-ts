import { sendMessage } from ".";
import { SIGNALING_MESSAGE_TYPES } from "../constants";
import { CONNS, PEERS } from "../server";
import { groupServices } from "../services";
import { WebSocketEventData } from "../types";

export const handleCandidate = (data: WebSocketEventData): void => {
  const { groupId, senderId, receiverId, candidate } = data;
  if (!groupId || !senderId || !receiverId || !candidate) return;

  const peerId = groupServices.isExistedPeer(groupId, receiverId);
  if (!peerId) return;

  const peer = PEERS[peerId];
  if (!peer) return;

  sendMessage(CONNS[peer.connId], SIGNALING_MESSAGE_TYPES.CANDIDATE, {
    senderId,
    candidate,
  });
};
