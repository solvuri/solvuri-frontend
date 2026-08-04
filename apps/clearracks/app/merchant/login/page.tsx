"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { decodeToken, login, setAuthToken } from "@repo/api-client";
import { clearracksApi } from "@/lib/api";

const MERCHANT_ROLES = new Set(["Merchant", "MerchantAgent"]);

export default function MerchantLoginPage() {
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
      const result = await login(clearracksApi, email, password);
      if (result.requiresOtp || !result.token) {
        setError("This account isn't a merchant account.");
        return;
      }
      const payload = decodeToken(result.token);
      if (!payload || !MERCHANT_ROLES.has(payload.appRole)) {
        setError("This account isn't a merchant account.");
        return;
      }
      setAuthToken(result.token);
      router.push("/merchant/settings");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-zinc-50 flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-white border rounded-2xl p-10">
        <div className="text-center mb-10">
          <h1 className="text-2xl font-black text-zinc-900">
            Merchant Portal
          </h1>
          <p className="text-zinc-500 mt-2 text-sm">
            Sign in to manage your store settings
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="email"
            placeholder="Work Email"
            className="w-full border rounded-lg p-3 text-sm outline-none focus:border-blue-600 bg-zinc-50"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full border rounded-lg p-3 text-sm outline-none focus:border-blue-600 bg-zinc-50"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {error && <p className="text-sm text-red-600">{error}</p>}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-blue-700 text-white py-3 rounded-lg font-bold cursor-pointer hover:bg-blue-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "Signing in..." : "Sign In"}
          </button>
        </form>
      </div>
    </main>
  );
}
