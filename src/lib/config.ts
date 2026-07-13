export const API_URL =
  process.env.NEXT_PUBLIC_API_URL
    ?.trim()
    .replace(/\/$/, "") ||
  "/api/backend";

export const USE_MOCK_API =
  process.env.NEXT_PUBLIC_USE_MOCK_API
    ?.trim()
    .toLowerCase() !== "false";