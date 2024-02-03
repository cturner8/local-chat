<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted } from "vue";

import { logger } from "../libs/logger";
import type { ChatHistory } from "../schemas";
import { chatStore } from "../stores/chatStore";
import SqliteWorker from "../workers/sqlite?worker";

const chats = computed(() => chatStore.chats);
const selectedChatId = computed(() => chatStore.selectedChatId);
// const params = computed(() => chatStore.params);

const sqlite = new SqliteWorker();
sqlite.onmessage = (message: MessageEvent<[string, string]>) => {
  logger.info(message.data);
  const mappedChats = message.data.map(
    ([id = "", title = ""]): ChatHistory => ({ id, title }),
  );

  chatStore.chats = mappedChats;
};

onMounted(() => {
  // const idParam = params.value.get("id");
  // if (idParam) {
  //   chatStore.selectChat(idParam);
  // }

  sqlite.postMessage([
    `select id, title from chats order by updatedDate desc`,
    [],
  ]);
});

onBeforeUnmount(() => {
  sqlite.terminate();
});
</script>

<template>
  <div class="dark:bg-layout md:w-3/12 rounded-r-md p-3 text-left">
    <div class="flex justify-between">
      <h2>My Chats</h2>
      <button class="px-2 rounded-md hover:bg-contrast">
        <font-awesome-icon icon="fa-solid fa-plus" />
      </button>
    </div>
    <div v-if="chats.length" class="flex flex-col my-6 gap-4">
      <button
        v-for="chat in chats"
        :key="chat.id"
        class="p-3 rounded-md hover:bg-contrast text-left"
        :class="{ 'bg-primary': chat.id === selectedChatId }"
        @click="chatStore.selectChat(chat.id)"
      >
        {{ chat.title }}
      </button>
    </div>
  </div>
</template>
