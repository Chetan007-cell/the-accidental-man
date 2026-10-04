"use client";

import { type FormEvent, useState } from "react";

export function NewsletterForm() {
  const [state, setState] = useState<"idle" | "loading" | "success" | "error">(
    "idle",
  );
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setState("loading");
    const form = event.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());
    try {
      const response = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      setState(response.ok ? "success" : "error");
      if (response.ok) form.reset();
    } catch {
      setState("error");
    }
  }
  return (
    <form className="newsletter-form" onSubmit={submit}>
      <label htmlFor="newsletter-email">Your email address</label>
      <div className="email-row">
        <input
          id="newsletter-email"
          name="email"
          type="email"
          autoComplete="email"
          maxLength={254}
          placeholder="you@example.com"
          required
        />
        <button type="submit" className="button" disabled={state === "loading"}>
          {state === "loading" ? "Joining…" : "Join the list"}
        </button>
      </div>
      <label className="consent">
        <input type="checkbox" name="consent" value="yes" required />
        <span>
          I agree to receive occasional emails and can unsubscribe at any time.
        </span>
      </label>
      <input
        className="honeypot"
        type="text"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
      />
      <p className="form-message" aria-live="polite">
        {state === "success"
          ? "Thanks. Check your inbox to confirm your subscription."
          : state === "error"
            ? "We couldn’t save that just now. Please try again."
            : "We respect your inbox. Unsubscribe whenever you like."}
      </p>
    </form>
  );
}
