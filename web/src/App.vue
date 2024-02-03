<script setup lang="ts">
import { onBeforeUnmount, onMounted } from "vue";
import Chat from "./components/Chat.vue";
import { logger } from "./libs/logger";
import SqliteWorker from "./workers/sqlite?worker";

const sqlite = new SqliteWorker();
sqlite.onmessage = (message) => {
  logger.info("Received worker message", message.data);
};

onMounted(() => {
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
