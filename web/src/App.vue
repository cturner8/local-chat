<script setup lang="ts">
import { onBeforeUnmount, onMounted } from "vue";
import Chat from "./components/Chat.vue";

import { logger } from "./libs/logger";

// import type { Args } from "./workers/sqlite";
import SqliteWorker from "./workers/sqlite?worker";

const sqlite = new SqliteWorker();
sqlite.onmessage = (message) => {
  logger.info("Received worker message", message.data);
};

onMounted(() => {
  // const now = Date.now();
  // const args: Args = [
  //   `insert into "chats" (id, createdDate, updatedDate) values (?, ?, ?)`,
  //   [crypto.randomUUID(), now, now],
  // ];
  // sqlite.postMessage(args);

  sqlite.postMessage([`select * from chats`, []]);
});

onBeforeUnmount(() => {
  sqlite.terminate();
});
</script>

<template>
  <div
    class="w-screen h-screen [color-scheme:light_dark] dark:bg-neutral dark:text-white font-sans"
  >
    <Chat />
  </div>
</template>
