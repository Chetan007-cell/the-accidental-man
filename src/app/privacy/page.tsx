import type { Metadata } from "next";
export const metadata: Metadata = { title: "Privacy" };
export default function PrivacyPage() {
  return (
    <main id="main" className="page-wrap prose">
      <p className="eyebrow">THE ACCIDENTAL MAN</p>
      <h1 className="page-title">Privacy, plainly.</h1>
      <p>
        If you join the newsletter, we store your email address, signup consent,
        and delivery preferences in our database. We use Resend to send the
        welcome email and provide an unsubscribe link in that message.
      </p>
      <p>
        Google Analytics is optional. It remains off unless you choose “Allow
        analytics” in the privacy settings. If you reject analytics, the Privacy
        settings button remains available at the bottom of any page so you can
        change your choice later. After you allow analytics, that button is
        removed.
      </p>
      <p>
        We do not sell personal information. You can unsubscribe through the
        link in a newsletter email and request deletion by contacting
        hello@theaccidentalman.com. This notice must be reviewed for the
        applicable jurisdictions and the final production setup before launch.
      </p>
    </main>
  );
}
