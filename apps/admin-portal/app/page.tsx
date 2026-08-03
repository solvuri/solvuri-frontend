"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@repo/ui";
import { decodeToken, login, setAuthToken, verifyOtp } from "@repo/api-client";
import { adminApi } from "../lib/api";

const ADMIN_ROLES = new Set(["Admin", "SuperAdmin"]);

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [awaitingOtp, setAwaitingOtp] = useState(false);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const applyToken = (token: string) => {
    const payload = decodeToken(token);
    if (!payload || !ADMIN_ROLES.has(payload.appRole)) {
      setError("This account isn't a platform admin.");
      return;
    }
    setAuthToken(token);
    router.push("/dashboard");
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      setError("Enter both your email and password.");
      return;
    }
    setError("");
    setIsSubmitting(true);

    try {
      const result = await login(adminApi, email, password);
      if (result.requiresOtp) {
        setAwaitingOtp(true);
      } else if (result.token) {
        applyToken(result.token);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!otp) {
      setError("Enter the OTP sent to your email/phone.");
      return;
    }
    setError("");
    setIsSubmitting(true);

    try {
      const { token } = await verifyOtp(adminApi, email, otp);
      applyToken(token);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Verification failed.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-background flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-surface border border-primary/15 p-10 rounded-3xl backdrop-blur-sm">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bebas text-text">SOLVURI ADMIN</h1>
          <p className="text-muted mt-2">
            {awaitingOtp
              ? "Enter the code sent to your email and phone"
              : "Sign in to manage your infrastructure"}
          </p>
        </div>

        {!awaitingOtp ? (
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
        ) : (
          <form onSubmit={handleVerifyOtp} className="space-y-6">
            <input
              type="text"
              inputMode="numeric"
              placeholder="6-digit code"
              className="w-full bg-background border border-primary/20 p-4 rounded-xl text-text outline-none focus:border-accent tracking-widest text-center"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
            />

            {error && <p className="text-sm text-rose-400">{error}</p>}

            <Button
              type="submit"
              variant="accent"
              disabled={isSubmitting}
              className="w-full font-bold py-4 rounded-xl disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Verifying..." : "Verify"}
            </Button>
          </form>
        )}

        <p className="text-center text-muted text-sm mt-8">
          Forgot your credentials?{" "}
          <span className="text-accent cursor-pointer">Contact Support</span>
        </p>
      </div>
    </main>
  );
}
