<script setup lang="ts">
import DOMPurify from "dompurify";
import showdown from "showdown";
import { computed, onBeforeUnmount, watch } from "vue";
import { logger } from "../libs/logger";
import type { ChatMessage } from "../schemas";
import { chatStore } from "../stores/chatStore";
import SqliteWorker from "../workers/sqlite?worker";

type ChatMessageWithHtml = ChatMessage & { htmlContent: string };

const converter = new showdown.Converter();

const { responseContent, done, promptSubmitted, hasResponses } = defineProps<{
  responseContent: string;
  done: boolean;
  promptSubmitted: boolean;
  hasResponses: boolean;
}>();

const chatId = computed(() => chatStore.selectedChatId);
const fetchedChatMessageIds = computed(() => chatStore.fetchedChatMessageIds);

const messages = computed<ChatMessageWithHtml[]>(() =>
  chatStore.chatMessages.map((message): ChatMessageWithHtml => {
    const html = converter.makeHtml(message.content);
    const cleanHtml = DOMPurify.sanitize(html, {
      USE_PROFILES: { html: true },
    });
    return {
      ...message,
      htmlContent: cleanHtml,
    };
  }),
);

const sqlite = new SqliteWorker();
sqlite.onmessage = (
  message: MessageEvent<[string, string, string, string, number, number][]>,
) => {
  logger.info(message.data);
  const mappedMessages = message.data.map(
    ([
      id = "",
      chatId = "",
      role = "",
      content = "",
      createdDate = 0,
      updatedDate = 0,
    ]): ChatMessage => ({
      id,
      chatId,
      role,
      content,
      createdDate,
      updatedDate,
    }),
  );

  chatStore.messages.push(...mappedMessages);
  chatStore.fetchedChatMessageIds.push(chatId.value);
};

watch(chatId, () => {
  if (fetchedChatMessageIds.value.includes(chatId.value)) return;
  logger.debug("Fetching messages for chat ID:", chatId.value);
  sqlite.postMessage([
    `select id, chatId, role, content, createdDate, updatedDate from chat_messages where chatId = ? order by createdDate asc`,
    [chatId.value],
  ]);
});

onBeforeUnmount(() => {
  sqlite.terminate();
});
</script>

<template>
  <div
    class="flex flex-col grow gap-4 w-full h-full overflow-y-auto p-2 text-left"
  >
    <span
      v-for="message in messages"
      :key="message.id"
      :class="[
        'dark:text-white rounded-md p-3 text-pretty whitespace-pre-line',
        message.role === 'user' && 'bg-primary',
      ]"
      :innerHTML="message.htmlContent"
    />
    <span
      v-if="!done && hasResponses"
      class="dark:text-white rounded-md p-3 text-pretty whitespace-pre-line"
      :innerHTML="responseContent"
    />
    <template v-if="!done">
      <p
        v-if="promptSubmitted && !hasResponses"
        class="dark:text-white rounded-md p-3"
      >
        Thinking...
      </p>
      <p v-else-if="hasResponses" class="dark:text-white rounded-md p-3">
        Typing...
      </p>
    </template>
  </div>
</template>
