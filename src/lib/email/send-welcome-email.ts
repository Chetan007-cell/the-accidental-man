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

  const appUrl = process.env.APP_URL;
  if (!appUrl) throw new Error("app_url_not_configured");

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
      subject: "Welcome to The Accidental Man",
      text: [
        "Welcome to The Accidental Man.",
        "",
        "Thanks for joining us. This is a journal about becoming: the choices, questions and small acts of care that shape a life.",
        "",
        `Read our first note: ${articleUrl}`,
        "",
        `If you did not sign up, you can unsubscribe here: ${unsubscribeUrl}`,
      ].join("\n"),
      html: `<main style="max-width:560px;margin:0 auto;padding:36px 20px;color:#1e211e;font:16px/1.7 Arial,sans-serif"><p style="font-size:11px;letter-spacing:.16em;text-transform:uppercase">THE ACCIDENTAL MAN</p><h1 style="font:500 34px/1.15 Georgia,serif">Welcome. We’re glad you’re here.</h1><p>Thanks for joining us. This is a journal about becoming: the choices, questions and small acts of care that shape a life.</p><p><a href="${articleUrl}" style="color:#1e211e">Read our first note: A Man Isn’t Born. He’s Built.</a></p><hr style="border:0;border-top:1px solid #d9d8d0;margin:32px 0"><p style="font-size:12px;color:#73766e">If you didn’t sign up, you can <a href="${unsubscribeUrl}" style="color:#1e211e">unsubscribe here</a>.</p></main>`,
    }),
    signal: AbortSignal.timeout(10_000),
  });

  if (!response.ok) {
    throw new Error(`resend_request_failed_${response.status}`);
  }
}
