"use client";

import { useState } from "react";

import { Button } from "@repo/ui";
import { BackgroundGrid } from "../../components/shared/BackGroundGrid";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    company: "",
    email: "",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
  };

  return (
    <main className="bg-[#0F0E2A] min-h-screen pt-20">
      <BackgroundGrid>
        <div className="max-w-xl mx-auto px-6 py-12">
          {/* This is the bordered container */}
          <div className="bg-[#0F0E2A]/50 border border-[#7C6EFF]/20 p-8 md:p-10 rounded-3xl backdrop-blur-sm">
            <h1 className="text-4xl font-bebas text-white mb-2">
              Request a Super License
            </h1>
            <p className="text-[#9896B8] mb-8">
              Tell us about your team and your infrastructure needs.
            </p>

            <form onSubmit={handleSubmit} className="space-y-6">
              <input
                className="w-full bg-[#16153D] border border-[#7C6EFF]/20 p-4 rounded-xl text-white outline-none focus:border-[#C8D400]"
                placeholder="Full Name"
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
              />
              <input
                className="w-full bg-[#16153D] border border-[#7C6EFF]/20 p-4 rounded-xl text-white outline-none focus:border-[#C8D400]"
                placeholder="Company Name"
                onChange={(e) =>
                  setFormData({ ...formData, company: e.target.value })
                }
              />
              <input
                type="email"
                className="w-full bg-[#16153D] border border-[#7C6EFF]/20 p-4 rounded-xl text-white outline-none focus:border-[#C8D400]"
                placeholder="Work Email"
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
              />
              <textarea
                className="w-full bg-[#16153D] border border-[#7C6EFF]/20 p-4 rounded-xl text-white h-32 outline-none focus:border-[#C8D400]"
                placeholder="Tell us about your project requirements..."
                onChange={(e) =>
                  setFormData({ ...formData, message: e.target.value })
                }
              />

              <Button
                type="submit"
                variant="accent"
                className="w-full bg-[#C8D400] text-[#0F0E2A] font-bold py-4 rounded-xl"
              >
                Send Request
              </Button>
            </form>
          </div>
        </div>
      </BackgroundGrid>
    </main>
  );
}
