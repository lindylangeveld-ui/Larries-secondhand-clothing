import { NextRequest, NextResponse } from "next/server";
import { createSession, isAllowedAdmin, verifyLoginToken } from "@/lib/auth";

export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get("token");
  const email = token ? await verifyLoginToken(token) : null;

  if (!email || !isAllowedAdmin(email)) {
    return NextResponse.redirect(new URL("/admin/login?error=1", request.url));
  }

  await createSession(email);
  return NextResponse.redirect(new URL("/admin", request.url));
}
