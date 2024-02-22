import type { ModelResponse } from "ollama";
import { reactive, watch } from "vue";
import type { ChatHistory, ChatMessage, Preference } from "../schemas";

interface ChatStore {
  selectedModel: string;
  chats: ChatHistory[];
  messages: ChatMessage[];
  chatMessages: ChatMessage[];
  selectedChatId: string;
  fetchedChatMessageIds: string[];
  params: URLSearchParams;
  models: ModelResponse[];
  preferences: Preference[];
}

export const chatStore = reactive<ChatStore>({
  selectedModel: "",
  chats: [],
  messages: [],
  selectedChatId: "",
  get chatMessages(): ChatMessage[] {
    return this.messages.filter(
      (message) => message.chatId === this.selectedChatId,
    );
  },
  fetchedChatMessageIds: [],
  params: new URLSearchParams(location.search),
  models: [],
  preferences: [],
});

watch(
  () => chatStore.selectedChatId,
  (selectedChatId, oldSelectedChatId) => {
    if (selectedChatId === oldSelectedChatId) return;
    if (selectedChatId) {
      chatStore.params.set("id", selectedChatId);
    } else {
      chatStore.params.delete("id");
    }
    history.pushState(
      {},
      `Chat ID: ${selectedChatId}`,
      `?${chatStore.params.toString()}`,
    );
  },
);

watch(chatStore, ({ params }) => {
  const id = params.get("id");
  if (id) chatStore.selectedChatId = id;
});
