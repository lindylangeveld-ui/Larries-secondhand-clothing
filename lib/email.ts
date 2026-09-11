import { Resend } from "resend";

function getResend() {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) throw new Error("RESEND_API_KEY is not set");
  return new Resend(apiKey);
}

function getFrom() {
  return process.env.RESEND_FROM ?? "Larries Secondhand Clothing <onboarding@resend.dev>";
}

export async function sendAdminLoginLink(email: string, link: string) {
  const resend = getResend();
  await resend.emails.send({
    from: getFrom(),
    to: email,
    subject: "Your admin sign-in link",
    html: `<p>Click below to sign in to the admin dashboard. This link expires in 15 minutes.</p><p><a href="${link}">${link}</a></p>`,
  });
}

export async function notifyAdminOfNewSubmissions(details: {
  sellerName: string;
  items: { itemType: string; size: string }[];
}) {
  const to = process.env.ADMIN_EMAILS?.split(",")[0]?.trim();
  if (!to) return;
  const resend = getResend();
  const list = details.items
    .map((item) => `<li>${item.itemType}, size ${item.size}</li>`)
    .join("");
  const subject =
    details.items.length === 1
      ? `New item submitted: ${details.items[0].itemType} (${details.items[0].size})`
      : `${details.items.length} new items submitted by ${details.sellerName}`;
  await resend.emails.send({
    from: getFrom(),
    to,
    subject,
    html: `<p>${details.sellerName} submitted the following item${
      details.items.length > 1 ? "s" : ""
    } for approval:</p><ul>${list}</ul><p><a href="${process.env.APP_URL}/admin">Review in the admin dashboard</a></p>`,
  });
}
