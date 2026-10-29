"use client";

import { useEffect, useState } from "react";

export function ReadingProgress() {
  const [progress, setProgress] = useState(0);
  const [inFooter, setInFooter] = useState(false);

  useEffect(() => {
    function handleScroll() {
      // Hide completely when user scrolls to the footer section
      const footer = document.querySelector(".site-footer");
      if (footer) {
        const footerRect = footer.getBoundingClientRect();
        if (footerRect.top <= window.innerHeight) {
          setInFooter(true);
          return;
        }
      }
      setInFooter(false);

      // Measure reading progress scoped to the article itself (excluding the footer)
      const article = document.querySelector(
        "article, .article-content, #main",
      );
      if (!article) return;

      const rect = article.getBoundingClientRect();
      const articleTop = rect.top + window.scrollY;
      const articleHeight = rect.height;
      const viewportHeight = window.innerHeight;

      const scrollY = window.scrollY - articleTop;
      const totalScrollable = Math.max(1, articleHeight - viewportHeight);

      const pct = Math.min(100, Math.max(0, (scrollY / totalScrollable) * 100));
      setProgress(pct);
    }

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Do not display if at the very top (0%) or when reader has entered the footer section
  if (progress === 0 || inFooter) return null;

  return (
    <div
      className="reading-progress-track"
      aria-hidden="true"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        height: "3px",
        zIndex: 1000,
        pointerEvents: "none",
        backgroundColor: "transparent",
      }}
    >
      <div
        className="reading-progress-fill"
        style={{
          height: "100%",
          width: `${progress}%`,
          backgroundColor: "var(--accent, #a36130)",
          transition: "width 80ms ease-out",
        }}
      />
    </div>
  );
}
