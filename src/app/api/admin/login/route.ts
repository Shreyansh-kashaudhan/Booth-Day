import { NextResponse } from "next/server";
import { adminCookieHeader } from "@/lib/admin";

export async function POST(request: Request) {
  const body = await request.json();
  const password = typeof body.password === "string" ? body.password : "";
  if (password !== (process.env.ADMIN_PASSWORD ?? "arcade")) {
    return NextResponse.json({ error: "Wrong password" }, { status: 401 });
  }
  const cookie = adminCookieHeader();
  const res = NextResponse.json({ ok: true });
  res.cookies.set(cookie.name, cookie.value, cookie.options);
  return res;
}

export async function DELETE() {
  const res = NextResponse.json({ ok: true });
  res.cookies.set("arcade_admin", "", { path: "/", maxAge: 0 });
  return res;
}
