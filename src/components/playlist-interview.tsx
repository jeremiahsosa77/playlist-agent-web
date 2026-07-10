"use client";

import {
  type FormEvent,
  useMemo,
  useRef,
  useState,
} from "react";

import ChatMessage from "@/components/chat-message";
import { mockFollowUpQuestions } from "@/lib/mock-conversation";
import type {
  ConversationMessage,
  ConversationQuestion,
} from "@/types/conversation";
import type { PlaylistRequest } from "@/types/playlist";

type PlaylistInterviewProps = {
  onComplete: (request: PlaylistRequest) => void;
};

const initialMessages: ConversationMessage[] = [
  {
    id: "agent-welcome",
    role: "agent",
    content:
      "Tell me about the moment you want a playlist for. You can describe the setting, mood, people, or anything else that matters.",
  },
];

export default function PlaylistInterview({
  onComplete,
}: PlaylistInterviewProps) {
  const messageIdRef = useRef(0);

  const [messages, setMessages] =
    useState<ConversationMessage[]>(initialMessages);

  const [initialRequest, setInitialRequest] =
    useState("");

  const [answers, setAnswers] =
    useState<Record<string, string>>({});

  const [
    currentQuestionIndex,
    setCurrentQuestionIndex,
  ] = useState(-1);

  const [textAnswer, setTextAnswer] =
    useState("");

  const [error, setError] = useState("");

  const currentQuestion: ConversationQuestion | null =
    currentQuestionIndex >= 0
      ? mockFollowUpQuestions[
          currentQuestionIndex
        ] ?? null
      : null;

  const isComplete =
    currentQuestionIndex >=
    mockFollowUpQuestions.length;

  const summary = useMemo(() => {
    if (!isComplete) {
      return null;
    }

    return {
      prompt: initialRequest,
      artists: [],
      genres: [],
      playlistLength: 20,
      isPublic: false,
    } satisfies PlaylistRequest;
  }, [initialRequest, isComplete]);

  function createMessageId(prefix: string): string {
    messageIdRef.current += 1;

    return `${prefix}-${messageIdRef.current}`;
  }

  function addMessage(
    message: ConversationMessage,
  ) {
    setMessages((current) => [
      ...current,
      message,
    ]);
  }

  function beginInterview(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    const trimmedRequest =
      initialRequest.trim();

    if (trimmedRequest.length < 10) {
      setError(
        "Describe the moment in at least 10 characters.",
      );
      return;
    }

    setError("");

    addMessage({
      id: createMessageId("user-initial"),
      role: "user",
      content: trimmedRequest,
    });

    addMessage({
      id: createMessageId(
        "agent-question-0",
      ),
      role: "agent",
      content:
        mockFollowUpQuestions[0].prompt,
    });

    setCurrentQuestionIndex(0);
  }

  function handleOptionAnswer(
    value: string,
    label: string,
  ) {
    if (!currentQuestion) {
      return;
    }

    setAnswers((current) => ({
      ...current,
      [currentQuestion.id]: value,
    }));

    addMessage({
      id: createMessageId(
        `user-${currentQuestion.id}`,
      ),
      role: "user",
      content: label,
    });

    moveToNextQuestion();
  }

  function handleTextAnswer(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    if (!currentQuestion) {
      return;
    }

    const trimmedAnswer =
      textAnswer.trim();

    if (!trimmedAnswer) {
      setError(
        "Add an answer before continuing.",
      );
      return;
    }

    setError("");

    setAnswers((current) => ({
      ...current,
      [currentQuestion.id]:
        trimmedAnswer,
    }));

    addMessage({
      id: createMessageId(
        `user-${currentQuestion.id}`,
      ),
      role: "user",
      content: trimmedAnswer,
    });

    setTextAnswer("");
    moveToNextQuestion();
  }

  function moveToNextQuestion() {
    const nextIndex =
      currentQuestionIndex + 1;

    if (
      nextIndex <
      mockFollowUpQuestions.length
    ) {
      window.setTimeout(() => {
        addMessage({
          id: createMessageId(
            `agent-question-${nextIndex}`,
          ),
          role: "agent",
          content:
            mockFollowUpQuestions[
              nextIndex
            ].prompt,
        });

        setCurrentQuestionIndex(
          nextIndex,
        );
      }, 350);

      return;
    }

    window.setTimeout(() => {
      addMessage({
        id: createMessageId(
          "agent-summary",
        ),
        role: "agent",
        content:
          "Perfect. I have enough to build the playlist. Review the summary below, then I’ll start curating.",
      });

      setCurrentQuestionIndex(
        mockFollowUpQuestions.length,
      );
    }, 350);
  }

  function handleGenerate() {
    if (!summary) {
      return;
    }

    onComplete({
      ...summary,
      prompt: [
        summary.prompt,
        answers.energy
          ? `Energy preference: ${answers.energy}.`
          : "",
        answers.familiarity
          ? `Song familiarity preference: ${answers.familiarity}.`
          : "",
        answers.avoid
          ? `Avoid: ${answers.avoid}.`
          : "",
      ]
        .filter(Boolean)
        .join(" "),
    });
  }

  function handleReset() {
    messageIdRef.current = 0;
    setMessages(initialMessages);
    setInitialRequest("");
    setAnswers({});
    setCurrentQuestionIndex(-1);
    setTextAnswer("");
    setError("");
  }

  return (
    <section className="w-full rounded-3xl border border-white/10 bg-white/5 p-5 shadow-2xl shadow-black/30 backdrop-blur-xl sm:p-8">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-white/40">
            AI music interview
          </p>

          <h2 className="mt-2 text-2xl font-semibold text-white">
            Let’s understand the moment
          </h2>

          <p className="mt-2 max-w-xl text-sm leading-6 text-white/45">
            Playlist Agent will ask a
            few short questions before
            generating anything.
          </p>
        </div>

        {currentQuestionIndex >= 0 ? (
          <button
            type="button"
            onClick={handleReset}
            className="rounded-full border border-white/10 bg-black/20 px-3 py-2 text-xs font-medium text-white/55 transition hover:bg-white/10"
          >
            Start over
          </button>
        ) : null}
      </div>

      <div className="mt-8 max-h-[430px] space-y-4 overflow-y-auto pr-1">
        {messages.map((message) => (
          <ChatMessage
            key={message.id}
            message={message}
          />
        ))}
      </div>

      {currentQuestionIndex === -1 ? (
        <form
          onSubmit={beginInterview}
          className="mt-6"
        >
          <textarea
            value={initialRequest}
            onChange={(event) =>
              setInitialRequest(
                event.target.value,
              )
            }
            rows={5}
            placeholder="I’m going on a date tonight and want something romantic, modern, and interesting without feeling too slow..."
            className="w-full resize-none rounded-2xl border border-white/10 bg-black/20 px-4 py-4 text-white outline-none transition placeholder:text-white/30 focus:border-white/30 focus:bg-black/30"
          />

          {error ? (
            <p className="mt-3 text-sm text-red-200">
              {error}
            </p>
          ) : null}

          <button
            type="submit"
            className="mt-4 w-full rounded-2xl bg-white px-5 py-4 text-sm font-semibold text-black transition hover:bg-white/90"
          >
            Start interview
          </button>
        </form>
      ) : null}

      {currentQuestion?.options ? (
        <div className="mt-6 grid gap-3 sm:grid-cols-3">
          {currentQuestion.options.map(
            (option) => (
              <button
                key={option.id}
                type="button"
                onClick={() =>
                  handleOptionAnswer(
                    option.value,
                    option.label,
                  )
                }
                className="rounded-2xl border border-white/10 bg-black/20 px-4 py-4 text-sm font-medium text-white transition hover:border-white/25 hover:bg-white/10"
              >
                {option.label}
              </button>
            ),
          )}
        </div>
      ) : null}

      {currentQuestion &&
      !currentQuestion.options ? (
        <form
          onSubmit={handleTextAnswer}
          className="mt-6"
        >
          <input
            type="text"
            value={textAnswer}
            onChange={(event) =>
              setTextAnswer(
                event.target.value,
              )
            }
            placeholder={
              currentQuestion.placeholder
            }
            className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-4 text-white outline-none transition placeholder:text-white/30 focus:border-white/30 focus:bg-black/30"
          />

          {error ? (
            <p className="mt-3 text-sm text-red-200">
              {error}
            </p>
          ) : null}

          <button
            type="submit"
            className="mt-4 w-full rounded-2xl bg-white px-5 py-4 text-sm font-semibold text-black transition hover:bg-white/90"
          >
            Continue
          </button>
        </form>
      ) : null}

      {isComplete && summary ? (
        <div className="mt-6 rounded-3xl border border-white/10 bg-black/20 p-5">
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-white/35">
            Playlist brief
          </p>

          <p className="mt-3 text-sm leading-6 text-white/70">
            {initialRequest}
          </p>

          <div className="mt-4 flex flex-wrap gap-2">
            {answers.energy ? (
              <SummaryTag
                label={`Energy: ${answers.energy}`}
              />
            ) : null}

            {answers.familiarity ? (
              <SummaryTag
                label={
                  answers.familiarity
                }
              />
            ) : null}

            {answers.avoid ? (
              <SummaryTag
                label={`Avoid: ${answers.avoid}`}
              />
            ) : null}

            <SummaryTag label="20 songs" />
          </div>

          <button
            type="button"
            onClick={handleGenerate}
            className="mt-5 w-full rounded-2xl bg-white px-5 py-4 text-sm font-semibold text-black transition hover:bg-white/90"
          >
            Generate this playlist
          </button>
        </div>
      ) : null}
    </section>
  );
}

type SummaryTagProps = {
  label: string;
};

function SummaryTag({
  label,
}: SummaryTagProps) {
  return (
    <span className="rounded-full border border-white/10 bg-white/5 px-3 py-2 text-xs text-white/55">
      {label}
    </span>
  );
}