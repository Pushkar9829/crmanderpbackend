require("dotenv").config();
const { connectDb } = require("./config/db");
const { getEnv } = require("./config/env");
const createApp = require("./app");

try {
  const env = getEnv();
  const app = createApp();

  connectDb(env.mongodbUri)
    .then(() => {
      app.listen(env.port, "0.0.0.0", () => {
        console.log(`API listening on port ${env.port}`);
      });
    })
    .catch((error) => {
      console.error("Failed to start", error);
      process.exit(1);
    });
} catch (error) {
  console.error(error.message);
  process.exit(1);
}
