import { NextRequest, NextResponse } from "next/server";
import { createSession, isAllowedAdmin, verifyLoginToken } from "@/lib/auth";

export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get("token");
  const email = token ? await verifyLoginToken(token) : null;
  const baseUrl = process.env.APP_URL || request.url;

  if (!email || !isAllowedAdmin(email)) {
    return NextResponse.redirect(new URL("/admin/login?error=1", baseUrl));
  }

  await createSession(email);
  return NextResponse.redirect(new URL("/admin", baseUrl));
}
