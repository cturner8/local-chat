<script setup lang="ts">
import type { ChatResponse, Message } from "ollama";

const {
  responses = [],
  messages = [],
  done,
} = defineProps<{
  responses: ChatResponse[];
  messages: Message[];
  done: boolean;
}>();
</script>

<template>
  <div class="flex flex-col grow gap-4 w-full h-full overflow-y-auto p-2">
    <p v-for="message in messages" class="dark:text-white">
      {{ message.content }}
    </p>
    <p v-if="!done" class="dark:text-white">
      {{ responses.map((response) => response.message.content).join("") }}
    </p>
    <p v-if="!done">Thinking...</p>
  </div>
</template>

<style scoped></style>
