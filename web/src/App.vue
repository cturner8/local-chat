<script setup lang="ts">
import { onBeforeUnmount, onMounted } from "vue";
import Chat from "./components/Chat.vue";
import ChatHistory from "./components/ChatHistory.vue";
import { logger } from "./libs/logger";
import { ollama } from "./libs/ollama";
import type { Preference } from "./schemas";
import { chatStore } from "./stores/chatStore";
import SqliteWorker from "./workers/sqlite?worker";

const sqlite = new SqliteWorker();
sqlite.onmessage = (message: MessageEvent<[string, string][]>) => {
  logger.info(message.data);
  const mappedPreferences = message.data.map(
    ([id = "", value = ""]): Preference => ({ id, value }),
  );
  chatStore.preferences = mappedPreferences;
};

onMounted(() => {
  sqlite.postMessage([`select id, value from preferences`]);
  ollama
    .list()
    .then((response) => {
      logger.debug(response);
      const { models = [] } = response;
      chatStore.models = models;
    })
    .catch((error) => logger.error(error));
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
