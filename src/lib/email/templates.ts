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
  imageUrl?: string;
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
<body style="margin:0;padding:0;background-color:#faf9f5;font-family:-apple-system,BlinkMacSystemFont,'Plus Jakarta Sans','Segoe UI',Roboto,Helvetica,Arial,sans-serif;color:#111111;-webkit-font-smoothing:antialiased;">
  <!-- Preheader text -->
  <div style="display:none;font-size:1px;color:#faf9f5;line-height:1px;max-height:0px;max-width:0px;opacity:0;overflow:hidden;">
    A man isn’t born. He’s built. Welcome to the quiet craft.
  </div>

  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#faf9f5;padding:36px 12px 60px;">
    <tr>
      <td align="center">
        <!-- Main Card Container -->
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:580px;background-color:#ffffff;border:1px solid #e7e5dc;border-radius:6px;overflow:hidden;box-shadow:0 4px 20px rgba(17,17,17,0.06);">
          
          <!-- Editorial Header with Brand Logo -->
          <tr>
            <td style="padding:34px 36px 26px;border-bottom:1px solid #e7e5dc;text-align:center;background-color:#faf9f5;border-top:3px solid #111111;">
              <a href="${appUrl}" style="text-decoration:none;display:inline-block;" target="_blank">
                <img src="${appUrl}/images/logo-mark.png" alt="The Accidental Man Logo" width="56" height="33" border="0" style="display:block;margin:0 auto 14px;border:0;width:56px;height:auto;max-width:56px;outline:none;" />
              </a>
              <p style="margin:0 0 6px;font-size:9.5px;letter-spacing:0.24em;color:#a36130;text-transform:uppercase;font-weight:700;">
                VOL. 01 · FIELD NOTES &amp; ESSAYS
              </p>
              <h1 style="margin:0;font-size:16px;letter-spacing:0.2em;font-weight:700;color:#111111;text-transform:uppercase;">
                THE ACCIDENTAL MAN
              </h1>
              <p style="margin:6px 0 0;font-size:9px;letter-spacing:0.26em;color:#66635d;text-transform:uppercase;font-weight:600;">
                A FACTORY FOR THE MODERN MAN
              </p>
            </td>
          </tr>

          <!-- Letter Body -->
          <tr>
            <td style="padding:40px 36px 32px;">
              <p style="margin:0 0 14px;font-size:10px;letter-spacing:0.22em;color:#a36130;text-transform:uppercase;font-weight:700;">
                WELCOME TO THE JOURNAL
              </p>
              
              <h2 style="margin:0 0 20px;font-family:Georgia,Cambria,'Times New Roman',serif;font-size:30px;line-height:1.2;font-weight:400;color:#111111;">
                A man isn’t born.<br><em style="font-style:italic;">He’s built.</em>
              </h2>

              <p style="margin:0 0 18px;font-size:15.5px;line-height:1.75;color:#2c2b29;">
                Welcome to the quiet craft. Manhood is not an innate status, a performance, or a rigid checklist. It is built every day through the choices you make, the habits you keep, the questions you dare to ask, and the person you choose to become.
              </p>

              <p style="margin:0 0 28px;font-size:15.5px;line-height:1.75;color:#2c2b29;">
                We built <strong>The Accidental Man</strong> as an unhurried space for men who want substance over noise: thoughtful field notes, emotional clarity, and grounded guidance across mind, body, character, and everyday life.
              </p>

              <!-- Three Tenets Spotlight -->
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#faf9f5;border:1px solid #e7e5dc;border-left:3px solid #111111;padding:20px 22px;margin:0 0 32px;border-radius:0 4px 4px 0;">
                <tr>
                  <td>
                    <p style="margin:0 0 12px;font-size:10px;letter-spacing:0.18em;color:#a36130;text-transform:uppercase;font-weight:700;">
                      OUR CORE TENETS
                    </p>
                    <p style="margin:0 0 10px;font-size:13.5px;line-height:1.6;color:#111111;">
                      <strong>01 Become</strong> — Starting exactly where you are without shame. Unlearning noise.
                    </p>
                    <p style="margin:0 0 10px;font-size:13.5px;line-height:1.6;color:#111111;">
                      <strong>02 Maintain</strong> — Daily architecture: routines, clarity, resilience, and showing up.
                    </p>
                    <p style="margin:0;font-size:13.5px;line-height:1.6;color:#111111;">
                      <strong>03 Evolve</strong> — Deepening your craft, cultivating friendships, and whole living.
                    </p>
                  </td>
                </tr>
              </table>

              <!-- Featured Essay Card -->
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="border:1px solid #e7e5dc;background-color:#faf9f5;border-radius:6px;padding:24px;margin:0 0 32px;">
                <tr>
                  <td>
                    <p style="margin:0 0 8px;font-size:9.5px;letter-spacing:0.2em;color:#a36130;text-transform:uppercase;font-weight:700;">
                      FLAGSHIP ESSAY · 5 MIN READ
                    </p>
                    <h3 style="margin:0 0 10px;font-family:Georgia,Cambria,'Times New Roman',serif;font-size:22px;line-height:1.3;font-weight:500;color:#111111;">
                      A Man Isn’t Born. He’s Built.
                    </h3>
                    <p style="margin:0 0 20px;font-size:14px;line-height:1.65;color:#454740;">
                      “Becoming a man is not about having everything figured out; it is about becoming more willing and able to figure things out.”
                    </p>
                    <div>
                      <a href="${articleUrl}" style="background-color:#111111;color:#ffffff;text-decoration:none;font-size:11px;font-weight:700;letter-spacing:0.16em;text-transform:uppercase;padding:12px 24px;border-radius:3px;display:inline-block;">
                        Read the essay &#8599;
                      </a>
                    </div>
                  </td>
                </tr>
              </table>

              <p style="margin:0 0 8px;font-size:15px;line-height:1.7;color:#2c2b29;">
                We’re honored to have you with us in the arena.
              </p>
              <p style="margin:0;font-family:Georgia,Cambria,'Times New Roman',serif;font-style:italic;font-size:16px;color:#111111;">
                The Accidental Man Editorial Desk
              </p>
            </td>
          </tr>

          <!-- Editorial Footer -->
          <tr>
            <td style="padding:30px 36px 34px;background-color:#faf9f5;border-top:1px solid #e7e5dc;text-align:center;">
              <a href="${appUrl}" style="text-decoration:none;display:inline-block;" target="_blank">
                <img src="${appUrl}/images/logo-mark.png" alt="The Accidental Man" width="38" height="22" border="0" style="display:block;margin:0 auto 12px;opacity:0.85;width:38px;height:auto;border:0;outline:none;" />
              </a>
              <p style="margin:0 0 8px;font-size:10px;letter-spacing:0.2em;color:#a36130;text-transform:uppercase;font-weight:700;">
                THE ACCIDENTAL MAN
              </p>
              <p style="margin:0 0 14px;font-size:12.5px;color:#2c2b29;">
                Editorial Desk: <a href="mailto:hello@theaccidentalman.com" style="color:#111111;font-weight:600;text-decoration:underline;">hello@theaccidentalman.com</a>
              </p>
              <p style="margin:0 0 16px;font-size:11.5px;color:#66635d;">
                <a href="${appUrl}/journal" style="color:#66635d;text-decoration:none;margin:0 8px;font-weight:500;">The Journal</a> &bull;
                <a href="${appUrl}/#pillars" style="color:#66635d;text-decoration:none;margin:0 8px;font-weight:500;">Nine Pillars</a> &bull;
                <a href="${appUrl}/privacy" style="color:#66635d;text-decoration:none;margin:0 8px;font-weight:500;">Privacy Notice</a>
              </p>
              <hr style="border:0;border-top:1px solid #e7e5dc;margin:18px auto;max-width:220px;">
              <p style="margin:0;font-size:11px;line-height:1.6;color:#908d85;">
                You are receiving this note because you subscribed to The Accidental Man.<br>
                To leave the list at any time, <a href="${unsubscribeUrl}" style="color:#66635d;text-decoration:underline;">unsubscribe here</a>.
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
  imageUrl,
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
<body style="margin:0;padding:0;background-color:#faf9f5;font-family:-apple-system,BlinkMacSystemFont,'Plus Jakarta Sans','Segoe UI',Roboto,Helvetica,Arial,sans-serif;color:#111111;-webkit-font-smoothing:antialiased;">
  <!-- Preheader text -->
  <div style="display:none;font-size:1px;color:#faf9f5;line-height:1px;max-height:0px;max-width:0px;opacity:0;overflow:hidden;">
    ${excerpt}
  </div>

  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#faf9f5;padding:36px 12px 60px;">
    <tr>
      <td align="center">
        <!-- Main Card Container -->
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:580px;background-color:#ffffff;border:1px solid #e7e5dc;border-radius:6px;overflow:hidden;box-shadow:0 4px 20px rgba(17,17,17,0.06);">
          
          <!-- Editorial Header with Brand Logo -->
          <tr>
            <td style="padding:32px 36px 24px;border-bottom:1px solid #e7e5dc;text-align:center;background-color:#faf9f5;border-top:3px solid #111111;">
              <a href="${appUrl}" style="text-decoration:none;display:inline-block;" target="_blank">
                <img src="${appUrl}/images/logo-mark.png" alt="The Accidental Man Logo" width="54" height="32" border="0" style="display:block;margin:0 auto 12px;width:54px;height:auto;max-width:54px;outline:none;" />
              </a>
              <h1 style="margin:0;font-size:15px;letter-spacing:0.2em;font-weight:700;color:#111111;text-transform:uppercase;">
                THE ACCIDENTAL MAN
              </h1>
              <p style="margin:6px 0 0;font-size:9.5px;letter-spacing:0.22em;color:#a36130;text-transform:uppercase;font-weight:700;">
                NEW ESSAY DISPATCH &bull; ${category.toUpperCase()}
              </p>
            </td>
          </tr>

          <!-- Article Content -->
          <tr>
            <td style="padding:36px 36px 36px;">
              ${
                imageUrl
                  ? `
              <div style="margin:0 0 24px;border-radius:4px;overflow:hidden;border:1px solid #e7e5dc;">
                <a href="${articleUrl}" style="text-decoration:none;display:block;" target="_blank">
                  <img src="${imageUrl}" alt="${title}" width="508" style="display:block;width:100%;max-width:508px;height:auto;border:0;" />
                </a>
              </div>
              `
                  : ""
              }
              <p style="margin:0 0 10px;font-size:10px;letter-spacing:0.2em;color:#a36130;text-transform:uppercase;font-weight:700;">
                ${category.toUpperCase()} &bull; ${readingTimeMinutes} MIN READ
              </p>
              
              <h2 style="margin:0 0 18px;font-family:Georgia,Cambria,'Times New Roman',serif;font-size:27px;line-height:1.25;font-weight:400;color:#111111;">
                ${title}
              </h2>

              <p style="margin:0 0 28px;font-size:16px;line-height:1.75;color:#2c2b29;">
                ${excerpt}
              </p>

              <div style="margin:0 0 32px;">
                <a href="${articleUrl}" style="background-color:#111111;color:#ffffff;text-decoration:none;font-size:11px;font-weight:700;letter-spacing:0.16em;text-transform:uppercase;padding:13px 28px;border-radius:3px;display:inline-block;">
                  Read the full essay &#8599;
                </a>
              </div>

              <hr style="border:0;border-top:1px solid #e7e5dc;margin:32px 0 24px;">

              <p style="margin:0;font-family:Georgia,Cambria,'Times New Roman',serif;font-style:italic;font-size:15px;color:#111111;">
                The Accidental Man Editorial Desk
              </p>
            </td>
          </tr>

          <!-- Editorial Footer -->
          <tr>
            <td style="padding:28px 36px 32px;background-color:#faf9f5;border-top:1px solid #e7e5dc;text-align:center;">
              <a href="${appUrl}" style="text-decoration:none;display:inline-block;" target="_blank">
                <img src="${appUrl}/images/logo-mark.png" alt="The Accidental Man" width="34" height="20" border="0" style="display:block;margin:0 auto 10px;opacity:0.85;width:34px;height:auto;border:0;outline:none;" />
              </a>
              <p style="margin:0 0 10px;font-size:12px;color:#2c2b29;">
                Editorial Desk: <a href="mailto:hello@theaccidentalman.com" style="color:#111111;font-weight:600;text-decoration:underline;">hello@theaccidentalman.com</a>
              </p>
              <p style="margin:0;font-size:11px;line-height:1.6;color:#908d85;">
                Sent to subscribers of The Accidental Man. <a href="${unsubscribeUrl}" style="color:#66635d;text-decoration:underline;">Unsubscribe</a> at any time.
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

