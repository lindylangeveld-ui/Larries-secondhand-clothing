"use server";

import { redirect } from "next/navigation";
import { createLoginToken, isAllowedAdmin } from "@/lib/auth";
import { sendAdminLoginLink } from "@/lib/email";

export async function sendMagicLink(formData: FormData) {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();

  if (email && isAllowedAdmin(email)) {
    const token = await createLoginToken(email);
    const link = `${process.env.APP_URL}/admin/verify?token=${token}`;
    await sendAdminLoginLink(email, link).catch(() => {});
  }

  redirect("/admin/login?sent=1");
}
