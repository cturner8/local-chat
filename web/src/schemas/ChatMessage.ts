export interface ChatMessage {
  id: string;
  chatId: string;
  role: string;
  content: string;
  createdDate: number;
  updatedDate: number;
}
