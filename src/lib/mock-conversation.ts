import type {
  ConversationQuestion,
  ConversationSummary,
} from "@/types/conversation";

export const mockFollowUpQuestions: ConversationQuestion[] = [
  {
    id: "energy",
    prompt:
      "What energy level should the playlist have?",
    options: [
      {
        id: "relaxed",
        label: "Relaxed",
        value: "relaxed",
      },
      {
        id: "balanced",
        label: "Balanced",
        value: "balanced",
      },
      {
        id: "energetic",
        label: "Energetic",
        value: "energetic",
      },
    ],
  },
  {
    id: "familiarity",
    prompt:
      "Should I lean toward songs you probably know or introduce more discoveries?",
    options: [
      {
        id: "familiar",
        label: "Mostly familiar",
        value: "mostly familiar",
      },
      {
        id: "mixed",
        label: "A good mix",
        value: "a mix of familiar songs and discoveries",
      },
      {
        id: "discoveries",
        label: "More discoveries",
        value: "mostly new discoveries",
      },
    ],
  },
  {
    id: "avoid",
    prompt:
      "Anything you definitely do not want in this playlist?",
    placeholder:
      "For example: no country, nothing too slow, avoid older songs...",
  },
];

export const mockConversationSummary: ConversationSummary = {
  situation: "A late-night drive after a long day",
  mood: "Upbeat, atmospheric, and relaxing",
  musicDirection:
    "Modern melodic rap and alternative R&B with a balance of familiar tracks and new discoveries",
  avoid: [
    "Songs that feel too slow",
    "Overly repetitive tracks",
  ],
  playlistLength: 20,
};