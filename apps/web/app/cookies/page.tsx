// apps/web/app/cookies/page.tsx
import type { Metadata } from "next";
import { LegalPage } from "../../components/shared/LegalPage";

export const metadata: Metadata = {
  title: "Cookie Policy | Solvuri",
  description: "Solvuri's cookie policy (draft, pending legal review).",
};

export default function CookiesPage() {
  return (
    <LegalPage
      title="Cookie Policy"
      sections={[
        {
          heading: "What are cookies",
          body: "Cookies are small text files stored on your device that help websites remember information about your visit.",
        },
        {
          heading: "How we use cookies",
          body: "We use cookies to keep you signed in, remember your preferences, and understand how our sites are used so we can improve them.",
        },
        {
          heading: "Types of cookies we use",
          body: "Essential cookies: required for our sites to function properly.\nPreference cookies: remember choices you've made.\nAnalytics cookies: help us understand usage patterns in aggregate.",
        },
        {
          heading: "Managing cookies",
          body: "Most browsers let you control cookies through their settings. Blocking some cookies may impact the functionality of our sites.",
        },
        {
          heading: "Contact us",
          body: "Questions about this policy can be sent to hello@solvuri.com.",
        },
      ]}
    />
  );
}
