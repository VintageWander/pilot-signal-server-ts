import { SIGNALING_MESSAGE_TYPES } from "../constants";
import { CONNS, PEERS } from "../server";
import { groupServices } from "../services";
import { WebSocketEventData } from "../types";
import { sendMessage } from "./message";

export const handleOffer = (data: WebSocketEventData): void => {
  const { groupId, senderId, receiverId, offer } = data;
  if (!groupId || !senderId || !receiverId || !offer) return;

  const peerId = groupServices.isExistedPeer(groupId, receiverId);
  console.log("Handle offer :", groupId, receiverId, peerId);
  if (!peerId) return;

  let peer = PEERS[peerId];
  if (!peer) return;

  sendMessage(CONNS[peer.connId], SIGNALING_MESSAGE_TYPES.OFFER, {
    senderId,
    offer,
  });
};
