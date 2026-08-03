import Link from "next/link";

export default function RegisterHeader({ subdomain }: { subdomain: string }) {
  const label = subdomain.charAt(0).toUpperCase() + subdomain.slice(1);

  return (
    <header className="h-16 border-b border-input-bg flex items-center justify-between px-8">
      <h1 className="font-bebas text-xl text-text tracking-widest">
        {label} — Register
      </h1>
      <Link
        href={`/register/${subdomain}/sales`}
        className="text-sm text-muted hover:text-text"
      >
        Sales History
      </Link>
    </header>
  );
}
