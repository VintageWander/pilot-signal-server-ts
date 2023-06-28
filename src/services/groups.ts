import { validate as uuidValidate } from "uuid";
import { GROUPS } from "../server";

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

export const groupServices = {
  getGroupById,
  isExistedPeer,
};
