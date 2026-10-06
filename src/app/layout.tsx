import type { Metadata, Viewport } from "next";
import Link from "next/link";
import { AnalyticsConsent } from "@/components/analytics-consent";
import { SiteHeader } from "@/components/site-header";
import "./globals.css";

const siteUrl = process.env.APP_URL ?? "https://theaccidentalman.com";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#000000",
};

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "The Accidental Man — Notes on becoming",
    template: "%s — The Accidental Man",
  },
  description:
    "A journal about becoming: perspective, style, grooming and the life in between.",
  openGraph: {
    type: "website",
    siteName: "The Accidental Man",
    title: "The Accidental Man",
    description: "Notes on becoming.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <a className="skip-link" href="#main">
          Skip to content
        </a>
        <SiteHeader />
        {children}
        <footer className="site-footer">
          <div className="footer-brand">
            <Link href="/" className="wordmark">
              THE ACCIDENTAL MAN<span>NOTES ON BECOMING</span>
            </Link>
            <p>An independent journal on becoming.</p>
          </div>
          <nav className="site-footer-links" aria-label="Footer navigation">
            <Link href="/privacy">Privacy</Link>
            <Link href="/journal">Journal</Link>
            <a href="https://www.linkedin.com/company/theaccidentalman/" target="_blank" rel="noreferrer">
              <svg className="social-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M5.2 3.5a1.8 1.8 0 1 0 0 3.6 1.8 1.8 0 0 0 0-3.6ZM3.7 9h3v11h-3V9Zm5 0h2.9v1.5h.1a3.2 3.2 0 0 1 2.9-1.7c3.1 0 3.7 2 3.7 4.6V20h-3v-5.9c0-1.4 0-3.1-1.9-3.1s-2.2 1.5-2.2 3V20h-3V9Z" fill="currentColor" /></svg>
              LinkedIn
            </a>
            <a href="https://www.instagram.com/theaccidentalman/" target="_blank" rel="noreferrer">
              <svg className="social-icon" viewBox="0 0 24 24" aria-hidden="true"><rect x="3.5" y="3.5" width="17" height="17" rx="5" fill="none" stroke="currentColor" strokeWidth="1.8" /><circle cx="12" cy="12" r="4" fill="none" stroke="currentColor" strokeWidth="1.8" /><circle cx="17.7" cy="6.7" r="1.1" fill="currentColor" /></svg>
              Instagram
            </a>
            <a href="https://www.youtube.com/@theaccidentalman" target="_blank" rel="noreferrer">
              <svg className="social-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M22 7.2a2.8 2.8 0 0 0-2-2C18.2 4.7 12 4.7 12 4.7s-6.2 0-8 .5a2.8 2.8 0 0 0-2 2A29 29 0 0 0 1.5 12a29 29 0 0 0 .5 4.8 2.8 2.8 0 0 0 2 2c1.8.5 8 .5 8 .5s6.2 0 8-.5a2.8 2.8 0 0 0 2-2 29 29 0 0 0 .5-4.8 29 29 0 0 0-.5-4.8ZM10 15.3V8.7l5.7 3.3-5.7 3.3Z" fill="currentColor" /></svg>
              YouTube
            </a>
          </nav>
          <small>© {new Date().getFullYear()} The Accidental Man</small>
        </footer>
        <AnalyticsConsent />
      </body>
    </html>
  );
}
