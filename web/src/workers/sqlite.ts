import type { BindingSpec, Database } from "@sqlite.org/sqlite-wasm";
import initSqlite from "@sqlite.org/sqlite-wasm";

import { DEV, IN_MEMORY_DB, LOG_LEVEL } from "../config";
import { logger } from "../libs/logger";

if (typeof self !== "undefined" && typeof window === "undefined") {
  logger.trace("Running in worker");
}

export enum MessageEvents {
  Start,
  Close,
  Execute,
}
export type Args = [string, BindingSpec];

const DB_FILE_NAME = "chats.db";

let db: Database | null = null;

onmessage = async (message: MessageEvent<Args>) => {
  logger.trace(message);
  logger.trace("Processing message:", message.data);
  return execute(message.data);
};

const start = async () => {
  try {
    logger.debug("Initializing SQLite...");
    const sqlite3 = await initSqlite({
      print: logger.debug,
      printErr: logger.error,
    });

    const dbFlags = LOG_LEVEL === "trace" ? "ct" : "c";

    const useInMemoryMode = DEV && IN_MEMORY_DB === "true";
    const opfsAvailable = "opfs" in sqlite3;
    logger.trace("OPFS Available", opfsAvailable);
    logger.trace("In memory mode:", useInMemoryMode);

    db = new sqlite3.oo1.OpfsDb(
      DEV && IN_MEMORY_DB === "true" ? ":memory:" : DB_FILE_NAME,
      dbFlags,
    );
    logger.trace("Created database", db.filename);

    logger.trace("Creating tables...");

    db.exec(`CREATE TABLE IF NOT EXISTS "chats" (
        "id" TEXT NOT NULL PRIMARY KEY,
        "title" TEXT NOT NULL,
        "createdDate" INTEGER NOT NULL,
        "updatedDate" INTEGER NOT NULL
    )`);
    db.exec(`CREATE TABLE IF NOT EXISTS "chat_messages" (
        "id" TEXT NOT NULL PRIMARY KEY,
        "chatId" TEXT NOT NULL,
        "role" TEXT NOT NULL,
        "content" TEXT NOT NULL,
        "createdDate" INTEGER NOT NULL,
        "updatedDate" INTEGER NOT NULL,
        CONSTRAINT "chat_messages_chatId_fkey" FOREIGN KEY ("chatId") REFERENCES "chats" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
    )`);
    db.exec(`CREATE TABLE IF NOT EXISTS "preferences" (
      "id" TEXT NOT NULL PRIMARY KEY,
      "value" TEXT NOT NULL
    )`);

    logger.trace("Tables created");

    logger.debug("SQLite initialized");

    return Promise.resolve(db);
  } catch (e) {
    logger.error(e);
    return Promise.reject(e);
  }
};

// const close = () => {
//   if (!db) return;
//   logger.trace("Closing SQLite");
//   db.close();
// };

const execute = async (args: [string, BindingSpec?]) => {
  logger.trace("Received execute message with args", args);
  if (!db) {
    db = await start();
  }

  const [sql, bind = []] = args;
  logger.debug("Executing query", sql, bind);
  const result = db.exec({
    sql,
    bind,
    returnValue: "resultRows",
  });

  logger.trace("Result", result);
  postMessage(result);

  // close();
};

// const drop = async () => {
//   logger.debug("Dropping database file", DB_FILE_NAME);
//   const root = await navigator.storage.getDirectory();
//   return root.removeEntry(DB_FILE_NAME);
// };
