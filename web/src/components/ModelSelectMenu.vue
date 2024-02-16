<script setup lang="ts">
import {
  Listbox,
  ListboxButton,
  ListboxLabel,
  ListboxOption,
  ListboxOptions,
} from "@headlessui/vue";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/vue/20/solid";
import type { ModelResponse } from "ollama";
import { computed, onBeforeUnmount, ref, watch } from "vue";
import { Preferences } from "../enums";
import { logger } from "../libs/logger";
import { chatStore } from "../stores/chatStore";
import SqliteWorker from "../workers/sqlite?worker";

const sqlite = new SqliteWorker();
sqlite.onmessage = (message) => {
  logger.info(message.data);
};

const preferredModel = computed(
  () =>
    chatStore.preferences.find((p) => p.id === Preferences.PreferredModel)
      ?.value ?? "",
);
const models = computed(() => chatStore.models);
const selectedModel = ref<ModelResponse | null>(null);

watch(preferredModel, () => {
  const model = models.value.find((m) => m.name === preferredModel.value);
  if (model) selectedModel.value = model;
});

watch(selectedModel, (selected) => {
  if (!selected) return;
  chatStore.selectedModel = selected.name;
  sqlite.postMessage([
    `insert into preferences (id, value) values (?, ?) on conflict(id) do update set value = ?`,
    [
      Preferences.PreferredModel,
      chatStore.selectedModel,
      chatStore.selectedModel,
    ],
  ]);
});

onBeforeUnmount(() => {
  sqlite.terminate();
});
</script>

<template>
  <Listbox as="div" v-model="selectedModel" class="my-4">
    <ListboxLabel
      class="block text-sm font-medium leading-6 prose dark:prose-invert"
    >
      Active Model
    </ListboxLabel>
    <div class="relative mt-2">
      <ListboxButton
        class="relative w-full cursor-default rounded-md bg-white dark:bg-contrast py-1.5 pl-3 pr-10 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:outline-none focus:ring-2 focus:ring-primary sm:text-sm sm:leading-6"
      >
        <span class="flex items-center">
          <span class="ml-3 block truncate prose dark:prose-invert">{{
            selectedModel?.name ?? "None"
          }}</span>
        </span>
        <span
          class="pointer-events-none absolute inset-y-0 right-0 ml-3 flex items-center pr-2"
        >
          <ChevronUpDownIcon
            class="h-5 w-5 text-gray-400 prose dark:prose-invert"
            aria-hidden="true"
          />
        </span>
      </ListboxButton>

      <transition
        leave-active-class="transition ease-in duration-100"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
      >
        <ListboxOptions
          class="absolute z-10 mt-1 max-h-56 w-full overflow-auto rounded-md bg-white dark:bg-contrast py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm"
        >
          <ListboxOption
            as="template"
            v-for="model in models"
            :key="model.digest"
            :value="model"
            v-slot="{ active, selected }"
          >
            <li
              :class="[
                active ? 'bg-primary ' : 'text-gray-900 ',
                'relative cursor-default select-none py-2 pl-3 pr-9 prose dark:prose-invert',
              ]"
            >
              <div class="flex items-center">
                <span
                  :class="[
                    selected ? 'font-semibold' : 'font-normal',
                    'ml-3 block truncate prose dark:prose-invert',
                  ]"
                  >{{ model.name }}</span
                >
              </div>

              <span
                v-if="selected"
                :class="[
                  // active ? 'text-white' : 'text-primary',
                  'absolute inset-y-0 right-0 flex items-center pr-4 prose dark:prose-invert',
                ]"
              >
                <CheckIcon class="h-5 w-5" aria-hidden="true" />
              </span>
            </li>
          </ListboxOption>
        </ListboxOptions>
      </transition>
    </div>
  </Listbox>
</template>
