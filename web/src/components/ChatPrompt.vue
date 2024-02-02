<script setup lang="ts">
// import { ollama } from "../libs/ollama";
import type { ChatRequest, ChatResponse, Message } from "ollama";
import { ref } from "vue";
import { OLLAMA_URL } from "../config";
import { logger } from "../libs/logger";

const { messages = [] } = defineProps<{
  messages: Message[];
  done: boolean;
}>();

const emit = defineEmits<{
  "on-receive-response": [response: ChatResponse];
  "on-receive-message": [message: Message];
  "on-set-done": [done: boolean];
  "on-reset-responses": [];
  "on-submit-prompt": [];
}>();

const prompt = ref("");

const onSubmit = async () => {
  try {
    /*
      ollama js not currently working due to following issue:
      https://github.com/ollama/ollama-js/issues/33
    */
    // const response = await ollama.generate({
    //   model: "llama2",
    //   prompt: prompt.value,
    //   stream: true,
    // });
    // logger.info(response);

    // for await (const part of response) {
    //   logger.info(part);
    // }

    emit("on-submit-prompt");
    emit("on-set-done", false);

    const userMessage: Message = {
      role: "user",
      content: prompt.value,
    };
    emit("on-receive-message", userMessage);

    prompt.value = "";
    const body: ChatRequest = {
      model: "llama2",
      messages,
      stream: true,
    };
    logger.debug(body.messages);

    const response = await fetch(`${OLLAMA_URL}/api/chat`, {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });
    if (!response.body) return;

    const reader = response.body.getReader();
    const decoder = new TextDecoder();

    let done = false;
    let value: Uint8Array | undefined;

    const messageChunks: string[] = [];

    do {
      ({ done, value } = await reader.read());
      if (done) {
        const assistantMessage: Message = {
          role: "assistant",
          content: messageChunks.join(""),
        };
        emit("on-receive-message", assistantMessage);
        emit("on-set-done", true);
        emit("on-reset-responses");

        logger.info("done");
        return;
      }

      const chunk = decoder.decode(value);
      const jsonChunk = JSON.parse(chunk) as ChatResponse;

      messageChunks.push(jsonChunk.message.content);
      emit("on-receive-response", jsonChunk);
    } while (!done);
  } catch (e) {
    logger.error(e);
  }
};
</script>

<template>
  <form @submit.prevent="onSubmit" class="w-full p-2">
    <input
      v-model="prompt"
      class="w-full bg-transparent border-2 border-secondary focus:outline-primary rounded-md p-3"
      placeholder="Ask a question..."
    />
  </form>
</template>
