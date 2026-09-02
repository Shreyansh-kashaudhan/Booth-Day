"use client";

import { useState } from "react";

export function AdminLoginClient() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    if (!res.ok) {
      setError("Wrong password");
      return;
    }
    window.location.reload();
  }

  return (
    <form onSubmit={onSubmit} className="mx-auto mt-16 flex max-w-sm flex-col gap-4">
      <h1 className="font-display text-3xl">Question sets</h1>
      <p className="text-sm text-cream/60">Password is ADMIN_PASSWORD in .env (default: arcade)</p>
      <input
        className="arcade-input"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
      />
      {error ? <p className="text-magenta">{error}</p> : null}
      <button className="arcade-btn arcade-btn-gold py-3" type="submit">
        Enter
      </button>
    </form>
  );
}
