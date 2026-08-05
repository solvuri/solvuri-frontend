// apps/web/app/privacy/page.tsx
import type { Metadata } from "next";
import { LegalPage } from "../../components/shared/LegalPage";

export const metadata: Metadata = {
  title: "Privacy Policy | Solvuri",
  description: "Solvuri's privacy policy (draft, pending legal review).",
};

export default function PrivacyPage() {
  return (
    <LegalPage
      title="Privacy Policy"
      sections={[
        {
          heading: "Information we collect",
          body: "When you use a Solvuri-powered storefront or interact with our own sites, we may collect information you provide directly (such as your name, email address, and company name when you contact us) and information collected automatically (such as pages visited and general usage patterns).",
        },
        {
          heading: "How we use it",
          body: "We use the information we collect to operate and improve our products, respond to inquiries, and communicate with you about your account or requests. We do not sell personal information to third parties.",
        },
        {
          heading: "Cookies",
          body: "We use cookies and similar technologies for essential site functionality and to understand how our sites are used. See our Cookie Policy for more detail.",
        },
        {
          heading: "Third-party services",
          body: "Some functionality may rely on third-party service providers (such as payment processors on modules like Clearack or POS). Those providers have their own privacy practices governing the data they process.",
        },
        {
          heading: "Data retention",
          body: "We retain information for as long as necessary to provide our services and comply with legal obligations.",
        },
        {
          heading: "Your rights",
          body: "Depending on your location, you may have rights to access, correct, or delete your personal information. Contact us to make a request.",
        },
        {
          heading: "Contact us",
          body: "Questions about this policy can be sent to hello@solvuri.com.",
        },
      ]}
    />
  );
}
