"use client";

import { useEffect, useState } from "react";
import {
  Feature,
  SystemCategory,
  TenantSummary,
  listFeatures,
  listSystemCategories,
  listTenants,
  registerTenant,
  setMerchantCategories,
  setMerchantFeatures,
} from "@repo/api-client";
import { Button, Input } from "@repo/ui";
import { adminApi } from "../../../lib/api";
import { StatusBadge } from "../../../components/StatusBadge";

const EMPTY_DETAILS = {
  firstName: "",
  middleName: "",
  lastName: "",
  brandName: "",
  businessDescription: "",
  email: "",
  phoneNumber: "",
  password: "",
  domainName: "",
};

export default function MerchantsPage() {
  const [tenants, setTenants] = useState<TenantSummary[] | null>(null);
  const [tenantsLoading, setTenantsLoading] = useState(true);
  const [tenantsError, setTenantsError] = useState("");

  const [categories, setCategories] = useState<SystemCategory[]>([]);
  const [features, setFeatures] = useState<Feature[]>([]);

  const [isOnboarding, setIsOnboarding] = useState(false);
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [details, setDetails] = useState(EMPTY_DETAILS);
  const [newTenantId, setNewTenantId] = useState<number | null>(null);
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<number[]>([]);
  const [featurePrices, setFeaturePrices] = useState<Record<number, string>>(
    {},
  );
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const loadDirectory = async () => {
    setTenantsLoading(true);
    setTenantsError("");
    // Independent fetches — a failure in one (e.g. GET /api/tenants) must
    // not prevent the others (needed for the onboarding wizard) from
    // loading. Promise.all would reject the whole batch on a single
    // failure; Promise.allSettled keeps them independent.
    const [tenantsResult, categoriesResult, featuresResult] =
      await Promise.allSettled([
        listTenants(adminApi),
        listSystemCategories(adminApi),
        listFeatures(adminApi),
      ]);

    if (tenantsResult.status === "fulfilled") {
      setTenants(tenantsResult.value);
    } else {
      setTenantsError(
        tenantsResult.reason instanceof Error
          ? tenantsResult.reason.message
          : "Couldn't load merchants.",
      );
    }
    if (categoriesResult.status === "fulfilled") {
      setCategories(categoriesResult.value);
    }
    if (featuresResult.status === "fulfilled") {
      setFeatures(featuresResult.value);
    }

    setTenantsLoading(false);
  };

  useEffect(() => {
    loadDirectory();
  }, []);

  const startOnboarding = () => {
    setDetails(EMPTY_DETAILS);
    setNewTenantId(null);
    setSelectedCategoryIds([]);
    setFeaturePrices({});
    setError("");
    setStep(1);
    setIsOnboarding(true);
  };

  const handleRegisterTenant = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);
    try {
      const result = await registerTenant(adminApi, {
        ...details,
        customMonthlyFee: null,
      });
      setNewTenantId(result.tenantId);
      setStep(2);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Registration failed.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleCategory = (id: number) => {
    setSelectedCategoryIds((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id],
    );
  };

  const handleSetCategories = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTenantId) return;
    if (selectedCategoryIds.length === 0) {
      setError("Select at least one category.");
      return;
    }
    setError("");
    setIsSubmitting(true);
    try {
      await setMerchantCategories(adminApi, newTenantId, selectedCategoryIds);
      setStep(3);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Couldn't set categories.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const availableFeatures = features.filter((f) =>
    selectedCategoryIds.includes(f.systemCategoryId),
  );

  const toggleFeaturePrice = (featureId: number, defaultPrice: number) => {
    setFeaturePrices((prev) => {
      const next = { ...prev };
      if (featureId in next) {
        delete next[featureId];
      } else {
        next[featureId] = String(defaultPrice);
      }
      return next;
    });
  };

  const handleSetFeatures = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTenantId) return;
    const selected = Object.entries(featurePrices).map(
      ([featureId, price]) => ({
        featureId: Number(featureId),
        monthlyPrice: Number(price) || 0,
      }),
    );
    if (selected.length === 0) {
      setError("Select at least one feature.");
      return;
    }
    setError("");
    setIsSubmitting(true);
    try {
      await setMerchantFeatures(adminApi, newTenantId, selected);
      setIsOnboarding(false);
      await loadDirectory();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Couldn't set features.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-4xl font-bebas text-text">Merchants</h1>
        {!isOnboarding && (
          <Button variant="accent" onClick={startOnboarding}>
            + Onboard Merchant
          </Button>
        )}
      </div>

      {isOnboarding ? (
        <div className="bg-surface rounded-2xl border border-primary/10 p-8 max-w-xl">
          <p className="text-xs uppercase tracking-widest text-muted mb-6">
            Step {step} of 3
          </p>

          {step === 1 && (
            <form onSubmit={handleRegisterTenant} className="space-y-4">
              <Input
                label="First Name"
                value={details.firstName}
                onChange={(e) =>
                  setDetails({ ...details, firstName: e.target.value })
                }
              />
              <Input
                label="Last Name"
                value={details.lastName}
                onChange={(e) =>
                  setDetails({ ...details, lastName: e.target.value })
                }
              />
              <Input
                label="Brand Name"
                value={details.brandName}
                onChange={(e) =>
                  setDetails({ ...details, brandName: e.target.value })
                }
              />
              <Input
                label="Business Description"
                value={details.businessDescription}
                onChange={(e) =>
                  setDetails({
                    ...details,
                    businessDescription: e.target.value,
                  })
                }
              />
              <Input
                label="Owner Email"
                type="email"
                value={details.email}
                onChange={(e) =>
                  setDetails({ ...details, email: e.target.value })
                }
              />
              <Input
                label="Phone Number"
                value={details.phoneNumber}
                onChange={(e) =>
                  setDetails({ ...details, phoneNumber: e.target.value })
                }
              />
              <Input
                label="Temporary Password"
                type="password"
                value={details.password}
                onChange={(e) =>
                  setDetails({ ...details, password: e.target.value })
                }
              />
              <Input
                label="Domain Name"
                value={details.domainName}
                onChange={(e) =>
                  setDetails({ ...details, domainName: e.target.value })
                }
              />

              {error && <p className="text-sm text-rose-400">{error}</p>}

              <div className="flex gap-3 pt-2">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => setIsOnboarding(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" variant="accent" disabled={isSubmitting}>
                  {isSubmitting ? "Registering..." : "Register Merchant"}
                </Button>
              </div>
            </form>
          )}

          {step === 2 && (
            <form onSubmit={handleSetCategories} className="space-y-4">
              <p className="text-sm text-muted mb-2">
                Which modules is this merchant subscribing to?
              </p>
              <div className="space-y-2">
                {categories.map((category) => (
                  <label
                    key={category.id}
                    className="flex items-center gap-3 bg-inputBg px-4 py-3 rounded-lg cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={selectedCategoryIds.includes(category.id)}
                      onChange={() => toggleCategory(category.id)}
                    />
                    <span className="text-text">{category.name}</span>
                  </label>
                ))}
                {categories.length === 0 && (
                  <p className="text-sm text-muted">
                    No system categories exist yet — create them via{" "}
                    <code>POST /api/system-categories</code> first.
                  </p>
                )}
              </div>

              {error && <p className="text-sm text-rose-400">{error}</p>}

              <div className="flex gap-3 pt-2">
                <Button type="submit" variant="accent" disabled={isSubmitting}>
                  {isSubmitting ? "Saving..." : "Continue"}
                </Button>
              </div>
            </form>
          )}

          {step === 3 && (
            <form onSubmit={handleSetFeatures} className="space-y-4">
              <p className="text-sm text-muted mb-2">
                Pick features and set this merchant&apos;s price for each.
              </p>
              <div className="space-y-2">
                {availableFeatures.map((feature) => (
                  <div
                    key={feature.id}
                    className="flex items-center gap-3 bg-inputBg px-4 py-3 rounded-lg"
                  >
                    <input
                      type="checkbox"
                      checked={feature.id in featurePrices}
                      onChange={() =>
                        toggleFeaturePrice(feature.id, feature.monthlyPrice)
                      }
                    />
                    <span className="text-text flex-1">{feature.name}</span>
                    {feature.id in featurePrices && (
                      <input
                        type="number"
                        className="w-24 bg-background text-text rounded px-2 py-1 text-sm"
                        value={featurePrices[feature.id]}
                        onChange={(e) =>
                          setFeaturePrices((prev) => ({
                            ...prev,
                            [feature.id]: e.target.value,
                          }))
                        }
                      />
                    )}
                  </div>
                ))}
                {availableFeatures.length === 0 && (
                  <p className="text-sm text-muted">
                    No features exist yet for the selected categories.
                  </p>
                )}
              </div>

              {error && <p className="text-sm text-rose-400">{error}</p>}

              <div className="flex gap-3 pt-2">
                <Button type="submit" variant="accent" disabled={isSubmitting}>
                  {isSubmitting ? "Finishing..." : "Finish Onboarding"}
                </Button>
              </div>
            </form>
          )}
        </div>
      ) : (
        <div className="bg-surface rounded-2xl border border-primary/10 p-8">
          {tenantsLoading ? (
            <p className="text-muted text-sm">Loading merchants...</p>
          ) : tenantsError ? (
            <p className="text-sm text-rose-400">{tenantsError}</p>
          ) : !tenants || tenants.length === 0 ? (
            <p className="text-muted text-sm">No merchants registered yet.</p>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-muted uppercase text-xs tracking-widest border-b border-input-bg">
                  <th className="pb-3 font-medium">Brand</th>
                  <th className="pb-3 font-medium">Domain</th>
                  <th className="pb-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {tenants.map((tenant) => (
                  <tr
                    key={tenant.id}
                    className="border-b border-input-bg last:border-0"
                  >
                    <td className="py-3 text-text">{tenant.brandName}</td>
                    <td className="py-3 text-muted">{tenant.domainName}</td>
                    <td className="py-3">
                      <StatusBadge status={tenant.subscription?.status ?? "unknown"} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
}
