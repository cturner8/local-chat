<script setup lang="ts">
import { PlusIcon, SunIcon } from "@heroicons/vue/20/solid";
import { useDark, useToggle } from "@vueuse/core";
import { chatStore } from "../stores/chatStore";

const isDark = useDark({
  attribute: "data-theme",
  valueDark: "dark",
  valueLight: "light",
  storageKey: "local-chat-theme",
  initialValue: "dark",
});
const toggleDark = useToggle(isDark);
</script>

<template>
  <span>
    <button
      class="px-2 rounded-md hover:bg-contrastLight dark:hover:bg-contrastDark"
      @click="chatStore.selectedChatId = ''"
    >
      <PlusIcon class="h-5 w-5 prose dark:prose-invert" />
    </button>
    <button
      class="px-2 rounded-md hover:bg-contrastLight dark:hover:bg-contrastDark"
      @click="toggleDark()"
    >
      <SunIcon class="h-5 w-5 prose dark:prose-invert" />
    </button>
  </span>
</template>
