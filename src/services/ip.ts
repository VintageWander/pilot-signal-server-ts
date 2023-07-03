import to from "await-to-js";
import axios from "axios";

import { IPLOCATION_URL } from "../config";
import { LocationResponse } from "../types";

const ip4v2 = (ipAddress: string): string => {
  const comps = ipAddress.replace(/::/g, "").split(":");
  if (!comps[1] || !comps[0]) {
    throw new Error("The provided input was not an ip address: " + ipAddress);
  }
  return comps[1] || comps[0];
};

const getLocation = async (ip: string): Promise<LocationResponse> => {
  const [err, result] = await to(
    axios.get<LocationResponse>(`${IPLOCATION_URL}/query?ip=${ip}`)
  );
  if (err) {
    return {
      data: {
        ISP: "unknown",
      },
    };
  }
  return result.data;
};

export const ipService = {
  ip4v2,
  getLocation,
};
