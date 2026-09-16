function required(name) {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

function normalizeOrigin(value) {
  try {
    return new URL(value).origin;
  } catch {
    return String(value || "").replace(/\/$/, "");
  }
}

function corsOrigin() {
  const raw = process.env.CLIENT_ORIGIN || "*";
  const listed = raw
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean)
    .map(normalizeOrigin);

  return function (origin, callback) {
    if (!origin) return callback(null, true);
    if (listed.includes("*")) return callback(null, true);
    if (listed.includes(origin)) return callback(null, true);

    try {
      const host = new URL(origin).hostname;
      if (host.endsWith(".vercel.app")) return callback(null, true);
      if (host === "localhost" || host === "127.0.0.1") return callback(null, true);
    } catch {
      /* ignore */
    }

    return callback(null, false);
  };
}

function getEnv() {
  const isProduction = process.env.NODE_ENV === "production";
  return {
    nodeEnv: process.env.NODE_ENV || "development",
    isProduction,
    host: process.env.HOST || "0.0.0.0",
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
