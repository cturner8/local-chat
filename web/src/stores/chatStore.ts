import { reactive, watch } from "vue";
import { ChatHistory, ChatMessage } from "../schemas";

interface ChatStore {
  chats: ChatHistory[];
  messages: ChatMessage[];
  selectedChatId: string;
  selectChat: (id: string) => void;
  params: URLSearchParams;
}

export const chatStore = reactive<ChatStore>({
  chats: [],
  messages: [],
  selectedChatId: "",
  params: new URLSearchParams(location.search),
  selectChat(id: string) {
    this.params.set("id", id);
    this.selectedChatId = id;
    history.pushState({}, `Chat ID: ${id}`, `?${this.params.toString()}`);
  },
});

watch(chatStore, ({ params }) => {
  const id = params.get("id");
  if (id) chatStore.selectedChatId = id;
});
