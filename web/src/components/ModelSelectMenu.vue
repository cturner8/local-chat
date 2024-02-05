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
import { onMounted, ref, watch } from "vue";
import { logger } from "../libs/logger";
import { ollama } from "../libs/ollama";
import { chatStore } from "../stores/chatStore";

const models = ref<ModelResponse[]>([]);
const selectedModel = ref<ModelResponse | null>(null);

onMounted(() => {
  ollama
    .list()
    .then((response) => {
      logger.debug(response);
      const { models: responseModels = [] } = response;
      const [firstModel] = responseModels;

      models.value = responseModels;
      if (firstModel) selectedModel.value = firstModel;
    })
    .catch((error) => logger.error(error));
});

watch(selectedModel, (selected) => {
  if (!selected) return;
  chatStore.model = selected.name;
});
</script>

<template>
  <Listbox as="div" v-model="selectedModel" class="my-4">
    <ListboxLabel class="block text-sm font-medium leading-6 dark:text-white">
      Active Model
    </ListboxLabel>
    <div class="relative mt-2">
      <ListboxButton
        class="relative w-full cursor-default rounded-md bg-white dark:bg-contrast py-1.5 pl-3 pr-10 text-left text-gray-900 dark:text-white shadow-sm ring-1 ring-inset ring-gray-300 focus:outline-none focus:ring-2 focus:ring-primary sm:text-sm sm:leading-6"
      >
        <span class="flex items-center">
          <span class="ml-3 block truncate">{{ selectedModel?.name }}</span>
        </span>
        <span
          class="pointer-events-none absolute inset-y-0 right-0 ml-3 flex items-center pr-2"
        >
          <ChevronUpDownIcon
            class="h-5 w-5 text-gray-400 dark:text-white"
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
                active
                  ? 'bg-primary text-white'
                  : 'text-gray-900 dark:text-white',
                'relative cursor-default select-none py-2 pl-3 pr-9',
              ]"
            >
              <div class="flex items-center">
                <span
                  :class="[
                    selected ? 'font-semibold' : 'font-normal',
                    'ml-3 block truncate',
                  ]"
                  >{{ model.name }}</span
                >
              </div>

              <span
                v-if="selected"
                :class="[
                  active ? 'text-white' : 'text-primary',
                  'absolute inset-y-0 right-0 flex items-center pr-4',
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
