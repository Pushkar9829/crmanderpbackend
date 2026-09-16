function required(name) {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

function corsOrigin() {
  const raw = process.env.CLIENT_ORIGIN || "*";
  if (raw === "*") return true;
  const list = raw
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
  if (list.length === 0) return true;
  return list.length === 1 ? list[0] : list;
}

function getEnv() {
  const isProduction = process.env.NODE_ENV === "production";
  return {
    nodeEnv: process.env.NODE_ENV || "development",
    isProduction,
    host: process.env.HOST || (isProduction ? "0.0.0.0" : "127.0.0.1"),
    port: Number(process.env.PORT) || 5050,
    mongodbUri: required("MONGODB_URI"),
    jwtSecret: required("JWT_SECRET"),
    jwtExpiresIn: process.env.JWT_EXPIRES_IN || "7d",
    clientOrigin: corsOrigin(),
    serveClient: process.env.SERVE_CLIENT !== "false",
    clientDist: process.env.CLIENT_DIST || "",
  };
}

module.exports = { getEnv };
