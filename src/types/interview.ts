export type InterviewRole =
  | "user"
  | "assistant"
  | "system";

export type InterviewStatus =
  | "active"
  | "ready_to_generate"
  | "completed"
  | "cancelled";

export type InterviewActionType =
  | "ask_question"
  | "clarify"
  | "ready_to_generate";

export type InterviewMessage = {
  id: string;
  role: InterviewRole;
  content: string;
  createdAt: string;
};

export type InterviewSession = {
  id: string;
  status: InterviewStatus;
  messages: InterviewMessage[];
  questionCount: number;
  clarificationCount: number;
  userMessageCount: number;
  assistantMessageCount: number;
  totalTurnCount: number;
  createdAt: string;
  updatedAt: string;
};

export type InterviewAction = {
  action: InterviewActionType;
  question: string | null;
  reasoningSummary: string | null;
};

export type CreateInterviewResponse = {
  session: InterviewSession;
};

export type SubmitInterviewMessageResponse = {
  session: InterviewSession;
  action: InterviewAction;
};

export type CancelInterviewResponse = {
  session: InterviewSession;
};