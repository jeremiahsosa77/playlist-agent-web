"use client";

import { FormEvent, useState } from "react";

export default function AccessPage() {
  const [accessCode, setAccessCode] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] =
    useState(false);

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    setError("");
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/access", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          accessCode,
        }),
      });

      if (!response.ok) {
        setError("That access code is not valid.");
        return;
      }

      window.location.href = "/";
    } catch {
      setError(
        "The private alpha could not be unlocked.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center px-6">
      <section className="w-full max-w-md rounded-3xl border border-white/10 bg-black/30 p-8 shadow-2xl backdrop-blur-xl">
        <div className="mb-8 text-center">
          <p className="mb-3 text-sm font-medium uppercase tracking-[0.3em] text-white/50">
            Private Alpha
          </p>

          <h1 className="text-4xl font-semibold text-white">
            Playlist Agent
          </h1>

          <p className="mt-4 text-sm leading-6 text-white/60">
            Enter your invitation code to try the
            private demo.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-4"
        >
          <input
            type="password"
            value={accessCode}
            onChange={(event) => {
              setAccessCode(event.target.value);
            }}
            placeholder="Access code"
            autoComplete="current-password"
            required
            className="w-full rounded-2xl border border-white/10 bg-white/5 px-5 py-4 text-white outline-none placeholder:text-white/30 focus:border-white/30"
          />

          {error ? (
            <p className="text-sm text-red-300">
              {error}
            </p>
          ) : null}

          <button
            type="submit"
            disabled={
              isSubmitting || !accessCode.trim()
            }
            className="w-full rounded-2xl bg-white px-5 py-4 font-medium text-black transition hover:bg-white/90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isSubmitting
              ? "Unlocking..."
              : "Enter Private Alpha"}
          </button>
        </form>
      </section>
    </main>
  );
}