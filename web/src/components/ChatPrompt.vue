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
  "on-receive-topic": [topic: string];
}>();

const model = computed(() => chatStore.selectedModel);
const messages = computed(() => chatStore.chatMessages);
const prompt = ref("");

const extractChatTopic = (userPrompt: string) => {
  logger.debug("Extracting chat topic");
  logger.debug("User prompt:", userPrompt);
  ollama
    .generate({
      model: model.value,
      prompt: `what is the topic of the following question? '${userPrompt}'. reply with key of 'topic' and the value in title case`,
      stream: false,
      options: {
        temperature: 0.1,
        num_predict: 60,
      },
      format: "json",
    })
    .then((result) => {
      logger.debug("Extract topic response:", result);
      let topic = "";

      try {
        const response = JSON.parse(result.response) as Record<string, string>;
        logger.debug("Model response:", response);

        if (response["topic"]) {
          topic = response["topic"];
          logger.debug("Topic:", topic);

          emit("on-receive-topic", topic);
        } else {
          logger.debug("Topic not found");
        }
      } catch (e) {
        logger.error(e);
      }
    })
    .catch((error) => logger.error(error));
};

const onSubmit = async () => {
  try {
    emit("on-submit-prompt");
    emit("on-set-done", false);

    const userMessage: Message = {
      role: "user",
      content: prompt.value,
    };
    emit("on-receive-message", userMessage);
    // extract the chat topic if first message in the chat
    if (messages.value.length === 1) {
      extractChatTopic(prompt.value);
    }

    prompt.value = "";
    logger.debug(messages);

    const response = await ollama.chat({
      model: model.value,
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
      :disabled="!model"
      class="w-full bg-transparent border-2 border-primary focus:outline-secondary rounded-md p-3"
      placeholder="Ask a question..."
    />
  </form>
</template>
