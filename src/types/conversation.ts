export type ConversationRole = "agent" | "user";

export type ConversationMessage = {
  id: string;
  role: ConversationRole;
  content: string;
};

export type ConversationOption = {
  id: string;
  label: string;
  value: string;
};

export type ConversationQuestion = {
  id: string;
  prompt: string;
  options?: ConversationOption[];
  placeholder?: string;
};

export type PlaylistConversation = {
  messages: ConversationMessage[];
  questions: ConversationQuestion[];
  currentQuestionIndex: number;
};

export type ConversationSummary = {
  situation: string;
  mood: string;
  musicDirection: string;
  avoid: string[];
  playlistLength: number;
};