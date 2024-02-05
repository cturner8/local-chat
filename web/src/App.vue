<script setup lang="ts">
import { onBeforeUnmount, onMounted } from "vue";
import Chat from "./components/Chat.vue";
import ChatHistory from "./components/ChatHistory.vue";
import { logger } from "./libs/logger";
import SqliteWorker from "./workers/sqlite?worker";

const sqlite = new SqliteWorker();
sqlite.onmessage = (message) => {
  logger.debug(message.data);
};

onMounted(() => {
  sqlite.postMessage([`select count(*) from chats`]);
});

onBeforeUnmount(() => {
  sqlite.terminate();
});
</script>

<template>
  <div
    class="w-screen h-screen flex flex-row [color-scheme:light_dark] dark:bg-neutral dark:text-white font-sans"
  >
    <ChatHistory />
    <Chat />
  </div>
</template>
