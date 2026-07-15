import { API_URL } from "@/lib/config";
import type {
  CancelInterviewResponse,
  CreateInterviewResponse,
  SubmitInterviewMessageResponse,
} from "@/types/interview";

type BackendErrorResponse = {
  error?: {
    code?: string;
    message?: string;
    details?: unknown;
  };
  detail?: string;
  message?: string;
};

export class InterviewApiError extends Error {
  readonly status: number;
  readonly code: string;
  readonly details?: unknown;

  constructor({
    message,
    status,
    code = "INTERVIEW_API_ERROR",
    details,
  }: {
    message: string;
    status: number;
    code?: string;
    details?: unknown;
  }) {
    super(message);

    this.name = "InterviewApiError";
    this.status = status;
    this.code = code;
    this.details = details;
  }
}

export async function createInterview(): Promise<CreateInterviewResponse> {
  return requestJson<CreateInterviewResponse>(
    `${API_URL}/api/interviews`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({}),
    },
  );
}

export async function submitInterviewMessage(
  sessionId: string,
  content: string,
): Promise<SubmitInterviewMessageResponse> {
  return requestJson<SubmitInterviewMessageResponse>(
    `${API_URL}/api/interviews/${encodeURIComponent(sessionId)}/messages`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        content,
      }),
    },
  );
}

export async function cancelInterview(
  sessionId: string,
): Promise<CancelInterviewResponse> {
  return requestJson<CancelInterviewResponse>(
    `${API_URL}/api/interviews/${encodeURIComponent(sessionId)}/cancel`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({}),
    },
  );
}

async function requestJson<T>(
  url: string,
  options: RequestInit,
): Promise<T> {
  let response: Response;

  try {
    response = await fetch(url, {
      ...options,
      cache: "no-store",
    });
  } catch {
    throw new InterviewApiError({
      status: 0,
      code: "INTERVIEW_API_UNREACHABLE",
      message:
        "The playlist service could not be reached. It may still be waking up.",
    });
  }

  if (!response.ok) {
    throw await createInterviewApiError(response);
  }

  try {
    return (await response.json()) as T;
  } catch {
    throw new InterviewApiError({
      status: response.status,
      code: "INVALID_INTERVIEW_RESPONSE",
      message:
        "The playlist service returned an invalid interview response.",
    });
  }
}

async function createInterviewApiError(
  response: Response,
): Promise<InterviewApiError> {
  const fallbackMessage =
    `The interview request failed with status ${response.status}.`;

  try {
    const data =
      (await response.json()) as BackendErrorResponse;

    return new InterviewApiError({
      status: response.status,
      code:
        data.error?.code ??
        "INTERVIEW_REQUEST_FAILED",
      message:
        data.error?.message ??
        data.detail ??
        data.message ??
        fallbackMessage,
      details: data.error?.details,
    });
  } catch {
    return new InterviewApiError({
      status: response.status,
      code: "INTERVIEW_REQUEST_FAILED",
      message: fallbackMessage,
    });
  }
}