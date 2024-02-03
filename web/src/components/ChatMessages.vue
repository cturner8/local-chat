<script setup lang="ts">
import type { ChatResponse } from "ollama";
import type { ChatMessage } from "../schemas";

const {
  responses = [],
  messages = [],
  done,
  promptSubmitted,
} = defineProps<{
  responses: ChatResponse[];
  messages: ChatMessage[];
  done: boolean;
  promptSubmitted: boolean;
}>();
</script>

<template>
  <div
    class="flex flex-col grow gap-4 w-full h-full overflow-y-auto p-2 text-left"
  >
    <p
      v-for="message in messages"
      :key="message.id"
      :class="[
        'dark:text-white rounded-md p-3 text-pretty',
        message.role === 'user' && 'bg-primary',
      ]"
    >
      {{ message.content }}
    </p>
    <p
      v-if="!done && responses.length"
      class="dark:text-white rounded-md p-3 text-pretty"
    >
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
