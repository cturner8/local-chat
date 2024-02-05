import { reactive, watch } from "vue";
import { ChatHistory, ChatMessage } from "../schemas";

interface ChatStore {
  model: string;
  chats: ChatHistory[];
  messages: ChatMessage[];
  chatMessages: ChatMessage[];
  selectedChatId: string;
  fetchedChatMessageIds: string[];
  params: URLSearchParams;
}

export const chatStore = reactive<ChatStore>({
  model: "llama2", // TODO: default to empty string
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
