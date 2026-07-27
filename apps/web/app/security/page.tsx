// apps/web/app/security/page.tsx
import type { Metadata } from "next";
import { LegalPage } from "../../components/shared/LegalPage";

export const metadata: Metadata = {
  title: "Security | Solvuri",
  description: "How Solvuri approaches security (draft, pending legal review).",
};

export default function SecurityPage() {
  return (
    <LegalPage
      title="Security"
      sections={[
        {
          heading: "Our approach",
          body: "Security is a shared responsibility across the infrastructure layer every Solvuri module runs on. We aim to build it in at the platform level rather than leaving it to each module to solve independently.",
        },
        {
          heading: "Data protection",
          body: "We use industry-standard encryption for data in transit. Access to production systems is restricted to authorized personnel.",
        },
        {
          heading: "Access controls",
          body: "Each tenant's data is isolated from every other tenant's on the platform. Internal access to customer data is limited to what's necessary to operate and support the service.",
        },
        {
          heading: "Incident response",
          body: "We aim to identify, contain, and communicate about security incidents promptly should they occur.",
        },
        {
          heading: "Responsible disclosure",
          body: "If you believe you've found a security vulnerability in any Solvuri product, please report it to hello@solvuri.com rather than disclosing it publicly. We'll acknowledge reports and work with you on a resolution timeline.",
        },
      ]}
    />
  );
}
