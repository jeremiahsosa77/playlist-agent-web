"use client";

import { useState } from "react";

import { generatePlaylist } from "@/lib/api";
import type {
  GeneratedPlaylist,
  PlaylistRequest,
} from "@/types/playlist";

export type PlaylistWorkflowState =
  | "interview"
  | "generating"
  | "result"
  | "error";

type UsePlaylistWorkflowResult = {
  workflowState: PlaylistWorkflowState;
  currentStep: number;
  playlist: GeneratedPlaylist | null;
  playlistRequest: PlaylistRequest | null;
  errorMessage: string;
  startGeneration: (request: PlaylistRequest) => Promise<void>;
  resetWorkflow: () => void;
  retryGeneration: () => Promise<void>;
};

export function usePlaylistWorkflow(): UsePlaylistWorkflowResult {
  const [workflowState, setWorkflowState] =
    useState<PlaylistWorkflowState>("interview");

  const [currentStep, setCurrentStep] =
    useState(1);

  const [playlist, setPlaylist] =
    useState<GeneratedPlaylist | null>(null);

  const [playlistRequest, setPlaylistRequest] =
    useState<PlaylistRequest | null>(null);

  const [errorMessage, setErrorMessage] =
    useState("");

  async function runGeneration(
    request: PlaylistRequest,
  ): Promise<void> {
    setPlaylist(null);
    setCurrentStep(1);
    setErrorMessage("");
    setWorkflowState("generating");

    const stepTimers = [
      window.setTimeout(
        () => setCurrentStep(2),
        900,
      ),
      window.setTimeout(
        () => setCurrentStep(3),
        1800,
      ),
      window.setTimeout(
        () => setCurrentStep(4),
        2800,
      ),
    ];

    try {
      const generatedPlaylist =
        await generatePlaylist(request);

      setPlaylist(generatedPlaylist);
      setWorkflowState("result");
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Something went wrong while generating your playlist.";

      setErrorMessage(message);
      setWorkflowState("error");
    } finally {
      stepTimers.forEach((timer) => {
        window.clearTimeout(timer);
      });
    }
  }

  async function startGeneration(
    request: PlaylistRequest,
  ): Promise<void> {
    setPlaylistRequest(request);
    await runGeneration(request);
  }

  async function retryGeneration(): Promise<void> {
    if (!playlistRequest) {
      resetWorkflow();
      return;
    }

    await runGeneration(playlistRequest);
  }

  function resetWorkflow(): void {
    setPlaylistRequest(null);
    setPlaylist(null);
    setCurrentStep(1);
    setErrorMessage("");
    setWorkflowState("interview");
  }

  return {
    workflowState,
    currentStep,
    playlist,
    playlistRequest,
    errorMessage,
    startGeneration,
    resetWorkflow,
    retryGeneration,
  };
}