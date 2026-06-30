import Link from "next/link";
import { Button } from "@repo/ui";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#0F0E2A] flex items-center justify-center relative overflow-hidden px-10">
      {/* Background Ambience */}
      <div className="absolute w-150 h-150 rounded-full bg-[#7C6EFF] blur-[120px] opacity-10"></div>

      <div className="text-center relative z-10 max-w-lg">
        <h1 className="font-bebas text-[120px] leading-none text-white mb-4">
          404
        </h1>
        <h2 className="text-3xl font-bold text-white mb-6">Page Not Found</h2>
        <p className="text-[#9896B8] mb-10 leading-relaxed">
          The module or page you are looking for doesn't exist or has been
          moved. Let's get you back to the platform.
        </p>

        <Link href="/">
          <Button
            variant="accent"
            className="bg-[#C8D400] text-[#0F0E2A] px-10 py-3 rounded-full text-lg font-bold hover:bg-[#AAB800] transition-colors"
          >
            Return Home
          </Button>
        </Link>
      </div>
    </div>
  );
}
