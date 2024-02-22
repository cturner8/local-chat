export interface Chat {
  id: string;
  title: string;
  createdDate: number;
  updatedDate: number;
}

export interface ChatHistory extends Pick<Chat, "id" | "title"> {}
