import { SignJWT, jwtVerify } from "jose";

export const SITE_ACCESS_COOKIE = "site_access";
export const SITE_ACCESS_TTL_SECONDS = 60 * 60 * 24 * 180; // 180 days

function getSecret() {
  const secret = process.env.AUTH_SECRET;
  if (!secret) throw new Error("AUTH_SECRET is not set");
  return new TextEncoder().encode(secret);
}

export async function createSiteAccessToken(): Promise<string> {
  return new SignJWT({ purpose: "site-access" })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${SITE_ACCESS_TTL_SECONDS}s`)
    .sign(getSecret());
}

export async function verifySiteAccessToken(token: string): Promise<boolean> {
  try {
    const { payload } = await jwtVerify(token, getSecret());
    return payload.purpose === "site-access";
  } catch {
    return false;
  }
}
