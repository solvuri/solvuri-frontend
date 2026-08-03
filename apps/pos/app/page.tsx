import Link from "next/link";
import { Button } from "@repo/ui";

export default function LandingPage() {
  return (
    <main className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-surface border border-primary/15 p-10 rounded-3xl text-center">
        <h1 className="text-3xl font-bebas text-text">SOLVURI POS</h1>
        <p className="text-muted mt-2">
          In-person register for Solvuri POS tenants.
        </p>
        <p className="text-muted text-sm mt-6">
          Each tenant reaches their register at{" "}
          <span className="text-accent">
            &lt;subdomain&gt;.solvuripos.xyz
          </span>{" "}
          (or <span className="text-accent">&lt;subdomain&gt;.localhost:3003</span>{" "}
          in development).
        </p>
        <Link href="/register/demo" className="inline-block mt-8">
          <Button variant="accent">Open Demo Register</Button>
        </Link>
      </div>
    </main>
  );
}
