import type { BindingSpec, Database } from "@sqlite.org/sqlite-wasm";
import initSqlite from "@sqlite.org/sqlite-wasm";

import { LOG_LEVEL } from "../config";
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

    const dbFileName = "/chats.db";
    const dbFlags = LOG_LEVEL === "trace" ? "ct" : "c";

    const opfsAvailable = "opfs" in sqlite3;
    db = opfsAvailable
      ? new sqlite3.oo1.OpfsDb(dbFileName, dbFlags)
      : new sqlite3.oo1.DB(dbFileName, dbFlags);
    logger.debug("Created database", db.filename);
    logger.debug("OPFS Available", opfsAvailable);

    logger.debug("Creating tables...");

    db.exec(`CREATE TABLE IF NOT EXISTS "chats" (
        "id" TEXT NOT NULL PRIMARY KEY,
        "title" TEXT,
        "createdDate" INTEGER NOT NULL,
        "updatedDate" INTEGER NOT NULL
    )`);
    db.exec(`CREATE TABLE IF NOT EXISTS "messages" (
        "id" TEXT NOT NULL PRIMARY KEY,
        "chatId" TEXT NOT NULL,
        "role" TEXT,
        "content" TEXT,
        "createdDate" INTEGER NOT NULL,
        "updatedDate" INTEGER NOT NULL,
        CONSTRAINT "messages_chatId_fkey" FOREIGN KEY ("chatId") REFERENCES "chats" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
    )`);
    db.exec(
      `CREATE UNIQUE INDEX IF NOT EXISTS "messages_chatId" ON "messages"("chatId")`,
    );

    logger.debug("Tables created");

    logger.debug("SQLite initialized");

    return Promise.resolve(db);
  } catch (e) {
    logger.error(e);
    return Promise.reject(e);
  }
};

const close = () => {
  if (!db) return;
  logger.debug("Closing SQLite");
  db.close();
};

const execute = async (args: [string, BindingSpec]) => {
  logger.trace("Received execute message with args", args);
  const db = await start();

  const [sql, bind = []] = args;
  logger.debug("Executing query", sql, bind);
  const result = db.exec({
    sql,
    bind,
    returnValue: "resultRows",
  });

  logger.trace("Result", result);
  postMessage(result);

  close();
};
