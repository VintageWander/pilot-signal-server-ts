import { sendMessage } from ".";
import { SIGNALING_MESSAGE_TYPES } from "../constants";
import { CONNS, PEERS } from "../server";
import { groupServices } from "../services";
import { WebSocketEventData } from "../types";

export const handleAnswer = (data: WebSocketEventData): void => {
  const { groupId, senderId, receiverId, answer } = data;
  if (!groupId || !senderId || !receiverId || !answer) return;

  const peerId = groupServices.isExistedPeer(groupId, receiverId);
  if (!peerId) return;

  const peer = PEERS[peerId];
  if (!peer) return;
  sendMessage(CONNS[peer.connId], SIGNALING_MESSAGE_TYPES.ANSWER, {
    senderId,
    answer,
  });
};
