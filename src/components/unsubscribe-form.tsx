"use client";

import { useState } from "react";

export function UnsubscribeForm({ token }: { token: string }) {
  const [state, setState] = useState<"idle" | "loading" | "success" | "error">(
    "idle",
  );

  async function unsubscribe() {
    setState("loading");
    try {
      const response = await fetch("/api/newsletter/unsubscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      });
      setState(response.ok ? "success" : "error");
    } catch {
      setState("error");
    }
  }

  return (
    <div className="unsubscribe-action">
      <button
        type="button"
        className="button"
        onClick={unsubscribe}
        disabled={state === "loading" || state === "success"}
      >
        {state === "loading"
          ? "Updating…"
          : state === "success"
            ? "Unsubscribed"
            : "Unsubscribe"}
      </button>
      <p aria-live="polite">
        {state === "success"
          ? "You have been removed from the newsletter."
          : state === "error"
            ? "We couldn’t update your preferences. Please try again."
            : "You can rejoin the newsletter at any time."}
      </p>
    </div>
  );
}
