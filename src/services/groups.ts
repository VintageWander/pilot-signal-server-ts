import { validate as uuidValidate } from "uuid";

import { MAX_PEERS_IN_GROUP } from "../config";
import { GROUPS } from "../server";
import { GROUP_TYPE, WebSocketEventDataDesc } from "../types";

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

const calcScore = (
  group: GROUP_TYPE | undefined,
  condition: WebSocketEventDataDesc
): number => {
  let score = 0;
  if (!group) return 0;
  const { desc, peerIds } = group;

  // Hard conditions
  console.log("Calculate score: ", desc, condition);
  const hardCondition =
    peerIds.length >= MAX_PEERS_IN_GROUP ||
    condition.sourceURL !== desc.sourceURL ||
    condition.isp !== desc.isp;

  if (hardCondition) {
    return 0;
  } else score += 1;

  // Soft conditions
  if (desc.location === condition.location) score += 1;
  if (desc.os === condition.os) score += 1;

  return score;
};

const evaluate = (condition: WebSocketEventDataDesc): string | undefined => {
  let maxScore = 0;
  let bestGroupId = "";

  Object.keys(GROUPS).forEach((groupId) => {
    const group = GROUPS[groupId];
    const score = calcScore(group, condition);
    if (score > maxScore) {
      maxScore = score;
      bestGroupId = groupId;
    }
  });
  return maxScore ? bestGroupId : undefined;
};

const newGroup = (
  groupId: string,
  groupToken: string,
  firstPeer: {
    peerId: string;
    desc: WebSocketEventDataDesc;
  }
): GROUP_TYPE => {
  const { peerId, desc } = firstPeer;
  const newGroup: GROUP_TYPE = {
    groupToken,
    desc,
    peerIds: [peerId],
    host: firstPeer.peerId,
  };
  GROUPS[groupId] = newGroup;
  return { ...newGroup };
};

export const groupServices = {
  getGroupById,
  isExistedPeer,
  addPeer,
  removePeer,
  evaluate,
  newGroup,
};
