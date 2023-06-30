import { sign, verify } from "jsonwebtoken";

import { EXPIRED_TIME, JWT_SECRET_KEY } from "../config";
import { SIGNALING_MESSAGE_TYPES } from "../constants";
import { Payload } from "../types";
import { groupServices } from "./groups";

const generateGroupToken = (payload: Payload): string => {
  return sign(payload, JWT_SECRET_KEY, { expiresIn: EXPIRED_TIME });
};

const verifyToken = async (
  msgType: SIGNALING_MESSAGE_TYPES,
  groupToken: string | undefined
): Promise<boolean> => {
  if (!groupToken) return true;
  const autoPass =
    msgType === SIGNALING_MESSAGE_TYPES.ONLINE ||
    msgType === SIGNALING_MESSAGE_TYPES.JOIN_GROUP; // extend...
  if (autoPass) return true;

  try {
    const data = (await verify(groupToken, JWT_SECRET_KEY)) as Payload;
    const { groupId } = data;
    const group = groupServices.getGroupById(groupId);
    return !!group;
  } catch {
    return false;
  }
};

export const verifier = {
  generateGroupToken,
  verifyToken,
};
