import { sendMessage } from ".";
import { SIGNALING_MESSAGE_TYPES } from "../constants";
import { CONNS, PEERS } from "../server";
import { groupServices } from "../services";
import { WebSocketEventData } from "../types";

export const handleLeaveGroup = (data: WebSocketEventData): void => {
  const { senderId, groupId } = data;
  if (!senderId || !groupId) return;

  const { peers, host } = groupServices.removePeer(groupId, senderId);
  const updatedPeerIds = [...peers];

  updatedPeerIds.forEach((otherPeerId) => {
    const otherPeer = PEERS[otherPeerId];
    if (!otherPeer) return;
    const { connId } = otherPeer;
    sendMessage(CONNS[connId], SIGNALING_MESSAGE_TYPES.LEAVE_GROUP, {
      peerId: senderId,
      host,
    });
  });
};
