"use client";

import { useState } from "react";

export function ShareButton({ title }: { title: string }) {
  const [message, setMessage] = useState("");

  async function share() {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({ title, url });
        return;
      } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError")
          return;
      }
    }
    try {
      await navigator.clipboard.writeText(url);
      setMessage("Link copied.");
    } catch {
      setMessage("Sharing isn’t available in this browser.");
    }
  }

  return (
    <div className="share-control">
      <button type="button" className="text-link" onClick={share}>
        Share this note <span aria-hidden="true">↗</span>
      </button>
      <span className="share-message" aria-live="polite">
        {message}
      </span>
    </div>
  );
}
