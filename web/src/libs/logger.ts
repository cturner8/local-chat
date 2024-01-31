import logger from "loglevel";
import type { LogLevelDesc } from "loglevel";
import { LOG_LEVEL } from "../config";
logger.setDefaultLevel(LOG_LEVEL as LogLevelDesc);
export { logger };
