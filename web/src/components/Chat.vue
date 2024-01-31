<script setup lang="ts">
import { ref } from "vue";
// import { ollama } from "../libs/ollama";
import type { ChatResponse } from "ollama";

import ChatMessages from "./ChatMessages.vue";
import ChatPrompt from "./ChatPrompt.vue";

const responses = ref<ChatResponse[]>([]);

const onReceiveResponse = (response: ChatResponse) => {
  responses.value.push(response);
};
</script>

<template>
  <div class="h-full w-full flex flex-col justify-center items-center">
    <div class="flex flex-col h-full w-full md:max-w-3xl justify-end">
      <ChatMessages :responses="responses" />
      <ChatPrompt @on-receive-response="onReceiveResponse" />
    </div>
  </div>
</template>

<style scoped></style>
