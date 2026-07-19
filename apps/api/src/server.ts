import app from "./app";
import { connectDB } from "./configs/db";
import env from "./configs/env";
import { logger } from "./shared/utils/logger";
import { configureGracefulShutdown } from "./shared/utils/shutdown";

connectDB().then(() => {
  const server = app.listen(env.PORT, () => {
    logger.info(`
      ################################################
      🛡️  Server listening on port: ${env.PORT} 🛡️
      ################################################
      `);
  });
  configureGracefulShutdown(server);
});
