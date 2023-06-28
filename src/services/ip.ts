const ip4v2 = (ipAddress: string): string => {
  const comps = ipAddress.replace(/::/g, "").split(":");
  if (comps[1] === undefined || comps[0] === undefined) {
    throw new Error("The provided input was not an ip address: " + ipAddress);
  }
  return comps[1] || comps[0];
};

export const ipService = {
  ip4v2,
};
