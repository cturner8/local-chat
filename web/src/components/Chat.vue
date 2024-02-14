<script setup lang="ts">
import DOMPurify from "dompurify";
import type { ChatResponse, Message } from "ollama";
import showdown from "showdown";
import { computed, onBeforeUnmount, ref, watch } from "vue";

import { logger } from "../libs/logger";
import type { Chat, ChatMessage } from "../schemas";
import { chatStore } from "../stores/chatStore";
import SqliteWorker from "../workers/sqlite?worker";
import ChatMessages from "./ChatMessages.vue";
import ChatPrompt from "./ChatPrompt.vue";

const converter = new showdown.Converter();

const sqlite = new SqliteWorker();
sqlite.onmessage = (message) => {
  logger.info(message.data);
};

onBeforeUnmount(() => {
  sqlite.terminate();
});

const chatId = computed(() => chatStore.selectedChatId);
const fetchedChatMessageIds = computed(() => chatStore.fetchedChatMessageIds);
const chatMessages = computed(() => chatStore.chatMessages);

watch(chatId, () => {
  logger.debug("Chat ID:", chatId.value);
});

watch(chatMessages, () => {
  logger.debug("Store messages:", chatStore.messages);
  logger.debug("Chat messages", chatMessages);
});

const promptSubmitted = ref(false);
const done = ref(false);
const responses = ref<ChatResponse[]>([]);

const responseContent = computed(() => {
  const html = converter.makeHtml(
    responses.value.map((response) => response.message.content).join(""),
  );
  const cleanHtml = DOMPurify.sanitize(html, {
    USE_PROFILES: { html: true },
  });
  return cleanHtml;
});

const initChat = () => {
  logger.debug("Initializing new chat");

  chatStore.selectedChatId = crypto.randomUUID();

  const now = Date.now();
  const formattedDateString = new Intl.DateTimeFormat(navigator.language, {
    year: "numeric",
    month: "numeric",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
  }).format(now);

  const chat: Chat = {
    id: chatId.value,
    title: formattedDateString,
    createdDate: now,
    updatedDate: now,
  };

  logger.debug("Chat", chat);

  chatStore.chats = [
    {
      id: chat.id,
      title: chat.title,
    },
    ...chatStore.chats,
  ];
  sqlite.postMessage([
    `insert into chats (id, title, createdDate, updatedDate) values (?, ?, ?, ?)`,
    [chat.id, chat.title, chat.createdDate, chat.updatedDate],
  ]);

  chatStore.selectedChatId = chatId.value;
};

const saveChatMessage = (message: Message) => {
  logger.debug("Saving chat message", message);

  const id = crypto.randomUUID();
  const now = Date.now();

  const { role, content } = message;
  const chatMessage: ChatMessage = {
    id,
    chatId: chatId.value,
    role,
    content,
    createdDate: now,
    updatedDate: now,
  };

  logger.debug("Chat message", chatMessage);

  sqlite.postMessage([
    `insert into chat_messages (id, chatId, role, content, createdDate, updatedDate) values (?, ?, ?, ?, ?, ?)`,
    [
      chatMessage.id,
      chatMessage.chatId,
      chatMessage.role,
      chatMessage.content,
      chatMessage.createdDate,
      chatMessage.updatedDate,
    ],
  ]);
  return chatMessage;
};

const onResetResponses = () => {
  logger.trace();
  responses.value = [];
};
const onReceiveResponse = (response: ChatResponse) => {
  logger.trace(response);
  responses.value.push(response);
};

const onReceiveMessage = (message: Message) => {
  logger.trace(message);
  if (!chatId.value) initChat();
  const chatMessage = saveChatMessage(message);
  chatStore.messages.push(chatMessage);
  if (!fetchedChatMessageIds.value.includes(chatId.value)) {
    chatStore.fetchedChatMessageIds.push(chatId.value);
  }
};

const onSetDone = (d: boolean) => {
  logger.trace(d);
  done.value = d;
};
const onSubmitPrompt = () => {
  logger.trace("Prompt submitted");
  if (!promptSubmitted.value) {
    logger.trace("Updating prompt submitted flag");
    promptSubmitted.value = true;
  }
};

const onReceiveTopic = (topic: string) => {
  logger.trace(topic);
  sqlite.postMessage([
    `update chats set title = ? where id = ?`,
    [topic, chatId.value],
  ]);
};
</script>

<template>
  <div class="h-full w-full flex flex-col grow justify-center items-center">
    <div class="flex flex-col h-full w-full md:max-w-3xl justify-end">
      <ChatMessages
        :response-content="responseContent"
        :has-responses="Boolean(responses.length)"
        :done="done"
        :prompt-submitted="promptSubmitted"
      />
      <ChatPrompt
        @on-receive-response="onReceiveResponse"
        @on-receive-message="onReceiveMessage"
        @on-set-done="onSetDone"
        @on-reset-responses="onResetResponses"
        @on-submit-prompt="onSubmitPrompt"
        @on-receive-topic="onReceiveTopic"
        :done="done"
      />
    </div>
  </div>
</template>
