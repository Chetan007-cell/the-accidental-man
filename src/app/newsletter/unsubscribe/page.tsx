import type { Metadata } from "next";
import Link from "next/link";
import { UnsubscribeForm } from "@/components/unsubscribe-form";

export const metadata: Metadata = {
  title: "Newsletter preferences",
  robots: { index: false, follow: false },
};

export default async function UnsubscribePage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const { token = "" } = await searchParams;
  const validToken = /^[a-f0-9]{64}$/i.test(token);

  return (
    <main id="main" className="page-wrap">
      <p className="eyebrow">THE ACCIDENTAL MAN / NEWSLETTER</p>
      <h1 className="page-title">
        Your inbox,
        <br />
        <em>your choice.</em>
      </h1>
      <p className="page-intro">
        {validToken
          ? "Confirm below and we’ll stop sending newsletter emails to this address."
          : "This unsubscribe link doesn’t look valid. You can contact us and we’ll help update your preferences."}
      </p>
      {validToken ? (
        <UnsubscribeForm token={token} />
      ) : (
        <p>
          Contact{" "}
          <a href="mailto:hello@theaccidentalman.com">
            hello@theaccidentalman.com
          </a>
          .
        </p>
      )}
      <p className="unsubscribe-home">
        <Link href="/">Return to the journal</Link>
      </p>
    </main>
  );
}
