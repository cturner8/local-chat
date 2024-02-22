import type { LogLevelDesc } from "loglevel";
import logger, { levels } from "loglevel";
import { LOG_LEVEL } from "../config";
logger.setDefaultLevel(levels.ERROR);
if (LOG_LEVEL) {
  logger.setDefaultLevel(LOG_LEVEL as LogLevelDesc);
}
export { logger };
