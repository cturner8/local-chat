<script setup lang="ts">
import { computed, ref } from "vue";
import { OLLAMA_URL } from "../config";
import type { Completion } from "../types";

const prompt = ref("");
const messages = ref<Completion[]>([]);

const messageText = computed(() =>
  messages.value.map((message) => message.response).join(""),
);

const onSubmit = async () => {
  messages.value = [];

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
      console.info("done");
      return;
    }

    const chunk = decoder.decode(value);
    const jsonChunk = JSON.parse(chunk) as Completion;
    messages.value.push(jsonChunk);

    console.info(jsonChunk);
  } while (!done);
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
          class="bg-transparent border-2 border-white rounded-md p-1"
        />
      </form>
    </div>
    <div>
      <textarea class="bg-transparent text-white" :value="messageText" />
    </div>
  </div>
</template>

<style scoped></style>
