<script setup lang="ts">
import type { ChatResponse } from "ollama";

const { responses = [] } = defineProps<{
  responses: ChatResponse[];
}>();
</script>

<template>
  <div class="grow w-full h-full overflow-y-auto">
    <!-- <p v-for="response in responses" class="dark:text-white"> -->
    <p class="dark:text-white">
      {{ responses.map((response) => response.message.content).join("") }}
    </p>
  </div>
</template>

<style scoped></style>
