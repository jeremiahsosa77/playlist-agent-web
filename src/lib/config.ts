const DEFAULT_API_URL =
  "http://127.0.0.1:8000";

export const API_URL =
  process.env.NEXT_PUBLIC_API_URL
    ?.trim()
    .replace(/\/$/, "") ||
  DEFAULT_API_URL;

export const USE_MOCK_API =
  process.env.NEXT_PUBLIC_USE_MOCK_API
    ?.trim()
    .toLowerCase() !== "false";