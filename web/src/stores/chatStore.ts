import { reactive, watch } from "vue";
import { ChatHistory, ChatMessage } from "../schemas";

interface ChatStore {
  chats: ChatHistory[];
  messages: ChatMessage[];
  chatMessages: ChatMessage[];
  selectedChatId: string;
  fetchedChatMessageIds: string[];
  selectChat: (id: string) => void;
  deselectChat: () => void;
  params: URLSearchParams;
}

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
  params: new URLSearchParams(location.search),
  selectChat(id: string) {
    this.params.set("id", id);
    this.selectedChatId = id;
    history.pushState({}, `Chat ID: ${id}`, `?${this.params.toString()}`);
  },
  deselectChat() {
    this.params.delete("id");
    this.selectedChatId = "";
    history.pushState({}, `Chat`, `?`);
  },
});

watch(chatStore, ({ params }) => {
  const id = params.get("id");
  if (id) chatStore.selectedChatId = id;
});
