export const PORT = process.env.PORT ? parseInt(process.env.PORT) : 9090;
export const IPLOCATION_URL =
  process.env.IPLOCATION_URL || "http://123.30.235.49:5688";

export const MAX_PEERS_IN_GROUP = 50;
export const JWT_SECRET_KEY = "spilot_p2p";
export const EXPIRED_TIME = "100d";
