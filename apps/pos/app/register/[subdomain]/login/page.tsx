"use client";

import { use, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@repo/ui";
import { decodeToken, login, setAuthToken } from "@repo/api-client";
import { posApi } from "@/lib/api";

const CASHIER_ROLES = new Set(["Merchant", "MerchantAgent"]);

export default function LoginPage({
  params,
}: {
  params: Promise<{ subdomain: string }>;
}) {
  const { subdomain } = use(params);
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      setError("Enter both your email and password.");
      return;
    }
    setError("");
    setIsSubmitting(true);

    try {
      const result = await login(posApi, email, password);
      if (result.requiresOtp || !result.token) {
        setError("This account isn't a cashier account.");
        return;
      }
      const payload = decodeToken(result.token);
      if (!payload || !CASHIER_ROLES.has(payload.appRole)) {
        setError("This account isn't a cashier account.");
        return;
      }
      setAuthToken(result.token);
      router.push("/");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-background flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-surface border border-primary/15 p-10 rounded-3xl">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bebas text-text">POS Register</h1>
          <p className="text-muted mt-2">
            Sign in to open the till for{" "}
            <span className="text-text font-medium">{subdomain}</span>
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
      </div>
    </main>
  );
}
