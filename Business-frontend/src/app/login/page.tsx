"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("test@example.com");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!email || !password) {
      setError("Enter your email and password.");
      return;
    }

    setLoading(true);
    try {
      const { token } = await api.post<{ token: string }>("/auth/login", { email, password });
      localStorage.setItem("opsly_token", token);
      router.push("/");
    } catch {
      setError("Couldn't sign in. Check your email and password.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex-1 flex items-center justify-center">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-[320px] bg-[var(--surface-1)] border border-[var(--border)] rounded-xl p-6"
      >
        <div className="flex items-center gap-2 mb-6">
          <div className="w-6 h-6 rounded-md bg-[var(--accent)]" />
          <span className="text-sm font-medium">Opsly</span>
        </div>

        <label className="block text-sm text-[var(--text-secondary)] mb-1.5" htmlFor="email">
          Email
        </label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full mb-4 px-3 py-2 rounded-[var(--radius)] bg-[var(--surface-2)] border border-[var(--border)] text-sm outline-none focus:border-[var(--accent)]"
        />

        <label className="block text-sm text-[var(--text-secondary)] mb-1.5" htmlFor="password">
          Password
        </label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full mb-2 px-3 py-2 rounded-[var(--radius)] bg-[var(--surface-2)] border border-[var(--border)] text-sm outline-none focus:border-[var(--accent)]"
        />

        {error && <p className="text-sm text-[var(--danger-fg)] mb-3">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full mt-3 py-2 rounded-[var(--radius)] bg-[var(--accent)] text-[var(--accent-fg)] text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-60"
        >
          {loading ? "Signing in…" : "Sign in"}
        </button>
      </form>
    </div>
  );
}
