import { cookies } from "next/headers";
import { createHmac } from "node:crypto";

const COOKIE = "arcade_admin";

function token(): string {
  const secret = process.env.ADMIN_PASSWORD ?? "arcade";
  return createHmac("sha256", secret).update("booth-admin").digest("hex");
}

export async function isAdmin(): Promise<boolean> {
  const jar = await cookies();
  return jar.get(COOKIE)?.value === token();
}

export function adminCookieHeader(): { name: string; value: string; options: object } {
  return {
    name: COOKIE,
    value: token(),
    options: {
      httpOnly: true,
      sameSite: "lax" as const,
      path: "/",
      maxAge: 60 * 60 * 12,
    },
  };
}

export const ADMIN_COOKIE = COOKIE;
