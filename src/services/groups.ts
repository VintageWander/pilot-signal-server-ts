import { validate as uuidValidate } from "uuid";
import { GROUPS } from "../server";
import { WebSocketEventDataDesc } from "../types";

const getGroupById = (groupId: string) => {
  if (uuidValidate(groupId)) {
    return { ...GROUPS[groupId] };
  }
  return undefined;
};

const isExistedPeer = (groupId: string, peerId: string): string | undefined => {
  if (!uuidValidate(groupId) || !uuidValidate(peerId) || !GROUPS[groupId]) {
    return undefined;
  }
  let group = GROUPS[groupId];
  if (!group) return undefined;
  return group.peerIds.find((element) => element === peerId);
};

const addPeer = (
  groupId: string,
  peerId: string,
  desc: WebSocketEventDataDesc
) => {
  let group = GROUPS[groupId];
  if (group) {
    group.peerIds.push(peerId);
    const mixedDesc = { ...desc, ...group.desc };
    group.desc = mixedDesc;
  }

  return { ...group };
};

const removePeer = (
  groupId: string,
  peerId: string
): { peers: string[]; host: string } => {
  if (!GROUPS[groupId]) return { peers: [], host: "" };

  const group = GROUPS[groupId];
  if (!group) return { peers: [], host: "" };

  const peerIds = group.peerIds;
  const peerIdsAfterRemove = peerIds.filter((element) => element !== peerId);

  group.peerIds = peerIdsAfterRemove;

  if (peerId === group.host) {
    let firstPeer = peerIdsAfterRemove[0];
    if (!firstPeer) return { peers: [], host: "" };
    group.host = firstPeer;
  }

  if (peerIdsAfterRemove.length === 0) {
    delete GROUPS[groupId];
  }

  return { peers: [...peerIdsAfterRemove], host: group.host };
};

export const groupServices = {
  getGroupById,
  isExistedPeer,
  addPeer,
  removePeer,
};
