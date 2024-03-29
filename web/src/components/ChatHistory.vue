<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted } from "vue";
import ChatActions from "./ChatActions.vue";
import ModelSelectMenu from "./ModelSelectMenu.vue";

import { logger } from "../libs/logger";
import type { ChatHistory } from "../schemas";
import { chatStore } from "../stores/chatStore";
import SqliteWorker from "../workers/sqlite?worker";

const chats = computed(() => chatStore.chats);
const selectedChatId = computed(() => chatStore.selectedChatId);

const sqlite = new SqliteWorker();
sqlite.onmessage = (message: MessageEvent<[string, string][]>) => {
  logger.info(message.data);
  const mappedChats = message.data.map(
    ([id = "", title = ""]): ChatHistory => ({ id, title }),
  );

  chatStore.chats = mappedChats;
};

onMounted(() => {
  const limit = 10;
  sqlite.postMessage([
    `select id, title from chats order by updatedDate desc limit ?`,
    [limit],
  ]);
});

onBeforeUnmount(() => {
  sqlite.terminate();
});
</script>

<template>
  <div class="bg-layoutLight dark:bg-layoutDark md:w-3/12 rounded-r-md p-3">
    <div class="flex justify-between">
      <h1 class="font-semibold prose dark:prose-invert">My Chats</h1>
      <ChatActions />
    </div>
    <ModelSelectMenu />
    <div v-if="chats.length" class="flex flex-col my-6 gap-4">
      <button
        v-for="chat in chats"
        :key="chat.id"
        class="p-3 rounded-md hover:bg-contrastLight dark:hover:bg-contrastDark prose dark:prose-invert text-left"
        :class="{
          'bg-primary hover:bg-primaryFocusLight dark:hover:bg-primaryFocusDark':
            chat.id === selectedChatId,
        }"
        @click="chatStore.selectedChatId = chat.id"
      >
        {{ chat.title }}
      </button>
    </div>
  </div>
</template>
