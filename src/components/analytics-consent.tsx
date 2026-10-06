"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

const CONSENT_KEY = "tam-analytics-consent-v1";
const MEASUREMENT_ID =
  process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID ?? "G-XZ3NLG1Y0T";

declare global {
  interface Window {
    dataLayer?: unknown[][];
    gtag?: (...args: unknown[]) => void;
  }
}

function GoogleAnalytics() {
  const pathname = usePathname();
  const [loaded, setLoaded] = useState(false);
  const lastPage = useRef("");

  useEffect(() => {
    window.dataLayer = window.dataLayer ?? [];
    window.gtag = (...args: unknown[]) => window.dataLayer?.push(args);
    window.gtag("consent", "default", {
      analytics_storage: "denied",
      ad_storage: "denied",
      ad_user_data: "denied",
      ad_personalization: "denied",
    });
    window.gtag("consent", "update", {
      analytics_storage: "granted",
      ad_storage: "denied",
      ad_user_data: "denied",
      ad_personalization: "denied",
    });
    window.gtag("js", new Date());
    window.gtag("config", MEASUREMENT_ID, {
      send_page_view: false,
      allow_google_signals: false,
      allow_ad_personalization_signals: false,
    });

    const script = document.createElement("script");
    script.id = "google-analytics-tag";
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${MEASUREMENT_ID}`;
    script.onload = () => setLoaded(true);
    document.head.append(script);

    return () => {
      window.gtag?.("consent", "update", {
        analytics_storage: "denied",
        ad_storage: "denied",
        ad_user_data: "denied",
        ad_personalization: "denied",
      });
      script.remove();
      window.gtag = undefined;
      setLoaded(false);
    };
  }, []);

  useEffect(() => {
    if (!loaded || !window.gtag) return;
    const pagePath = pathname ?? "/";
    if (pagePath === lastPage.current) return;
    lastPage.current = pagePath;
    window.gtag("event", "page_view", {
      page_path: pagePath,
      page_location: new URL(pagePath, window.location.origin).toString(),
      page_title: document.title,
    });
  }, [loaded, pathname]);

  return null;
}

export function AnalyticsConsent() {
  const [choice, setChoice] = useState<"accepted" | "declined" | null>(null);
  const [resolved, setResolved] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(CONSENT_KEY);
      if (saved === "accepted" || saved === "declined") {
        setChoice(saved);
      } else {
        setOpen(true);
      }
    } catch {
      setOpen(true);
    }
    setResolved(true);
  }, []);

  function saveChoice(nextChoice: "accepted" | "declined") {
    try {
      window.localStorage.setItem(CONSENT_KEY, nextChoice);
    } catch {
      // Keep the choice for this page even when storage is unavailable.
    }
    setChoice(nextChoice);
    setOpen(false);
  }

  return (
    <>
      {resolved && choice === "accepted" && <GoogleAnalytics />}
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
              May we use Google Analytics to understand page visits and improve
              the journal? Analytics stays off unless you allow it. You can
              change your choice later in Privacy settings.
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
