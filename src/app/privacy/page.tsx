import type { Metadata } from "next";
export const metadata: Metadata = { title: "Privacy" };
export default function PrivacyPage() {
  return (
    <main id="main" className="page-wrap prose">
      <p className="eyebrow">THE ACCIDENTAL MAN</p>
      <h1 className="page-title">Privacy, plainly.</h1>
      <p>
        We only collect information needed to run this journal and the services
        you choose to use. If you join the newsletter, we store your email
        address and consent record so we can send the letters you requested.
      </p>
      <p>
        We do not sell personal information. You can unsubscribe from email at
        any time and request deletion by contacting hello@theaccidentalman.com.
        This starter privacy notice must be reviewed and updated for the actual
        providers, jurisdiction and data practices before launch.
      </p>
    </main>
  );
}
