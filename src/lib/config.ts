export const API_URL =
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") ??
  "http://127.0.0.1:8000";

export const USE_MOCK_API =
  process.env.NEXT_PUBLIC_USE_MOCK_API !== "false";