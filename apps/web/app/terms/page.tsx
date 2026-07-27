// apps/web/app/terms/page.tsx
import type { Metadata } from "next";
import { LegalPage } from "../../components/shared/LegalPage";

export const metadata: Metadata = {
  title: "Terms of Service | Solvuri",
  description: "Solvuri's terms of service (draft, pending legal review).",
};

export default function TermsPage() {
  return (
    <LegalPage
      title="Terms of Service"
      sections={[
        {
          heading: "Acceptance of terms",
          body: "By accessing or using Solvuri's products and services, you agree to be bound by these terms. If you're using Solvuri on behalf of a business, you're agreeing on that business's behalf.",
        },
        {
          heading: "Use of service",
          body: "You agree to use Solvuri's products only for lawful purposes and in a way that doesn't infringe the rights of, or restrict or inhibit the use of, our services by any third party.",
        },
        {
          heading: "Accounts",
          body: "You're responsible for maintaining the security of your account credentials and for all activity that occurs under your account.",
        },
        {
          heading: "Intellectual property",
          body: "Solvuri retains all rights to its platform, modules, and underlying infrastructure. Content you create or upload using our products remains yours.",
        },
        {
          heading: "Limitation of liability",
          body: 'Solvuri\'s products are provided on an "as is" basis. To the maximum extent permitted by law, Solvuri is not liable for indirect, incidental, or consequential damages arising from use of our services.',
        },
        {
          heading: "Termination",
          body: "Either party may terminate service under the terms of the applicable service agreement. We reserve the right to suspend access for violations of these terms.",
        },
        {
          heading: "Governing law",
          body: "These terms are governed by the laws of the jurisdiction in which Solvuri is incorporated, without regard to conflict of law principles.",
        },
        {
          heading: "Contact us",
          body: "Questions about these terms can be sent to hello@solvuri.com.",
        },
      ]}
    />
  );
}
