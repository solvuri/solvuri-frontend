// apps/web/app/contact/page.tsx
import type { Metadata } from "next";
import { Suspense } from "react";
import { ContactForm } from "./ContactForm";

export const metadata: Metadata = {
  title: "Contact | Solvuri",
  description:
    "Get in touch with Solvuri for general inquiries, Super License requests, support, or partnership opportunities.",
};

export default function ContactPage() {
  return (
    <Suspense fallback={null}>
      <ContactForm />
    </Suspense>
  );
}
