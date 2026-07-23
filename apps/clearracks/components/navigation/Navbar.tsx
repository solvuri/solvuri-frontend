import Image from "next/image";
import { Navbar as SharedNavbar } from "@repo/ui";

const links = [
  { label: "Features", href: "#features" },
  { label: "Solutions", href: "#solutions" },
  { label: "Changelog", href: "#changelog" },
  { label: "Developer API", href: "#docs" },
];

export default function Navbar() {
  return (
    <SharedNavbar
      variant="sticky"
      logo={
        <Image
          src="/images/logo.png"
          alt="ClearRack Logo Mark"
          width={80}
          height={80}
          priority
          className="object-contain"
        />
      }
      links={links}
      cta={{
        label: "Merchant Console",
        href: "https://test-store.clearrack.xyz",
        external: true,
      }}
    />
  );
}
