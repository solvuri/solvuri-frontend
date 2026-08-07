"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@repo/ui";
import { submitTenantRequest } from "@repo/api-client";
import { BackgroundGrid } from "../../components/shared/BackGroundGrid";
import { webApi } from "../../lib/api";

const REASONS = [
  { value: "general", label: "General Inquiry" },
  { value: "super-license", label: "Super License" },
  { value: "support", label: "Support" },
  { value: "partnership", label: "Partnership" },
];

const SYSTEMS = ["Clearack", "POS"];

function isValidReason(value: string | null): value is string {
  return REASONS.some((r) => r.value === value);
}

const FIELD_CLASS =
  "w-full bg-[#16153D] border border-[#7C6EFF]/20 p-4 rounded-xl text-white outline-none focus:border-[#C8D400]";

export const ContactForm = () => {
  const searchParams = useSearchParams();
  const rawReason = searchParams.get("reason");
  const moduleOfInterest = searchParams.get("module");
  const initialReason = isValidReason(rawReason) ? rawReason : "general";

  // Generic inquiry fields — no backend endpoint exists for these yet, so
  // submitting one still just simulates success (see handleGenericSubmit).
  const [formData, setFormData] = useState({
    name: "",
    company: "",
    email: "",
    reason: initialReason,
    message: moduleOfInterest
      ? `I'm interested in the ${moduleOfInterest} module.`
      : "",
  });

  // Super License fields — these map onto the real, documented
  // POST /api/tenant-requests/request-license request body.
  const [licenseData, setLicenseData] = useState({
    firstName: "",
    middleName: "",
    lastName: "",
    brandName: "",
    email: "",
    phoneNumber: "",
    businessDescription: "",
    requestedSystems: [] as string[],
  });

  const [status, setStatus] = useState<"idle" | "loading" | "success">("idle");
  const [error, setError] = useState<string | null>(null);
  const isLicense = formData.reason === "super-license";

  const toggleSystem = (system: string) => {
    setLicenseData((prev) => ({
      ...prev,
      requestedSystems: prev.requestedSystems.includes(system)
        ? prev.requestedSystems.filter((s) => s !== system)
        : [...prev.requestedSystems, system],
    }));
  };

  const handleLicenseSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setStatus("loading");
    try {
      await submitTenantRequest(webApi, {
        firstName: licenseData.firstName,
        middleName: licenseData.middleName || undefined,
        lastName: licenseData.lastName,
        brandName: licenseData.brandName,
        email: licenseData.email,
        phoneNumber: licenseData.phoneNumber,
        businessDescription: licenseData.businessDescription,
        requestedSystems: licenseData.requestedSystems.join(", "),
      });
      setStatus("success");
    } catch (err) {
      setStatus("idle");
      setError(
        err instanceof Error ? err.message : "Failed to submit request.",
      );
    }
  };

  const handleGenericSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    // Placeholder — no general-inquiry backend endpoint exists yet, unlike
    // the Super License path above which hits the real
    // /api/tenant-requests/request-license endpoint.
    await new Promise((resolve) => setTimeout(resolve, 600));
    setStatus("success");
  };

  if (status === "success") {
    return (
      <main className="bg-[#0F0E2A] min-h-screen pt-20">
        <BackgroundGrid>
          <div className="max-w-xl mx-auto px-6 py-12">
            <div className="bg-[#0F0E2A]/50 border border-[#7C6EFF]/20 p-8 md:p-10 rounded-3xl backdrop-blur-sm text-center">
              <h1 className="text-4xl font-bebas text-white mb-4">
                {isLicense ? "Request Submitted" : "Message Sent"}
              </h1>
              <p className="text-[#9896B8]">
                {isLicense
                  ? "Thanks for applying — our team will review your request and follow up by email."
                  : "Thanks for reaching out — we'll get back to you soon."}
              </p>
            </div>
          </div>
        </BackgroundGrid>
      </main>
    );
  }

  return (
    <main className="bg-[#0F0E2A] min-h-screen pt-20">
      <BackgroundGrid>
        <div className="max-w-xl mx-auto px-6 py-12">
          <div className="bg-[#0F0E2A]/50 border border-[#7C6EFF]/20 p-8 md:p-10 rounded-3xl backdrop-blur-sm">
            <h1 className="text-4xl font-bebas text-white mb-2">
              Get in Touch
            </h1>
            <p className="text-[#9896B8] mb-8">
              Tell us what you need and we&apos;ll route it to the right people.
            </p>

            <div className="mb-6">
              <label htmlFor="reason" className="block text-[#9896B8] text-sm mb-2">
                Reason for contact
              </label>
              <select
                id="reason"
                className={FIELD_CLASS}
                value={formData.reason}
                onChange={(e) =>
                  setFormData({ ...formData, reason: e.target.value })
                }
              >
                {REASONS.map((r) => (
                  <option key={r.value} value={r.value}>
                    {r.label}
                  </option>
                ))}
              </select>
            </div>

            {isLicense ? (
              <form onSubmit={handleLicenseSubmit} className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <input
                    required
                    className={FIELD_CLASS}
                    placeholder="First Name"
                    value={licenseData.firstName}
                    onChange={(e) =>
                      setLicenseData({ ...licenseData, firstName: e.target.value })
                    }
                  />
                  <input
                    className={FIELD_CLASS}
                    placeholder="Middle Name (optional)"
                    value={licenseData.middleName}
                    onChange={(e) =>
                      setLicenseData({ ...licenseData, middleName: e.target.value })
                    }
                  />
                </div>
                <input
                  required
                  className={FIELD_CLASS}
                  placeholder="Last Name"
                  value={licenseData.lastName}
                  onChange={(e) =>
                    setLicenseData({ ...licenseData, lastName: e.target.value })
                  }
                />
                <input
                  required
                  className={FIELD_CLASS}
                  placeholder="Brand / Business Name"
                  value={licenseData.brandName}
                  onChange={(e) =>
                    setLicenseData({ ...licenseData, brandName: e.target.value })
                  }
                />
                <input
                  required
                  type="email"
                  className={FIELD_CLASS}
                  placeholder="Email"
                  value={licenseData.email}
                  onChange={(e) =>
                    setLicenseData({ ...licenseData, email: e.target.value })
                  }
                />
                <input
                  required
                  type="tel"
                  className={FIELD_CLASS}
                  placeholder="Phone Number"
                  value={licenseData.phoneNumber}
                  onChange={(e) =>
                    setLicenseData({ ...licenseData, phoneNumber: e.target.value })
                  }
                />
                <textarea
                  required
                  className={`${FIELD_CLASS} h-32`}
                  placeholder="Tell us about your business..."
                  value={licenseData.businessDescription}
                  onChange={(e) =>
                    setLicenseData({
                      ...licenseData,
                      businessDescription: e.target.value,
                    })
                  }
                />
                <div>
                  <p className="text-[#9896B8] text-sm mb-2">
                    Which systems are you interested in?
                  </p>
                  <div className="flex gap-6">
                    {SYSTEMS.map((system) => (
                      <label
                        key={system}
                        className="flex items-center gap-2 text-white text-sm"
                      >
                        <input
                          type="checkbox"
                          checked={licenseData.requestedSystems.includes(system)}
                          onChange={() => toggleSystem(system)}
                        />
                        {system}
                      </label>
                    ))}
                  </div>
                </div>

                {error && <p className="text-red-400 text-sm">{error}</p>}

                <Button
                  type="submit"
                  variant="accent"
                  disabled={status === "loading"}
                  className="w-full bg-[#C8D400] text-[#0F0E2A] font-bold py-4 rounded-xl disabled:opacity-60"
                >
                  {status === "loading" ? "Submitting…" : "Submit Request"}
                </Button>
              </form>
            ) : (
              <form onSubmit={handleGenericSubmit} className="space-y-6">
                <input
                  className={FIELD_CLASS}
                  placeholder="Full Name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                />
                <input
                  className={FIELD_CLASS}
                  placeholder="Company Name"
                  value={formData.company}
                  onChange={(e) =>
                    setFormData({ ...formData, company: e.target.value })
                  }
                />
                <input
                  type="email"
                  className={FIELD_CLASS}
                  placeholder="Work Email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                />
                <textarea
                  className={`${FIELD_CLASS} h-32`}
                  placeholder="Tell us about your project requirements..."
                  value={formData.message}
                  onChange={(e) =>
                    setFormData({ ...formData, message: e.target.value })
                  }
                />

                <Button
                  type="submit"
                  variant="accent"
                  disabled={status === "loading"}
                  className="w-full bg-[#C8D400] text-[#0F0E2A] font-bold py-4 rounded-xl disabled:opacity-60"
                >
                  {status === "loading" ? "Sending…" : "Send Message"}
                </Button>
              </form>
            )}
          </div>
        </div>
      </BackgroundGrid>
    </main>
  );
};
