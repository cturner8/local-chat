import { reactive, watch } from "vue";
import { ChatHistory, ChatMessage } from "../schemas";

interface ChatStore {
  chats: ChatHistory[];
  messages: ChatMessage[];
  chatMessages: ChatMessage[];
  selectedChatId: string;
  fetchedChatMessageIds: string[];
}

const params = new URLSearchParams(location.search);

export const chatStore = reactive<ChatStore>({
  chats: [],
  messages: [],
  selectedChatId: "",
  get chatMessages(): ChatMessage[] {
    return this.messages.filter(
      (message) => message.chatId === this.selectedChatId,
    );
  },
  fetchedChatMessageIds: [],
});

watch(
  () => chatStore.selectedChatId,
  (selectedChatId) => {
    if (selectedChatId) {
      params.set("id", selectedChatId);
    } else {
      params.delete("id");
    }
    history.pushState(
      {},
      `Chat ID: ${selectedChatId}`,
      `?${params.toString()}`,
    );
  },
);
