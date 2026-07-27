"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@repo/ui";
import { BackgroundGrid } from "../../components/shared/BackGroundGrid";

const REASONS = [
  { value: "general", label: "General Inquiry" },
  { value: "super-license", label: "Super License" },
  { value: "support", label: "Support" },
  { value: "partnership", label: "Partnership" },
];

function isValidReason(value: string | null): value is string {
  return REASONS.some((r) => r.value === value);
}

export const ContactForm = () => {
  const searchParams = useSearchParams();
  const rawReason = searchParams.get("reason");
  const moduleOfInterest = searchParams.get("module");

  const [formData, setFormData] = useState({
    name: "",
    company: "",
    email: "",
    reason: isValidReason(rawReason) ? rawReason : "general",
    message: moduleOfInterest
      ? `I'm interested in the ${moduleOfInterest} module.`
      : "",
  });
  const [status, setStatus] = useState<"idle" | "loading" | "success">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    // Placeholder — no contact-form backend exists yet. Swap this for a
    // real POST (e.g. via @repo/api-client's webApi) once one does; the
    // form/UI flow around it doesn't need to change.
    await new Promise((resolve) => setTimeout(resolve, 600));
    setStatus("success");
  };

  if (status === "success") {
    return (
      <main className="bg-[#0F0E2A] min-h-screen pt-20">
        <BackgroundGrid>
          <div className="max-w-xl mx-auto px-6 py-12">
            <div className="bg-[#0F0E2A]/50 border border-[#7C6EFF]/20 p-8 md:p-10 rounded-3xl backdrop-blur-sm text-center">
              <h1 className="text-4xl font-bebas text-white mb-4">
                Message Sent
              </h1>
              <p className="text-[#9896B8]">
                Thanks for reaching out — we&apos;ll get back to you soon.
              </p>
            </div>
          </div>
        </BackgroundGrid>
      </main>
    );
  }

  return (
    <main className="bg-[#0F0E2A] min-h-screen pt-20">
      <BackgroundGrid>
        <div className="max-w-xl mx-auto px-6 py-12">
          <div className="bg-[#0F0E2A]/50 border border-[#7C6EFF]/20 p-8 md:p-10 rounded-3xl backdrop-blur-sm">
            <h1 className="text-4xl font-bebas text-white mb-2">
              Get in Touch
            </h1>
            <p className="text-[#9896B8] mb-8">
              Tell us what you need and we&apos;ll route it to the right people.
            </p>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label
                  htmlFor="reason"
                  className="block text-[#9896B8] text-sm mb-2"
                >
                  Reason for contact
                </label>
                <select
                  id="reason"
                  className="w-full bg-[#16153D] border border-[#7C6EFF]/20 p-4 rounded-xl text-white outline-none focus:border-[#C8D400]"
                  value={formData.reason}
                  onChange={(e) =>
                    setFormData({ ...formData, reason: e.target.value })
                  }
                >
                  {REASONS.map((r) => (
                    <option key={r.value} value={r.value}>
                      {r.label}
                    </option>
                  ))}
                </select>
              </div>
              <input
                className="w-full bg-[#16153D] border border-[#7C6EFF]/20 p-4 rounded-xl text-white outline-none focus:border-[#C8D400]"
                placeholder="Full Name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
              />
              <input
                className="w-full bg-[#16153D] border border-[#7C6EFF]/20 p-4 rounded-xl text-white outline-none focus:border-[#C8D400]"
                placeholder="Company Name"
                value={formData.company}
                onChange={(e) =>
                  setFormData({ ...formData, company: e.target.value })
                }
              />
              <input
                type="email"
                className="w-full bg-[#16153D] border border-[#7C6EFF]/20 p-4 rounded-xl text-white outline-none focus:border-[#C8D400]"
                placeholder="Work Email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
              />
              <textarea
                className="w-full bg-[#16153D] border border-[#7C6EFF]/20 p-4 rounded-xl text-white h-32 outline-none focus:border-[#C8D400]"
                placeholder="Tell us about your project requirements..."
                value={formData.message}
                onChange={(e) =>
                  setFormData({ ...formData, message: e.target.value })
                }
              />

              <Button
                type="submit"
                variant="accent"
                disabled={status === "loading"}
                className="w-full bg-[#C8D400] text-[#0F0E2A] font-bold py-4 rounded-xl disabled:opacity-60"
              >
                {status === "loading" ? "Sending…" : "Send Message"}
              </Button>
            </form>
          </div>
        </div>
      </BackgroundGrid>
    </main>
  );
};
