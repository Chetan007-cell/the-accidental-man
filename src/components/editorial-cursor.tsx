"use client";

import { useEffect, useRef, useState } from "react";

interface CursorData {
  text: string;
  image?: string;
  tag?: string;
}

export function EditorialCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const [cursorData, setCursorData] = useState<CursorData | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isPointerDevice, setIsPointerDevice] = useState(false);

  useEffect(() => {
    // Only enable on desktop devices with fine pointer (mouse/trackpad)
    if (typeof window === "undefined") return;
    const isFine = window.matchMedia("(pointer: fine)").matches;
    if (!isFine) return;
    setIsPointerDevice(true);

    let mouseX = -100;
    let mouseY = -100;
    let currentX = -100;
    let currentY = -100;
    let animationFrameId: number;

    const onMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;

      if (!isVisible) {
        setIsVisible(true);
      }

      // Check if hovering over an interactive element with custom cursor data
      const target = (e.target as HTMLElement)?.closest(
        "[data-cursor-text], .story-card, .pillar-card, .button, .text-link",
      );

      if (target) {
        const textAttr = target.getAttribute("data-cursor-text");
        const imageAttr = target.getAttribute("data-cursor-image");
        const tagAttr = target.getAttribute("data-cursor-tag");

        if (textAttr || imageAttr) {
          setCursorData({
            text: textAttr || "EXPLORE",
            image: imageAttr || undefined,
            tag: tagAttr || undefined,
          });
        } else if (target.classList.contains("story-card")) {
          setCursorData({
            text: "READ ESSAY ↗",
            tag: "DISPATCH",
          });
        } else if (target.classList.contains("pillar-card")) {
          setCursorData({
            text: "INSPECT PILLAR",
            tag: "DIMENSION",
          });
        } else {
          setCursorData(null);
        }
      } else {
        setCursorData(null);
      }
    };

    const onMouseLeave = () => {
      setIsVisible(false);
      setCursorData(null);
    };

    // Smooth lerp loop for fluid, expensive cursor motion
    const loop = () => {
      const ease = 0.18;
      currentX += (mouseX - currentX) * ease;
      currentY += (mouseY - currentY) * ease;

      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate3d(${currentX}px, ${currentY}px, 0)`;
      }

      animationFrameId = requestAnimationFrame(loop);
    };

    window.addEventListener("mousemove", onMouseMove, { passive: true });
    document.addEventListener("mouseleave", onMouseLeave);
    animationFrameId = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseleave", onMouseLeave);
      cancelAnimationFrame(animationFrameId);
    };
  }, [isVisible]);

  if (!isPointerDevice || !isVisible || !cursorData) return null;

  return (
    <div
      ref={cursorRef}
      className="editorial-cursor"
      aria-hidden="true"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        pointerEvents: "none",
        zIndex: 9999,
        willChange: "transform",
      }}
    >
      <div className="editorial-cursor-capsule">
        {cursorData.tag && (
          <span className="editorial-cursor-tag">{cursorData.tag}</span>
        )}
        <span className="editorial-cursor-text">{cursorData.text}</span>
      </div>
    </div>
  );
}
