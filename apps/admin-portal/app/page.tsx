"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@repo/ui";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      setError("Enter both your email and password.");
      return;
    }
    setError("");
    setIsSubmitting(true);

    // Stand-in for real credential verification (e.g. NextAuth, Supabase,
    // Clerk) — sets the same placeholder cookie proxy.ts checks, so the
    // submit -> verify -> cookie -> redirect -> gated-route shape is
    // already correct and only the verification step needs replacing.
    console.log("Login attempt:", { email, password });
    document.cookie = "solvuri_admin_session=placeholder; path=/";
    router.push("/dashboard");
  };

  return (
    <main className="min-h-screen bg-background flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-surface border border-primary/15 p-10 rounded-3xl backdrop-blur-sm">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bebas text-text">SOLVURI ADMIN</h1>
          <p className="text-muted mt-2">
            Sign in to manage your infrastructure
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <input
            type="email"
            placeholder="Work Email"
            className="w-full bg-background border border-primary/20 p-4 rounded-xl text-text outline-none focus:border-accent"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full bg-background border border-primary/20 p-4 rounded-xl text-text outline-none focus:border-accent"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {error && <p className="text-sm text-rose-400">{error}</p>}

          <Button
            type="submit"
            variant="accent"
            disabled={isSubmitting}
            className="w-full font-bold py-4 rounded-xl disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "Signing in..." : "Sign In"}
          </Button>
        </form>

        <p className="text-center text-muted text-sm mt-8">
          Forgot your credentials?{" "}
          <span className="text-accent cursor-pointer">Contact Support</span>
        </p>
      </div>
    </main>
  );
}
