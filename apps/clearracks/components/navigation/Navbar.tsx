import Link from "next/link";
import Image from "next/image";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full bg-brand-surface/80 backdrop-blur-md border-b border-brand-border/60 shadow-sm transition-all duration-200">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Left Side: Brand Logo (Fully Clickable to Home) */}
        <Link href="/" className="flex items-center gap-3 group outline-none">
          {/* Logo Mark Container */}
          {/* <div className="relative h-9 w-9 bg-white border border-brand-border rounded-lg flex items-center justify-center p-0 shadow-sm transition-all duration-200 group-hover:border-brand-primary/40 group-hover:shadow-md group-hover:shadow-brand-primary/5"> */}
          <Image
            src="/images/logo.png"
            alt="ClearRack Logo Mark"
            width={80}
            height={80}
            priority
            className="object-contain"
          />
          {/* </div> */}
        </Link>

        {/* Center: Added Navigation Links */}
        <nav className="hidden md:flex items-center gap-8 text-xs uppercase font-bold tracking-wider text-brand-muted">
          <Link
            href="#features"
            className="hover:text-brand-primary transition-colors duration-200"
          >
            Features
          </Link>
          <Link
            href="#solutions"
            className="hover:text-brand-primary transition-colors duration-200"
          >
            Solutions
          </Link>
          <Link
            href="#changelog"
            className="hover:text-brand-primary transition-colors duration-200"
          >
            Changelog
          </Link>
          <Link
            href="#docs"
            className="hover:text-brand-primary transition-colors duration-200"
          >
            Developer API
          </Link>
        </nav>

        {/* Right Side: Primary CTA Action */}
        <div className="flex items-center gap-4">
          <Link
            href="https://test-store.clearrack.xyz"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-bold tracking-wider text-brand-primary border-2 border-brand-primary hover:bg-brand-primary hover:text-white uppercase px-4 py-2 rounded-lg transition-all duration-200"
          >
            Merchant Console
          </Link>
        </div>
      </div>
    </header>
  );
}
