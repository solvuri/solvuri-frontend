"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";

export interface NavLink {
  label: string;
  href: string;
}

export interface NavbarCta {
  label: string;
  href: string;
  external?: boolean;
}

export interface NavbarProps {
  logo: React.ReactNode;
  links: NavLink[];
  cta?: NavbarCta;
  /** "floating": pill nav with a working mobile menu (SOLVURI brand).
   *  "sticky": full-width bordered header, no mobile menu (ClearRacks brand). */
  variant?: "floating" | "sticky";
}

export function Navbar({ logo, links, cta, variant = "sticky" }: NavbarProps) {
  return variant === "floating" ? (
    <FloatingNavbar logo={logo} links={links} cta={cta} />
  ) : (
    <StickyNavbar logo={logo} links={links} cta={cta} />
  );
}

function FloatingNavbar({
  logo,
  links,
  cta,
}: Pick<NavbarProps, "logo" | "links" | "cta">) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <nav className="flex items-center justify-between mt-4 mx-auto max-w-300 py-2 px-4 rounded-full border border-primary/15 bg-background/55 backdrop-blur-sm relative z-50">
        <Link href="/" className="text-lg font-bold tracking-tighter text-text ml-2">
          {logo}
        </Link>

        <div className="hidden md:flex gap-8 text-sm text-muted">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="hover:text-primary transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </div>

        {cta && (
          <div className="hidden md:block">
            <Link href={cta.href}>
              <span className="inline-block text-background bg-accent font-bold px-5 py-2 rounded-full">
                {cta.label}
              </span>
            </Link>
          </div>
        )}

        <button
          aria-label={isOpen ? "Close menu" : "Open menu"}
          className="md:hidden text-text p-2"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X /> : <Menu />}
        </button>
      </nav>

      {isOpen && (
        <div className="md:hidden absolute top-20 left-4 right-4 bg-surface p-6 rounded-2xl border border-primary/15 z-40 flex flex-col gap-4 text-center">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-text text-lg py-2"
              onClick={() => setIsOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          {cta && (
            <Link href={cta.href} onClick={() => setIsOpen(false)}>
              <span className="block w-full bg-accent text-background font-bold py-3 rounded-full mt-2">
                {cta.label}
              </span>
            </Link>
          )}
        </div>
      )}
    </>
  );
}

function StickyNavbar({
  logo,
  links,
  cta,
}: Pick<NavbarProps, "logo" | "links" | "cta">) {
  return (
    <header className="sticky top-0 z-50 w-full bg-brand-surface/80 backdrop-blur-md border-b border-brand-border/60 shadow-sm transition-all duration-200">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 group outline-none">
          {logo}
        </Link>

        <nav className="hidden md:flex items-center gap-8 text-xs uppercase font-bold tracking-wider text-brand-muted">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="hover:text-brand-primary transition-colors duration-200"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {cta && (
          <div className="flex items-center gap-4">
            <Link
              href={cta.href}
              target={cta.external ? "_blank" : undefined}
              rel={cta.external ? "noopener noreferrer" : undefined}
              className="text-xs font-bold tracking-wider text-brand-primary border-2 border-brand-primary hover:bg-brand-primary hover:text-white uppercase px-4 py-2 rounded-lg transition-all duration-200"
            >
              {cta.label}
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}
