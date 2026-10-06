"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function SiteHeader() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  // Close menu on route change
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Close on Escape key
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape" && isOpen) {
        setIsOpen(false);
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  return (
    <>
      <header className="site-header">
        <Link href="/" className="site-brand" onClick={() => setIsOpen(false)}>
          <Image
            src="/images/logo-mark.png"
            alt="The Accidental Man Logo"
            width={58}
            height={34}
            priority
            unoptimized
            className="site-logo"
          />
          <span className="wordmark">
            THE ACCIDENTAL MAN
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="site-nav-desktop" aria-label="Main navigation">
          <Link href="/journal">Journal</Link>
          <a href="/#about">About</a>
          <a href="/#newsletter">Letters</a>
        </nav>

        {/* Mobile Menu Button */}
        <button
          type="button"
          className="mobile-menu-btn"
          aria-expanded={isOpen}
          aria-controls="mobile-navigation"
          aria-label={isOpen ? "Close menu" : "Open menu"}
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? "CLOSE" : "MENU"}
        </button>
      </header>

      {/* Mobile Navigation Dropdown */}
      <div
        id="mobile-navigation"
        className={`mobile-nav-overlay ${isOpen ? "active" : ""}`}
        aria-hidden={!isOpen}
        onClick={(e) => {
          if (e.target === e.currentTarget) setIsOpen(false);
        }}
      >
        <div className="mobile-nav-content">
          <nav className="mobile-nav-links" aria-label="Mobile navigation">
            <Link
              href="/journal"
              className={pathname.startsWith("/journal") ? "active" : ""}
              onClick={() => setIsOpen(false)}
            >
              Journal
            </Link>
            <a href="/#about" onClick={() => setIsOpen(false)}>
              About
            </a>
            <a href="/#newsletter" onClick={() => setIsOpen(false)}>
              Letters
            </a>
            <Link
              href="/privacy"
              className={pathname === "/privacy" ? "active" : ""}
              onClick={() => setIsOpen(false)}
            >
              Privacy
            </Link>
          </nav>
        </div>
      </div>
    </>
  );
}
