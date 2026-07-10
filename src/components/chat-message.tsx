import type {
  ConversationMessage,
} from "@/types/conversation";

type ChatMessageProps = {
  message: ConversationMessage;
};

export default function ChatMessage({
  message,
}: ChatMessageProps) {
  const isAgent = message.role === "agent";

  return (
    <div
      className={`flex ${
        isAgent
          ? "justify-start"
          : "justify-end"
      }`}
    >
      <div
        className={`max-w-[88%] rounded-3xl px-4 py-3 text-sm leading-6 sm:max-w-[78%] ${
          isAgent
            ? "rounded-bl-lg border border-white/10 bg-white/5 text-white/75"
            : "rounded-br-lg bg-white text-black"
        }`}
      >
        {message.content}
      </div>
    </div>
  );
}