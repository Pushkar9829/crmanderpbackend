const path = require("path");
const express = require("express");
const cors = require("cors");
const routes = require("./routes");
const { getEnv } = require("./config/env");

function createApp() {
  const env = getEnv();
  const app = express();

  const corsOptions = {
    origin: env.clientOrigin,
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  };

  app.use(cors(corsOptions));
  app.use(express.json());
  app.get("/api/health", (_req, res) => res.json({ ok: true }));
  app.use("/api", routes);

  if (env.isProduction && env.serveClient) {
    const dist = env.clientDist
      ? path.resolve(env.clientDist)
      : path.join(__dirname, "../../client/dist");
    app.use(express.static(dist));
    app.use((req, res, next) => {
      if (req.path.startsWith("/api")) return next();
      if (req.method !== "GET") return next();
      res.sendFile(path.join(dist, "index.html"), (error) => {
        if (error) next(error);
      });
    });
  }

  app.use((err, _req, res, _next) => {
    const status = err.status || 500;
    res.status(status).json({ message: err.message || "Server error" });
  });

  return app;
}

module.exports = createApp;
