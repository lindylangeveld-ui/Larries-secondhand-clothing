"use server";

import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { getSetting } from "@/lib/settings";
import {
  createSiteAccessToken,
  SITE_ACCESS_COOKIE,
  SITE_ACCESS_TTL_SECONDS,
} from "@/lib/siteAccess";

export async function verifyPasscode(formData: FormData) {
  const passcode = String(formData.get("passcode") ?? "").trim();
  const nextPath = String(formData.get("next") ?? "/");
  const safeNext = nextPath.startsWith("/") ? nextPath : "/";

  const expected = await getSetting("site_passcode");

  if (!expected || passcode !== expected) {
    redirect(`/access?error=1&next=${encodeURIComponent(safeNext)}`);
  }

  const token = await createSiteAccessToken();
  const cookieStore = await cookies();
  cookieStore.set(SITE_ACCESS_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SITE_ACCESS_TTL_SECONDS,
  });

  redirect(safeNext);
}
