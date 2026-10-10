export interface WelcomeEmailParams {
  articleUrl: string;
  unsubscribeUrl: string;
  appUrl: string;
}

export interface BlogBroadcastParams {
  title: string;
  excerpt: string;
  category: string;
  readingTimeMinutes: number;
  slug: string;
  unsubscribeUrl: string;
  appUrl: string;
}

export interface CustomBroadcastParams {
  subject: string;
  headline: string;
  bodyParagraphs: string[];
  ctaLabel?: string;
  ctaUrl?: string;
  unsubscribeUrl: string;
  appUrl: string;
}

export function renderWelcomeEmail({
  articleUrl,
  unsubscribeUrl,
  appUrl,
}: WelcomeEmailParams) {
  const subject =
    "Welcome to The Accidental Man: A man isn’t born. He’s built.";
  const text = [
    "THE ACCIDENTAL MAN · A FACTORY FOR THE MODERN MAN",
    "==================================================",
    "",
    "A MAN ISN’T BORN. HE’S BUILT.",
    "",
    "Welcome to the quiet craft. This is a publication and toolkit about becoming: the deliberate choices, unvarnished questions, and small acts of discipline that shape a life.",
    "",
    "OUR THREE TENETS:",
    "01 BECOME — Starting where you are without shame. Unlearning noise.",
    "02 MAINTAIN — The daily architecture: vitality, clarity, and showing up.",
    "03 EVOLVE — Deepening your craft, relationships, and character over time.",
    "",
    "OUR FOUNDATIONAL ESSAY:",
    "A Man Isn’t Born. He’s Built.",
    `Read the essay: ${articleUrl}`,
    "",
    "“No finished versions. Just the quiet work of becoming.”",
    "",
    "--------------------------------------------------",
    "Editorial desk: hello@theaccidentalman.com",
    `Visit The Journal: ${appUrl}/journal`,
    `Unsubscribe at any time: ${unsubscribeUrl}`,
  ].join("\n");

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${subject}</title>
</head>
<body style="margin:0;padding:0;background-color:#f6f5ef;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;color:#1c1d1a;-webkit-font-smoothing:antialiased;">
  <!-- Preheader text -->
  <div style="display:none;font-size:1px;color:#f6f5ef;line-height:1px;max-height:0px;max-width:0px;opacity:0;overflow:hidden;">
    A man isn’t born. He’s built. Welcome to the quiet craft.
  </div>

  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#f6f5ef;padding:36px 12px 60px;">
    <tr>
      <td align="center">
        <!-- Main Card Container -->
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:580px;background-color:#ffffff;border:1px solid #e7e5dc;border-radius:6px;overflow:hidden;box-shadow:0 4px 20px rgba(0,0,0,0.03);">
          
          <!-- Editorial Header -->
          <tr>
            <td style="padding:32px 36px 24px;border-bottom:1px solid #f0eee6;text-align:center;background-color:#faf9f5;">
              <p style="margin:0 0 6px;font-size:9.5px;letter-spacing:0.24em;color:#87867f;text-transform:uppercase;font-weight:600;">
                VOL. 01 · FIELD NOTES &amp; ESSAYS
              </p>
              <h1 style="margin:0;font-size:16px;letter-spacing:0.18em;font-weight:700;color:#141413;text-transform:uppercase;">
                THE ACCIDENTAL MAN
              </h1>
              <p style="margin:6px 0 0;font-size:9px;letter-spacing:0.26em;color:#5a5c56;text-transform:uppercase;font-weight:600;">
                A FACTORY FOR THE MODERN MAN
              </p>
            </td>
          </tr>

          <!-- Letter Body -->
          <tr>
            <td style="padding:40px 36px 32px;">
              <p style="margin:0 0 14px;font-size:10px;letter-spacing:0.22em;color:#7e5e38;text-transform:uppercase;font-weight:700;">
                WELCOME TO THE JOURNAL
              </p>
              
              <h2 style="margin:0 0 20px;font-family:Georgia,Cambria,serif;font-size:30px;line-height:1.2;font-weight:400;color:#141413;">
                A man isn’t born.<br><em style="font-style:italic;">He’s built.</em>
              </h2>

              <p style="margin:0 0 18px;font-size:15.5px;line-height:1.75;color:#2c2d28;">
                Welcome to the quiet craft. Manhood is not an innate status, a performance, or a rigid checklist. It is built every day through the choices you make, the habits you keep, the questions you dare to ask, and the person you choose to become.
              </p>

              <p style="margin:0 0 28px;font-size:15.5px;line-height:1.75;color:#2c2d28;">
                We built <strong>The Accidental Man</strong> as an unhurried space for men who want substance over noise: thoughtful field notes, emotional clarity, and grounded guidance.
              </p>

              <!-- Three Tenets Spotlight -->
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#faf9f5;border-left:3px solid #141413;padding:20px 22px;margin:0 0 32px;border-radius:0 4px 4px 0;">
                <tr>
                  <td>
                    <p style="margin:0 0 12px;font-size:10px;letter-spacing:0.18em;color:#87867f;text-transform:uppercase;font-weight:700;">
                      OUR CORE TENETS
                    </p>
                    <p style="margin:0 0 10px;font-size:13.5px;line-height:1.6;color:#1c1d1a;">
                      <strong>01 Become</strong> — Starting exactly where you are without shame. Unlearning noise.
                    </p>
                    <p style="margin:0 0 10px;font-size:13.5px;line-height:1.6;color:#1c1d1a;">
                      <strong>02 Maintain</strong> — Daily architecture: routines, clarity, resilience, and showing up.
                    </p>
                    <p style="margin:0;font-size:13.5px;line-height:1.6;color:#1c1d1a;">
                      <strong>03 Evolve</strong> — Deepening your craft, cultivating friendships, and whole living.
                    </p>
                  </td>
                </tr>
              </table>

              <!-- Featured Essay Card -->
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="border:1px solid #e7e5dc;background-color:#faf9f5;border-radius:6px;padding:24px;margin:0 0 32px;">
                <tr>
                  <td>
                    <p style="margin:0 0 8px;font-size:9.5px;letter-spacing:0.2em;color:#7e5e38;text-transform:uppercase;font-weight:700;">
                      FLAGSHIP ESSAY · 5 MIN READ
                    </p>
                    <h3 style="margin:0 0 10px;font-family:Georgia,Cambria,serif;font-size:22px;line-height:1.3;font-weight:500;color:#141413;">
                      A Man Isn’t Born. He’s Built.
                    </h3>
                    <p style="margin:0 0 20px;font-size:14px;line-height:1.65;color:#454740;">
                      “Becoming a man is not about having everything figured out; it is about becoming more willing and able to figure things out.”
                    </p>
                    <div>
                      <a href="${articleUrl}" style="background-color:#141413;color:#ffffff;text-decoration:none;font-size:11px;font-weight:700;letter-spacing:0.14em;text-transform:uppercase;padding:12px 24px;border-radius:3px;display:inline-block;">
                        Read the essay &#8599;
                      </a>
                    </div>
                  </td>
                </tr>
              </table>

              <p style="margin:0 0 8px;font-size:15px;line-height:1.7;color:#2c2d28;">
                We’re honored to have you with us.
              </p>
              <p style="margin:0;font-family:Georgia,Cambria,serif;font-style:italic;font-size:16px;color:#141413;">
                The Accidental Man Editorial Desk
              </p>
            </td>
          </tr>

          <!-- Editorial Footer -->
          <tr>
            <td style="padding:28px 36px 32px;background-color:#faf9f5;border-top:1px solid #f0eee6;text-align:center;">
              <p style="margin:0 0 12px;font-size:10px;letter-spacing:0.16em;color:#87867f;text-transform:uppercase;font-weight:600;">
                CONTACT &amp; EDITORIAL DESK
              </p>
              <p style="margin:0 0 16px;font-size:13px;color:#141413;">
                <a href="mailto:hello@theaccidentalman.com" style="color:#141413;font-weight:600;text-decoration:underline;">hello@theaccidentalman.com</a>
              </p>
              <p style="margin:0 0 16px;font-size:12px;color:#5a5c56;">
                <a href="${appUrl}/journal" style="color:#5a5c56;text-decoration:none;margin:0 8px;">The Journal</a> &bull;
                <a href="${appUrl}/#pillars" style="color:#5a5c56;text-decoration:none;margin:0 8px;">Nine Pillars</a> &bull;
                <a href="${appUrl}/privacy" style="color:#5a5c56;text-decoration:none;margin:0 8px;">Privacy Notice</a>
              </p>
              <hr style="border:0;border-top:1px solid #e7e5dc;margin:18px auto;max-width:240px;">
              <p style="margin:0;font-size:11px;line-height:1.6;color:#87867f;">
                You are receiving this note because you subscribed to The Accidental Man.<br>
                To leave the list at any time, <a href="${unsubscribeUrl}" style="color:#87867f;text-decoration:underline;">unsubscribe here</a>.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

  return { subject, html, text };
}

