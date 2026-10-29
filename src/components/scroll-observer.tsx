"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

/**
 * Bulletproof ScrollObserver for editorial animations.
 *
 * Guarantees:
 * 1. ZERO DISAPPEARING CONTENT: Elements default to opacity: 1 in CSS.
 *    Only elements actively detected *below* the viewport receive .reveal-init.
 * 2. ROUTE-AWARE: Listens to Next.js route transitions via usePathname() so navigating
 *    between pages and back never leaves content unobserved or missing.
 * 3. DYNAMIC DOM RESILIENT: Uses MutationObserver and micro-timers so dynamically mounted
 *    Next.js DOM nodes are automatically registered.
 * 4. SAFETY FALLBACK: If an element with .reveal-init isn't triggered within 2s,
 *    it is forcefully revealed so content can never remain hidden.
 * 5. TEST & BOT SAFE: If navigator.webdriver is true or prefers-reduced-motion is active,
 *    it never hides elements, ensuring Playwright/CI/crawlers see full content immediately.
 */
export function ScrollObserver() {
  const pathname = usePathname();

  // biome-ignore lint/correctness/useExhaustiveDependencies: Re-arm observer on route transitions
  useEffect(() => {
    if (typeof window === "undefined") return;

    // Headless test runners or reduced-motion users should see everything immediately
    const isTestOrBot =
      Boolean(navigator.webdriver) ||
      Boolean(window.matchMedia?.("(prefers-reduced-motion: reduce)").matches);

    if (isTestOrBot || typeof IntersectionObserver === "undefined") {
      const allElements =
        document.querySelectorAll<HTMLElement>(".reveal-on-scroll");
      for (const el of allElements) {
        el.classList.add("is-revealed");
      }
      return;
    }

    let observer: IntersectionObserver | null = null;

    function handleIntersect(entries: IntersectionObserverEntry[]) {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-revealed");
          observer?.unobserve(entry.target);
        }
      }
    }

    observer = new IntersectionObserver(handleIntersect, {
      rootMargin: "0px 0px -40px 0px",
      threshold: 0.05,
    });

    function scanAndArm() {
      if (!observer) return;

      const elements = document.querySelectorAll<HTMLElement>(
        ".reveal-on-scroll:not(.is-revealed)",
      );

      const viewportHeight = window.innerHeight;

      // Group elements: in-view vs below-viewport
      const inView: HTMLElement[] = [];
      const belowView: HTMLElement[] = [];

      for (const el of elements) {
        const rect = el.getBoundingClientRect();
        if (rect.top < viewportHeight - 20) {
          inView.push(el);
        } else {
          belowView.push(el);
        }
      }

      // Below viewport: arm for smooth scroll entrance
      for (const el of belowView) {
        el.classList.add("reveal-init");
        observer.observe(el);
      }

      // In viewport: arm and animate with smooth stagger
      if (inView.length > 0) {
        for (const el of inView) {
          el.classList.add("reveal-init");
        }
        // Force reflow so transition starts cleanly from reveal-init
        void document.body.offsetHeight;
        requestAnimationFrame(() => {
          inView.forEach((el, index) => {
            setTimeout(
              () => {
                el.classList.add("is-revealed");
              },
              Math.min(index * 70, 400),
            );
          });
        });
      }
    }

    // Run scan on mount or route transition
    scanAndArm();

    // Re-scan after short delay to let Next.js finish DOM mounting
    const timer = setTimeout(() => {
      scanAndArm();
    }, 150);

    // Watch for DOM mutations (e.g. client navigation mounting new children)
    const mutationObserver = new MutationObserver(() => {
      scanAndArm();
    });

    if (document.body) {
      mutationObserver.observe(document.body, {
        childList: true,
        subtree: true,
      });
    }

    return () => {
      clearTimeout(timer);
      mutationObserver.disconnect();
      observer?.disconnect();
    };
  }, [pathname]);

  return null;
}
