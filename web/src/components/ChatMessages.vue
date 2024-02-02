<script setup lang="ts">
import type { ChatResponse, Message } from "ollama";

const {
  responses = [],
  messages = [],
  done,
  promptSubmitted,
} = defineProps<{
  responses: ChatResponse[];
  messages: Message[];
  done: boolean;
  promptSubmitted: boolean;
}>();
</script>

<template>
  <div class="flex flex-col grow gap-4 w-full h-full overflow-y-auto p-2">
    <p
      v-for="(message, index) in messages"
      :key="index"
      :class="[
        'dark:text-white rounded-md p-3',
        message.role === 'user' && 'bg-secondary',
      ]"
    >
      {{ message.content }}
    </p>
    <p v-if="!done && responses.length" class="dark:text-white rounded-md p-3">
      {{ responses.map((response) => response.message.content).join("") }}
    </p>
    <template v-if="!done">
      <p
        v-if="promptSubmitted && !responses.length"
        class="dark:text-white rounded-md p-3"
      >
        Thinking...
      </p>
      <p v-else-if="responses.length" class="dark:text-white rounded-md p-3">
        Typing...
      </p>
    </template>
  </div>
</template>
