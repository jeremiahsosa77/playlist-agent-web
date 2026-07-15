export type ConversationRole =
  | "agent"
  | "user";

export type ConversationMessage = {
  id: string;
  role: ConversationRole;
  content: string;
};