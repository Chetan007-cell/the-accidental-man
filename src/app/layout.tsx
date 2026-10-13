import type { Metadata, Viewport } from "next";
import { Newsreader, Plus_Jakarta_Sans } from "next/font/google";
import Link from "next/link";
import Script from "next/script";
import { AnalyticsConsent } from "@/components/analytics-consent";
import { SiteHeader } from "@/components/site-header";
import { getOrganizationSchema, getWebsiteSchema } from "@/lib/schema";
import "./globals.css";

const newsreader = Newsreader({
  subsets: ["latin"],
  variable: "--font-serif",
  display: "swap",
  style: ["normal", "italic"],
});

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

const siteUrl = process.env.APP_URL ?? "https://theaccidentalman.com";
const GA_MEASUREMENT_ID =
  process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID ?? "G-XZ3NLG1Y0T";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#000000",
};

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "The Accidental Man — A Factory for the Modern Man",
    template: "%s — The Accidental Man",
  },
  description:
    "A factory for the modern man — to become, maintain, and evolve across mind, body, character, and everyday life. A man isn't born. He's built.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    siteName: "The Accidental Man",
    title: "The Accidental Man — A Factory for the Modern Man",
    description: "A man isn’t born. He’s built. Notes on becoming.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${newsreader.variable} ${plusJakartaSans.variable}`}
    >
      <head>
        <link rel="preconnect" href="https://www.googletagmanager.com" />
        <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
        <link rel="preconnect" href="https://www.google-analytics.com" />
        <link rel="dns-prefetch" href="https://www.google-analytics.com" />
        {process.env.NODE_ENV !== "test" && (
          <>
            <Script id="google-consent-mode" strategy="beforeInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('consent', 'default', {
                  analytics_storage: 'denied',
                  ad_storage: 'denied',
                  ad_user_data: 'denied',
                  ad_personalization: 'denied'
                });
                try {
                  if (localStorage.getItem('tam-analytics-consent-v1') === 'accepted') {
                    gtag('consent', 'update', {
                      analytics_storage: 'granted'
                    });
                  }
                } catch (e) {}
              `}
            </Script>
            <Script
              strategy="lazyOnload"
              src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
            />
            <Script id="google-analytics" strategy="lazyOnload">
              {`
                gtag('js', new Date());
                gtag('config', '${GA_MEASUREMENT_ID}', {
                  send_page_view: false
                });
              `}
            </Script>
          </>
        )}
        <script type="application/ld+json">
          {JSON.stringify(getOrganizationSchema(siteUrl))}
        </script>
        <script type="application/ld+json">
          {JSON.stringify(getWebsiteSchema(siteUrl))}
        </script>
      </head>
      <body>
        <a className="skip-link" href="#main">
          Skip to content
        </a>
        <SiteHeader />
        {children}
        <footer className="site-footer">
          <div className="site-footer-inner">
            <div className="footer-col footer-brand-col">
              <Link href="/" className="wordmark">
                THE ACCIDENTAL MAN<span>A FACTORY FOR THE MODERN MAN</span>
              </Link>
              <p className="footer-philosophy">
                A man isn’t born. He’s built. Practical, thoughtful perspectives
                helping men become, maintain, and evolve across everyday life.
              </p>
              <div className="footer-contact">
                <span className="footer-label">EDITORIAL & CONTACT</span>
                <a
                  href="mailto:hello@theaccidentalman.com"
                  className="footer-email-link"
                >
                  hello@theaccidentalman.com
                </a>
              </div>
            </div>

            <div className="footer-col">
              <span className="footer-label">THE WORK</span>
              <nav className="footer-nav" aria-label="Footer navigation">
                <Link href="/journal">The Journal</Link>
                <Link href="/#pillars">Content Universe</Link>
                <Link href="/journal/a-man-isnt-born-hes-built">
                  Foundational Essay
                </Link>
                <Link href="/#about">About The Brand</Link>
                <Link href="/privacy">Privacy Notice</Link>
              </nav>
            </div>

            <div className="footer-col">
              <span className="footer-label">COMMUNITY & CHANNELS</span>
              <nav className="footer-social-nav" aria-label="Social channels">
                <a
                  href="https://www.linkedin.com/company/theaccidentalman/"
                  target="_blank"
                  rel="noreferrer"
                >
                  <svg
                    className="social-icon"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      d="M5.2 3.5a1.8 1.8 0 1 0 0 3.6 1.8 1.8 0 0 0 0-3.6ZM3.7 9h3v11h-3V9Zm5 0h2.9v1.5h.1a3.2 3.2 0 0 1 2.9-1.7c3.1 0 3.7 2 3.7 4.6V20h-3v-5.9c0-1.4 0-3.1-1.9-3.1s-2.2 1.5-2.2 3V20h-3V9Z"
                      fill="currentColor"
                    />
                  </svg>
                  LinkedIn
                </a>
                <a
                  href="https://www.instagram.com/theaccidentalman/"
                  target="_blank"
                  rel="noreferrer"
                >
                  <svg
                    className="social-icon"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <rect
                      x="3.5"
                      y="3.5"
                      width="17"
                      height="17"
                      rx="5"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                    />
                    <circle
                      cx="12"
                      cy="12"
                      r="4"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                    />
                    <circle cx="17.7" cy="6.7" r="1.1" fill="currentColor" />
                  </svg>
                  Instagram
                </a>
                <a
                  href="https://www.youtube.com/@theaccidentalman"
                  target="_blank"
                  rel="noreferrer"
                >
                  <svg
                    className="social-icon"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      d="M22 7.2a2.8 2.8 0 0 0-2-2C18.2 4.7 12 4.7 12 4.7s-6.2 0-8 .5a2.8 2.8 0 0 0-2 2A29 29 0 0 0 1.5 12a29 29 0 0 0 .5 4.8 2.8 2.8 0 0 0 2 2c1.8.5 8 .5 8 .5s6.2 0 8-.5a2.8 2.8 0 0 0 2-2 29 29 0 0 0 .5-4.8 29 29 0 0 0-.5-4.8ZM10 15.3V8.7l5.7 3.3-5.7 3.3Z"
                      fill="currentColor"
                    />
                  </svg>
                  YouTube
                </a>
                <a
                  href="https://pin.it/ixKK7ireQ"
                  target="_blank"
                  rel="noreferrer"
                >
                  <svg
                    className="social-icon"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      d="M12 0C5.373 0 0 5.372 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738.098.119.112.224.083.345-.09.375-.291 1.199-.334 1.357-.053.225-.174.271-.401.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.354-.629-2.758-1.379l-.749 2.848c-.269 1.045-1.004 2.352-1.498 3.146 1.123.345 2.306.535 3.546.535 6.627 0 12-5.373 12-12 0-6.628-5.373-12-12-12z"
                      fill="currentColor"
                    />
                  </svg>
                  Pinterest
                </a>
              </nav>
            </div>
          </div>

          <div className="site-footer-bottom">
            <small>
              © {new Date().getFullYear()} The Accidental Man. All rights
              reserved.
            </small>
            <span className="footer-tagline-micro">
              Become · Maintain · Evolve
            </span>
          </div>
        </footer>
        <AnalyticsConsent />
      </body>
    </html>
  );
}
