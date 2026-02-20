import app from "./app.js";
import { config } from "./config/env.js";
import { logger } from "./logger.js";

app.listen(config.PORT, () => {
  logger.info(`Server running on port ${config.PORT}`);
});
