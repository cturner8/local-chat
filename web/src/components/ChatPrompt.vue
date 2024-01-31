<script setup lang="ts">
// import { ollama } from "../libs/ollama";
import type { ChatRequest, ChatResponse } from "ollama";
import { ref } from "vue";
import { OLLAMA_URL } from "../config";
import { logger } from "../libs/logger";

const emit = defineEmits<{
  "on-receive-response": [response: ChatResponse];
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

    const body: ChatRequest = {
      model: "llama2",
      messages: [
        {
          role: "user",
          content: prompt.value,
        },
      ],
      stream: true,
    };
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

    do {
      ({ done, value } = await reader.read());
      if (done) {
        logger.info("done");
        return;
      }

      const chunk = decoder.decode(value);
      const jsonChunk = JSON.parse(chunk) as ChatResponse;

      emit("on-receive-response", jsonChunk);

      logger.info(jsonChunk);
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
      class="w-full bg-transparent border-2 border-black dark:border-white rounded-md p-3"
    />
  </form>
</template>

<style scoped></style>
