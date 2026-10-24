import { renderWelcomeEmail } from "./templates";

type WelcomeEmailInput = {
  email: string;
  unsubscribeToken: string;
  subscriberId: string;
};

export async function sendWelcomeEmail({
  email,
  unsubscribeToken,
  subscriberId,
}: WelcomeEmailInput) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) throw new Error("resend_not_configured");

  const appUrl =
    process.env.APP_URL ??
    (process.env.VERCEL_PROJECT_PRODUCTION_URL
      ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
      : "https://theaccidentalman.com");

  const from =
    process.env.NEWSLETTER_FROM_EMAIL ??
    "The Accidental Man <hello@theaccidentalman.com>";
  const articleUrl = new URL(
    "/journal/a-man-isnt-born-hes-built",
    appUrl,
  ).toString();
  const unsubscribeUrl = new URL(
    `/newsletter/unsubscribe?token=${encodeURIComponent(unsubscribeToken)}`,
    appUrl,
  ).toString();

  const { subject, html, text } = renderWelcomeEmail({
    articleUrl,
    unsubscribeUrl,
    appUrl,
  });

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      "Idempotency-Key": `newsletter-welcome/${subscriberId}`,
    },
    body: JSON.stringify({
      from,
      to: [email],
      subject,
      text,
      html,
    }),
    signal: AbortSignal.timeout(10_000),
  });

  if (!response.ok) {
    throw new Error(`resend_request_failed_${response.status}`);
  }
}
