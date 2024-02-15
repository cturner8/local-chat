<script setup lang="ts">
import { PlusIcon, SunIcon } from "@heroicons/vue/20/solid";
import { useDark, usePreferredColorScheme, useToggle } from "@vueuse/core";
import { chatStore } from "../stores/chatStore";

const preferredColorScheme = usePreferredColorScheme();
const isDark = useDark({
  attribute: "data-theme",
  valueDark: "dark",
  valueLight: "light",
  storageKey: "local-chat-theme",
  initialValue:
    preferredColorScheme.value !== "no-preference"
      ? preferredColorScheme.value
      : "auto",
});
const toggleDark = useToggle(isDark);
</script>

<template>
  <span>
    <button
      class="px-2 rounded-md hover:bg-contrast"
      @click="chatStore.selectedChatId = ''"
    >
      <PlusIcon class="h-5 w-5 dark:text-white" />
    </button>
    <button class="px-2 rounded-md hover:bg-contrast" @click="toggleDark()">
      <SunIcon class="h-5 w-5 dark:text-white" />
    </button>
  </span>
</template>
