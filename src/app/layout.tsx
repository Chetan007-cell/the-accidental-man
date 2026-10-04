import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import "./globals.css";

const siteUrl = process.env.APP_URL ?? "https://theaccidentalman.com";
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
        <header className="site-header">
          <Link href="/" className="site-brand">
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
              THE ACCIDENTAL MAN<span>NOTES ON BECOMING</span>
            </span>
          </Link>
          <nav aria-label="Main navigation">
            <Link href="/journal">Journal</Link>
            <a href="/#about">About</a>
            <a href="/#newsletter">Letters</a>
          </nav>
        </header>
        {children}
        <footer className="site-footer">
          <Link href="/" className="wordmark">
            THE ACCIDENTAL MAN<span>NOTES ON BECOMING</span>
          </Link>
          <p>An independent journal on becoming.</p>
          <div>
            <Link href="/privacy">Privacy</Link>
            <Link href="/journal">Journal</Link>
          </div>
          <small>© {new Date().getFullYear()} The Accidental Man</small>
        </footer>
      </body>
    </html>
  );
}