export function renderCustomBroadcastEmail({
  subject,
  headline,
  bodyParagraphs,
  ctaLabel,
  ctaUrl,
  unsubscribeUrl,
  appUrl,
}: CustomBroadcastParams) {
  const text = [
    "THE ACCIDENTAL MAN · EDITORIAL DISPATCH",
    "==================================================",
    "",
    headline.toUpperCase(),
    "",
    ...bodyParagraphs,
    "",
    ...(ctaLabel && ctaUrl ? [`${ctaLabel}: ${ctaUrl}`, ""] : []),
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
<body style="margin:0;padding:0;background-color:#faf9f5;font-family:-apple-system,BlinkMacSystemFont,'Plus Jakarta Sans','Segoe UI',Roboto,Helvetica,Arial,sans-serif;color:#111111;-webkit-font-smoothing:antialiased;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#faf9f5;padding:36px 12px 60px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:580px;background-color:#ffffff;border:1px solid #e7e5dc;border-radius:6px;overflow:hidden;box-shadow:0 4px 20px rgba(17,17,17,0.06);">
          
          <!-- Editorial Header with Brand Logo -->
          <tr>
            <td style="padding:32px 36px 24px;border-bottom:1px solid #e7e5dc;text-align:center;background-color:#faf9f5;border-top:3px solid #111111;">
              <a href="${appUrl}" style="text-decoration:none;display:inline-block;" target="_blank">
                <img src="${appUrl}/images/logo-mark.png" alt="The Accidental Man Logo" width="54" height="32" border="0" style="display:block;margin:0 auto 12px;width:54px;height:auto;max-width:54px;outline:none;" />
              </a>
              <h1 style="margin:0;font-size:15px;letter-spacing:0.2em;font-weight:700;color:#111111;text-transform:uppercase;">
                THE ACCIDENTAL MAN
              </h1>
              <p style="margin:6px 0 0;font-size:9.5px;letter-spacing:0.22em;color:#a36130;text-transform:uppercase;font-weight:700;">
                EDITORIAL DISPATCH
              </p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:36px 36px 36px;">
              <h2 style="margin:0 0 20px;font-family:Georgia,Cambria,'Times New Roman',serif;font-size:26px;line-height:1.3;font-weight:400;color:#111111;">
                ${headline}
              </h2>

              ${bodyParagraphs
                .map(
                  (p) =>
                    `<p style="margin:0 0 18px;font-size:15.5px;line-height:1.75;color:#2c2b29;">${p}</p>`,
                )
                .join("")}

              ${
                ctaLabel && ctaUrl
                  ? `
              <div style="margin:28px 0 32px;">
                <a href="${ctaUrl}" style="background-color:#111111;color:#ffffff;text-decoration:none;font-size:11px;font-weight:700;letter-spacing:0.16em;text-transform:uppercase;padding:13px 28px;border-radius:3px;display:inline-block;">
                  ${ctaLabel} &#8599;
                </a>
              </div>
              `
                  : ""
              }

              <hr style="border:0;border-top:1px solid #e7e5dc;margin:32px 0 24px;">

              <p style="margin:0;font-family:Georgia,Cambria,'Times New Roman',serif;font-style:italic;font-size:15px;color:#111111;">
                The Accidental Man Editorial Desk
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:28px 36px 32px;background-color:#faf9f5;border-top:1px solid #e7e5dc;text-align:center;">
              <a href="${appUrl}" style="text-decoration:none;display:inline-block;" target="_blank">
                <img src="${appUrl}/images/logo-mark.png" alt="The Accidental Man" width="34" height="20" border="0" style="display:block;margin:0 auto 10px;opacity:0.85;width:34px;height:auto;border:0;outline:none;" />
              </a>
              <p style="margin:0 0 10px;font-size:12px;color:#2c2b29;">
                Editorial Desk: <a href="mailto:hello@theaccidentalman.com" style="color:#111111;font-weight:600;text-decoration:underline;">hello@theaccidentalman.com</a>
              </p>
              <p style="margin:0;font-size:11px;line-height:1.6;color:#908d85;">
                Sent to subscribers of The Accidental Man. <a href="${unsubscribeUrl}" style="color:#66635d;text-decoration:underline;">Unsubscribe</a> at any time.
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
