<script setup lang="ts">
import type { ChatResponse, Message } from "ollama";
import { computed, ref } from "vue";
import { logger } from "../libs/logger";
import { ollama } from "../libs/ollama";
import { chatStore } from "../stores/chatStore";

const emit = defineEmits<{
  "on-receive-response": [response: ChatResponse];
  "on-receive-message": [message: Message];
  "on-set-done": [done: boolean];
  "on-reset-responses": [];
  "on-submit-prompt": [];
}>();

const messages = computed(() => chatStore.chatMessages);
const prompt = ref("");

const onSubmit = async () => {
  try {
    emit("on-submit-prompt");
    emit("on-set-done", false);

    const userMessage: Message = {
      role: "user",
      content: prompt.value,
    };
    emit("on-receive-message", userMessage);

    prompt.value = "";
    logger.debug(messages);

    const response = await ollama.chat({
      model: "llama2",
      messages: messages.value.map(
        ({ role, content }): Message => ({
          role,
          content,
        }),
      ),
      stream: true,
    });
    logger.trace(response);

    const messageChunks: string[] = [];
    for await (const part of response) {
      messageChunks.push(part.message.content);
      emit("on-receive-response", part);
    }

    const assistantMessage: Message = {
      role: "assistant",
      content: messageChunks.join(""),
    };
    emit("on-receive-message", assistantMessage);
    emit("on-set-done", true);
    emit("on-reset-responses");

    logger.info("done");
  } catch (e) {
    logger.error(e);
  }
};
</script>

<template>
  <form @submit.prevent="onSubmit" class="w-full p-2">
    <input
      v-model="prompt"
      class="w-full bg-transparent border-2 border-primary focus:outline-secondary rounded-md p-3"
      placeholder="Ask a question..."
    />
  </form>
</template>
