import app from "./app.js";
import * as logger from "./logger/logger.js";
import * as config from "./utils/config.js";

app.listen(config.PORT, () => {
  logger.info(`Server running on port ${config.PORT}`);
});
