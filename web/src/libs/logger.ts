import type { LogLevelDesc } from "loglevel";
import logger from "loglevel";
import { LOG_LEVEL } from "../config";
if (LOG_LEVEL) {
  logger.setDefaultLevel(LOG_LEVEL as LogLevelDesc);
}
export { logger };
