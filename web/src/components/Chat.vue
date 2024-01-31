<script setup lang="ts">
import { computed, ref } from "vue";
import type { Completion } from "../types";
// import { ollama } from "../libs/ollama";
import { OLLAMA_URL } from "../config";
import { logger } from "../libs/logger";

const prompt = ref("");
const messages = ref<Completion[]>([]);

const messageText = computed(() =>
  messages.value.map((message) => message.response).join(""),
);

const onSubmit = async () => {
  try {
    messages.value = [];

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

    const response = await fetch(`${OLLAMA_URL}/api/generate`, {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "llama2",
        prompt: prompt.value,
        //   stream: false,
      }),
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
      const jsonChunk = JSON.parse(chunk) as Completion;
      messages.value.push(jsonChunk);

      logger.info(jsonChunk);
    } while (!done);
  } catch (e) {
    logger.error(e);
  }
};
</script>

<template>
  <div class="h-full w-full flex justify-center">
    <div>
      <span>Start chatting...</span>
    </div>
    <div>
      <form @submit.prevent="onSubmit">
        <input
          v-model="prompt"
          class="bg-transparent border-2 border-black dark:border-white rounded-md p-1"
        />
      </form>
    </div>
    <div>
      <textarea
        class="bg-transparent dark:text-white"
        :value="messageText"
        readonly
      />
    </div>
  </div>
</template>

<style scoped></style>
