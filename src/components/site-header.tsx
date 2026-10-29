"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export function SiteHeader() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();

  // Track scroll state for dynamic header elevation
  useEffect(() => {
    function handleScroll() {
      setIsScrolled(window.scrollY > 20);
    }
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close menu on route change
  useEffect(() => {
    if (pathname) {
      setIsOpen(false);
    }
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

  const handleAnchorClick = (hash: string) => {
    setIsOpen(false);
    if (typeof window !== "undefined" && pathname === "/") {
      const id = hash.replace("#", "");
      const target = document.getElementById(id);
      if (target) {
        requestAnimationFrame(() => {
          target.scrollIntoView({ behavior: "smooth" });
        });
      }
    }
  };

  return (
    <>
      <header
        className={`site-header ${isScrolled ? "site-header-scrolled" : ""}`}
      >
        <Link href="/" className="site-brand" onClick={() => setIsOpen(false)}>
          <Image
            src="/images/logo-mark.png"
            alt="The Accidental Man Logo"
            width={58}
            height={34}
            priority
            className="site-logo"
          />
          <span className="wordmark">THE ACCIDENTAL MAN</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="site-nav-desktop" aria-label="Main navigation">
          <Link href="/journal">Journal</Link>
          <Link href="/#pillars">Pillars</Link>
          <Link href="/#about">Philosophy</Link>
          <Link href="/#newsletter">Letters</Link>
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
        inert={!isOpen ? true : undefined}
        onClick={(e) => {
          if (e.target === e.currentTarget) setIsOpen(false);
        }}
      >
        <div className="mobile-nav-content">
          <nav className="mobile-nav-links" aria-label="Mobile navigation">
            <Link
              href="/journal"
              className={pathname?.startsWith("/journal") ? "active" : ""}
              tabIndex={isOpen ? 0 : -1}
              onClick={() => setIsOpen(false)}
            >
              Journal
            </Link>
            <Link
              href="/#pillars"
              tabIndex={isOpen ? 0 : -1}
              onClick={() => handleAnchorClick("#pillars")}
            >
              Pillars
            </Link>
            <Link
              href="/#about"
              tabIndex={isOpen ? 0 : -1}
              onClick={() => handleAnchorClick("#about")}
            >
              Philosophy
            </Link>
            <Link
              href="/#newsletter"
              tabIndex={isOpen ? 0 : -1}
              onClick={() => handleAnchorClick("#newsletter")}
            >
              Letters
            </Link>
            <Link
              href="/privacy"
              className={pathname === "/privacy" ? "active" : ""}
              tabIndex={isOpen ? 0 : -1}
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
