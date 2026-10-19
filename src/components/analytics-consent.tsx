"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

const CONSENT_KEY = "tam-analytics-consent-v1";

declare global {
  interface Window {
    dataLayer?: unknown[][];
    gtag?: (...args: unknown[]) => void;
  }
}

function updateConsentState(granted: boolean) {
  if (typeof window === "undefined") return;
  window.dataLayer = window.dataLayer ?? [];
  if (typeof window.gtag !== "function") {
    window.gtag = (...args: unknown[]) => window.dataLayer?.push(args);
  }
  window.gtag("consent", "update", {
    analytics_storage: granted ? "granted" : "denied",
    ad_storage: "denied",
    ad_user_data: "denied",
    ad_personalization: "denied",
  });
}

function trackPageView(pagePath: string) {
  if (typeof window === "undefined") return;
  window.dataLayer = window.dataLayer ?? [];
  if (typeof window.gtag !== "function") {
    window.gtag = (...args: unknown[]) => window.dataLayer?.push(args);
  }
  window.gtag("event", "page_view", {
    page_path: pagePath,
    page_location: window.location.href,
    page_title: document.title,
  });
}

export function AnalyticsConsent() {
  const pathname = usePathname();
  const [choice, setChoice] = useState<"accepted" | "declined" | null>(null);
  const [resolved, setResolved] = useState(false);
  const [open, setOpen] = useState(false);
  const lastTrackedPath = useRef("");

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(CONSENT_KEY);
      if (saved === "accepted" || saved === "declined") {
        setChoice(saved);
        if (saved === "accepted") {
          updateConsentState(true);
        }
      } else {
        setOpen(true);
      }
    } catch {
      setOpen(true);
    }
    setResolved(true);
  }, []);

  // Track page views on route changes when consent is accepted
  useEffect(() => {
    if (!resolved || choice !== "accepted") return;
    const pagePath = pathname ?? "/";
    if (pagePath === lastTrackedPath.current) return;
    lastTrackedPath.current = pagePath;
    trackPageView(pagePath);
  }, [choice, pathname, resolved]);

  function saveChoice(nextChoice: "accepted" | "declined") {
    try {
      window.localStorage.setItem(CONSENT_KEY, nextChoice);
    } catch {
      // Keep the choice for this page even when storage is unavailable.
    }
    setChoice(nextChoice);
    setOpen(false);
    const isGranted = nextChoice === "accepted";
    updateConsentState(isGranted);

    if (isGranted) {
      const pagePath = pathname ?? "/";
      lastTrackedPath.current = pagePath;
      trackPageView(pagePath);
    }
  }

  return (
    <>
      {resolved && open ? (
        <section
          className="analytics-consent"
          aria-labelledby="analytics-title"
        >
          <div className="analytics-consent-copy">
            <p className="eyebrow" id="analytics-title">
              YOUR PRIVACY, YOUR CALL
            </p>
            <p>
              Optional Google Analytics helps us understand visits and improve
              the journal. It stays off unless you allow it.
            </p>
            <Link href="/privacy">Read our privacy notice</Link>
          </div>
          <div className="analytics-consent-actions">
            <button type="button" onClick={() => saveChoice("declined")}>
              Reject analytics
            </button>
            <button
              type="button"
              className="button"
              onClick={() => saveChoice("accepted")}
            >
              Allow analytics
            </button>
          </div>
        </section>
      ) : resolved && choice !== "accepted" ? (
        <button
          type="button"
          className="consent-settings"
          onClick={() => setOpen(true)}
          aria-label="Open privacy settings"
        >
          Privacy settings
        </button>
      ) : null}
    </>
  );
}
