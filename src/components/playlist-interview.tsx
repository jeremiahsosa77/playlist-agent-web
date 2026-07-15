"use client";

import {
  type FormEvent,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import ChatMessage from "@/components/chat-message";
import {
  cancelInterview,
  createInterview,
  InterviewApiError,
  submitInterviewMessage,
} from "@/lib/interview-api";
import type {
  ConversationMessage,
} from "@/types/conversation";
import type {
  InterviewMessage,
  InterviewSession,
} from "@/types/interview";
import type {
  PlaylistRequest,
} from "@/types/playlist";

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
  const messagesEndRef =
    useRef<HTMLDivElement | null>(null);

  const [session, setSession] =
    useState<InterviewSession | null>(null);

  const [initialRequest, setInitialRequest] =
    useState("");

  const [answer, setAnswer] =
    useState("");

  const [isStarting, setIsStarting] =
    useState(false);

  const [isSubmitting, setIsSubmitting] =
    useState(false);

  const [isResetting, setIsResetting] =
    useState(false);

  const [error, setError] =
    useState("");

  const displayedMessages =
    useMemo<ConversationMessage[]>(() => {
      if (!session) {
        return initialMessages;
      }

      return session.messages
        .filter(
          (message) =>
            message.role !== "system",
        )
        .map(convertInterviewMessage);
    }, [session]);

  const isReady =
    session?.status ===
    "ready_to_generate";

  const isBusy =
    isStarting ||
    isSubmitting ||
    isResetting;

  const transcript =
    useMemo(() => {
      if (!session || !isReady) {
        return "";
      }

      return createGenerationPrompt(
        session.messages,
      );
    }, [session, isReady]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
    });
  }, [
    displayedMessages,
    isStarting,
    isSubmitting,
  ]);

  async function beginInterview(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    if (isBusy) {
      return;
    }

    const trimmedRequest =
      initialRequest.trim();

    if (trimmedRequest.length < 10) {
      setError(
        "Describe the moment in at least 10 characters.",
      );
      return;
    }

    setError("");
    setIsStarting(true);

    try {
      const created =
        await createInterview();

      const response =
        await submitInterviewMessage(
          created.session.id,
          trimmedRequest,
        );

      setSession(response.session);
      setInitialRequest("");
    } catch (caughtError) {
      setError(
        getErrorMessage(caughtError),
      );
    } finally {
      setIsStarting(false);
    }
  }

  async function handleAnswer(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    if (
      !session ||
      isBusy ||
      isReady
    ) {
      return;
    }

    const trimmedAnswer =
      answer.trim();

    if (!trimmedAnswer) {
      setError(
        "Add an answer before continuing.",
      );
      return;
    }

    setError("");
    setIsSubmitting(true);

    try {
      const response =
        await submitInterviewMessage(
          session.id,
          trimmedAnswer,
        );

      setSession(response.session);
      setAnswer("");
    } catch (caughtError) {
      setError(
        getErrorMessage(caughtError),
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleReset() {
    if (isBusy) {
      return;
    }

    const sessionId = session?.id;

    setIsResetting(true);
    setError("");

    try {
      if (sessionId) {
        await cancelInterview(sessionId);
      }
    } catch {
      // Reset the local interface even if the temporary
      // backend session can no longer be found.
    } finally {
      setSession(null);
      setInitialRequest("");
      setAnswer("");
      setError("");
      setIsResetting(false);
    }
  }

  function handleGenerate() {
    if (
      !session ||
      !isReady ||
      !transcript
    ) {
      return;
    }

    onComplete({
      prompt: transcript,
      artists: [],
      genres: [],
      playlistLength: 20,
      isPublic: false,
    });
  }

  return (
    <section className="w-full rounded-3xl border border-white/10 bg-white/5 p-5 shadow-2xl shadow-black/30 backdrop-blur-xl sm:p-8">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-white/40">
            AI music interview
          </p>

          <h2 className="mt-2 text-2xl font-semibold text-white">
            Let&apos;s understand the moment
          </h2>

          <p className="mt-2 max-w-xl text-sm leading-6 text-white/45">
            Playlist Agent will ask
            adaptive questions based on
            what matters for your
            playlist.
          </p>
        </div>

        {session ? (
          <button
            type="button"
            onClick={handleReset}
            disabled={isBusy}
            className="rounded-full border border-white/10 bg-black/20 px-3 py-2 text-xs font-medium text-white/55 transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-40"
          >
            {isResetting
              ? "Resetting..."
              : "Start over"}
          </button>
        ) : null}
      </div>

      <div
        className="mt-8 max-h-[430px] space-y-4 overflow-y-auto pr-1"
        aria-live="polite"
      >
        {displayedMessages.map(
          (message) => (
            <ChatMessage
              key={message.id}
              message={message}
            />
          ),
        )}

        {isStarting ? (
          <StatusMessage>
            Connecting to the playlist
            service and starting your
            interview...
          </StatusMessage>
        ) : null}

        {isSubmitting ? (
          <StatusMessage>
            Playlist Agent is thinking
            about the best question to
            ask next...
          </StatusMessage>
        ) : null}

        <div ref={messagesEndRef} />
      </div>

      {!session ? (
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
            disabled={isBusy}
            rows={5}
            placeholder="I’m going on a date tonight and want something romantic, modern, and interesting without feeling too slow..."
            className="w-full resize-none rounded-2xl border border-white/10 bg-black/20 px-4 py-4 text-white outline-none transition placeholder:text-white/30 focus:border-white/30 focus:bg-black/30 disabled:cursor-not-allowed disabled:opacity-60"
          />

          {error ? (
            <ErrorMessage message={error} />
          ) : null}

          <button
            type="submit"
            disabled={isBusy}
            className="mt-4 w-full rounded-2xl bg-white px-5 py-4 text-sm font-semibold text-black transition hover:bg-white/90 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isStarting
              ? "Starting interview..."
              : "Start interview"}
          </button>
        </form>
      ) : null}

      {session && !isReady ? (
        <form
          onSubmit={handleAnswer}
          className="mt-6"
        >
          <textarea
            value={answer}
            onChange={(event) =>
              setAnswer(
                event.target.value,
              )
            }
            disabled={isBusy}
            rows={3}
            placeholder="Type your answer..."
            className="w-full resize-none rounded-2xl border border-white/10 bg-black/20 px-4 py-4 text-white outline-none transition placeholder:text-white/30 focus:border-white/30 focus:bg-black/30 disabled:cursor-not-allowed disabled:opacity-60"
          />

          {error ? (
            <ErrorMessage message={error} />
          ) : null}

          <button
            type="submit"
            disabled={isBusy}
            className="mt-4 w-full rounded-2xl bg-white px-5 py-4 text-sm font-semibold text-black transition hover:bg-white/90 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting
              ? "Thinking..."
              : "Continue"}
          </button>
        </form>
      ) : null}

      {session &&
      isReady &&
      transcript ? (
        <div className="mt-6 rounded-3xl border border-white/10 bg-black/20 p-5">
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-white/35">
            Playlist brief ready
          </p>

          <p className="mt-3 text-sm leading-6 text-white/70">
            Playlist Agent has enough
            information to curate your
            playlist.
          </p>

          <div className="mt-4 flex flex-wrap gap-2">
            <SummaryTag
              label={`${session.userMessageCount} answers`}
            />

            <SummaryTag
              label={`${session.questionCount} questions`}
            />

            <SummaryTag
              label="20 songs"
            />

            <SummaryTag
              label="Private playlist"
            />
          </div>

          {error ? (
            <ErrorMessage message={error} />
          ) : null}

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

function convertInterviewMessage(
  message: InterviewMessage,
): ConversationMessage {
  return {
    id: message.id,
    role:
      message.role === "assistant"
        ? "agent"
        : "user",
    content: message.content,
  };
}

function createGenerationPrompt(
  messages: InterviewMessage[],
): string {
  const transcript = messages
    .filter(
      (message) =>
        message.role !== "system",
    )
    .map((message) => {
      const speaker =
        message.role === "assistant"
          ? "Music curator"
          : "User";

      return `${speaker}: ${message.content}`;
    })
    .join("\n");

  return [
    "Create a Spotify playlist based on this completed music interview.",
    "",
    transcript,
    "",
    "Use the entire interview to understand the desired setting, mood, energy, familiarity, musical direction, and anything the user wants avoided.",
  ].join("\n");
}

function getErrorMessage(
  error: unknown,
): string {
  if (error instanceof InterviewApiError) {
    return error.message;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "Something went wrong while running the playlist interview.";
}

type StatusMessageProps = {
  children: React.ReactNode;
};

function StatusMessage({
  children,
}: StatusMessageProps) {
  return (
    <div className="flex justify-start">
      <div className="max-w-[85%] rounded-2xl rounded-bl-md border border-white/10 bg-white/5 px-4 py-3 text-sm leading-6 text-white/45">
        {children}
      </div>
    </div>
  );
}

type ErrorMessageProps = {
  message: string;
};

function ErrorMessage({
  message,
}: ErrorMessageProps) {
  return (
    <p
      role="alert"
      className="mt-3 text-sm text-red-200"
    >
      {message}
    </p>
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