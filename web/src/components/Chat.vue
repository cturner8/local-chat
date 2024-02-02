<script setup lang="ts">
import { ref } from "vue";
// import { ollama } from "../libs/ollama";
import type { ChatResponse, Message } from "ollama";

import { logger } from "../libs/logger";
import ChatMessages from "./ChatMessages.vue";
import ChatPrompt from "./ChatPrompt.vue";

const promptSubmitted = ref(false);
const done = ref(false);
const responses = ref<ChatResponse[]>([]);
const messages = ref<Message[]>([]);

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
  messages.value.push(message);
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
</script>

<template>
  <div class="h-full w-full flex flex-col justify-center items-center">
    <div class="flex flex-col h-full w-full md:max-w-3xl justify-end">
      <ChatMessages
        :responses="responses"
        :messages="messages"
        :done="done"
        :prompt-submitted="promptSubmitted"
      />
      <ChatPrompt
        @on-receive-response="onReceiveResponse"
        @on-receive-message="onReceiveMessage"
        @on-set-done="onSetDone"
        @on-reset-responses="onResetResponses"
        @on-submit-prompt="onSubmitPrompt"
        :messages="messages"
        :done="done"
      />
    </div>
  </div>
</template>
