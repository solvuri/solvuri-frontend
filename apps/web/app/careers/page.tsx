// apps/web/app/careers/page.tsx
import type { Metadata } from "next";
import { BackgroundGrid } from "../../components/shared/BackGroundGrid";

export const metadata: Metadata = {
  title: "Careers | Solvuri",
  description:
    "We're not actively hiring right now, but we're always interested in hearing from people who want to build infrastructure that scales.",
};

export default function CareersPage() {
  return (
    <main className="bg-[#0F0E2A] min-h-screen pt-20">
      <BackgroundGrid>
        <div className="max-w-4xl mx-auto px-6 py-12">
          <div className="text-[#C8D400] font-bold tracking-widest uppercase mb-6">
            Careers
          </div>
          <h1 className="text-5xl md:text-7xl font-bebas text-white mb-8 leading-tight">
            Help Build the <br />
            <span className="text-[#7C6EFF]">Engine, Not Just the App.</span>
          </h1>
          <p className="text-[#9896B8] text-xl mb-12 max-w-2xl">
            We care about getting the shared infrastructure right — the parts
            that every module and every brand running on Solvuri depends on —
            more than shipping any one surface fast and moving on.
          </p>

          <div className="bg-[#16153D] p-8 md:p-10 rounded-2xl border border-[#7C6EFF]/15">
            <h2 className="text-2xl font-bebas text-white mb-4">
              No open roles listed right now
            </h2>
            <p className="text-[#9896B8] leading-relaxed mb-6">
              We don&apos;t have specific positions posted here at the moment.
              If you want to work on infrastructure that a growing number of
              businesses run their storefronts, bookings, and reservations on,
              we&apos;d still like to hear from you.
            </p>
            <a
              href="mailto:hello@solvuri.com"
              className="text-[#C8D400] font-bold hover:underline"
            >
              hello@solvuri.com →
            </a>
          </div>
        </div>
      </BackgroundGrid>
    </main>
  );
}