export function renderBlogBroadcastEmail({
  title,
  excerpt,
  category,
  readingTimeMinutes,
  slug,
  unsubscribeUrl,
  appUrl,
}: BlogBroadcastParams) {
  const articleUrl = `${appUrl}/journal/${slug}`;
  const subject = `New Essay: ${title} — The Accidental Man`;
  const text = [
    `THE ACCIDENTAL MAN · ${category.toUpperCase()}`,
    "==================================================",
    "",
    title.toUpperCase(),
    `${readingTimeMinutes} MIN READ`,
    "",
    excerpt,
    "",
    `Read the full essay: ${articleUrl}`,
    "",
    "--------------------------------------------------",
    "Editorial desk: hello@theaccidentalman.com",
    `Unsubscribe at any time: ${unsubscribeUrl}`,
  ].join("\n");

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${subject}</title>
</head>
<body style="margin:0;padding:0;background-color:#f6f5ef;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;color:#1c1d1a;-webkit-font-smoothing:antialiased;">
  <div style="display:none;font-size:1px;color:#f6f5ef;line-height:1px;max-height:0px;max-width:0px;opacity:0;overflow:hidden;">
    ${excerpt}
  </div>

  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#f6f5ef;padding:36px 12px 60px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:580px;background-color:#ffffff;border:1px solid #e7e5dc;border-radius:6px;overflow:hidden;box-shadow:0 4px 20px rgba(0,0,0,0.03);">
          
          <!-- Editorial Header -->
          <tr>
            <td style="padding:28px 36px 20px;border-bottom:1px solid #f0eee6;text-align:center;background-color:#faf9f5;">
              <h1 style="margin:0;font-size:15px;letter-spacing:0.18em;font-weight:700;color:#141413;text-transform:uppercase;">
                THE ACCIDENTAL MAN
              </h1>
              <p style="margin:4px 0 0;font-size:9px;letter-spacing:0.24em;color:#87867f;text-transform:uppercase;font-weight:600;">
                NEW ESSAY DISPATCH · ${category.toUpperCase()}
              </p>
            </td>
          </tr>

          <!-- Article Content -->
          <tr>
            <td style="padding:40px 36px 36px;">
              <p style="margin:0 0 10px;font-size:10px;letter-spacing:0.2em;color:#7e5e38;text-transform:uppercase;font-weight:700;">
                ${category.toUpperCase()} &bull; ${readingTimeMinutes} MIN READ
              </p>
              
              <h2 style="margin:0 0 20px;font-family:Georgia,Cambria,serif;font-size:28px;line-height:1.25;font-weight:400;color:#141413;">
                ${title}
              </h2>

              <p style="margin:0 0 28px;font-size:16px;line-height:1.75;color:#2c2d28;">
                ${excerpt}
              </p>

              <div style="margin:0 0 32px;">
                <a href="${articleUrl}" style="background-color:#141413;color:#ffffff;text-decoration:none;font-size:11px;font-weight:700;letter-spacing:0.14em;text-transform:uppercase;padding:13px 28px;border-radius:3px;display:inline-block;">
                  Read the full essay &#8599;
                </a>
              </div>

              <hr style="border:0;border-top:1px solid #e7e5dc;margin:32px 0 24px;">

              <p style="margin:0;font-family:Georgia,Cambria,serif;font-style:italic;font-size:15px;color:#141413;">
                The Accidental Man Editorial Desk
              </p>
            </td>
          </tr>

          <!-- Editorial Footer -->
          <tr>
            <td style="padding:24px 36px 28px;background-color:#faf9f5;border-top:1px solid #f0eee6;text-align:center;">
              <p style="margin:0 0 10px;font-size:12px;color:#141413;">
                Editorial Desk: <a href="mailto:hello@theaccidentalman.com" style="color:#141413;font-weight:600;text-decoration:underline;">hello@theaccidentalman.com</a>
              </p>
              <p style="margin:0;font-size:11px;line-height:1.6;color:#87867f;">
                Sent to subscribers of The Accidental Man. <a href="${unsubscribeUrl}" style="color:#87867f;text-decoration:underline;">Unsubscribe</a> at any time.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

  return { subject, html, text };
}
