"use client";

import { useState } from "react";
import { Button } from "@repo/ui";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Integrate your authentication logic (e.g., NextAuth, Supabase, Clerk)
    console.log("Login attempt:", { email, password });
  };

  return (
    <main className="min-h-screen bg-[#0F0E2A] flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-[#16153D] border border-[#7C6EFF]/15 p-10 rounded-3xl backdrop-blur-sm">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bebas text-white">SOLVURI ADMIN</h1>
          <p className="text-[#9896B8] mt-2">
            Sign in to manage your infrastructure
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <input
            type="email"
            placeholder="Work Email"
            className="w-full bg-[#0F0E2A] border border-[#7C6EFF]/20 p-4 rounded-xl text-white outline-none focus:border-[#C8D400]"
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full bg-[#0F0E2A] border border-[#7C6EFF]/20 p-4 rounded-xl text-white outline-none focus:border-[#C8D400]"
            onChange={(e) => setPassword(e.target.value)}
          />

          <Button
            type="submit"
            variant="accent"
            className="w-full bg-[#C8D400] text-[#0F0E2A] font-bold py-4 rounded-xl"
          >
            Sign In
          </Button>
        </form>

        <p className="text-center text-[#9896B8] text-sm mt-8">
          Forgot your credentials?{" "}
          <span className="text-[#C8D400] cursor-pointer">Contact Support</span>
        </p>
      </div>
    </main>
  );
}
