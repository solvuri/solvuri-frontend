"use client";

import { Fragment, useEffect, useState } from "react";
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
  getMerchantMpesaSettings,
  verifyMpesaSettings,
  setMpesaEnabled,
  updateTenant,
  overrideTenantSubscription,
  initiateSubscriptionStkPush,
  getSubscriptionStkPushStatus,
  logManualPayment,
  type PaymentMode,
} from "@repo/api-client";
import type { MerchantMpesaSettings } from "@repo/types";
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

const EMPTY_EDIT_FORM = {
  brandName: "",
  businessDescription: "",
  email: "",
  phoneNumber: "",
  domainName: "",
  customMonthlyFee: "",
};

const EMPTY_OVERRIDE_FORM = {
  subscriptionId: "",
  status: "",
  isPaid: false,
  paymentMethod: "",
  customMonthlyFee: "",
  totalPaid: "",
  startDate: "",
  endDate: "",
};

const PAYMENT_MODES: PaymentMode[] = [
  "Cash",
  "Card",
  "BankDeposit",
  "Paybill",
  "Till",
];

const EMPTY_PAYMENT_FORM = {
  subscriptionId: "",
  phoneNumber: "",
  amount: "",
  mode: "Cash" as PaymentMode,
  referenceNumber: "",
  notes: "",
  extendDays: "",
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

  const [expandedTenantId, setExpandedTenantId] = useState<number | null>(
    null,
  );
  const [mpesaSettings, setMpesaSettings] = useState<
    Record<number, MerchantMpesaSettings | null>
  >({});
  const [mpesaLoading, setMpesaLoading] = useState<Record<number, boolean>>(
    {},
  );
  const [mpesaError, setMpesaError] = useState<Record<number, string>>({});
  const [testPhone, setTestPhone] = useState<Record<number, string>>({});
  const [mpesaSubmitting, setMpesaSubmitting] = useState<
    Record<number, boolean>
  >({});

  const [editMode, setEditMode] = useState(false);
  const [editForm, setEditForm] = useState(EMPTY_EDIT_FORM);
  const [editSubmitting, setEditSubmitting] = useState(false);
  const [editError, setEditError] = useState("");

  const [overrideMode, setOverrideMode] = useState(false);
  const [overrideForm, setOverrideForm] = useState(EMPTY_OVERRIDE_FORM);
  const [overrideSubmitting, setOverrideSubmitting] = useState(false);
  const [overrideError, setOverrideError] = useState("");

  const [paymentPanelOpen, setPaymentPanelOpen] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<"stk" | "manual">("stk");
  const [paymentForm, setPaymentForm] = useState(EMPTY_PAYMENT_FORM);
  const [paymentSubmitting, setPaymentSubmitting] = useState(false);
  const [paymentError, setPaymentError] = useState("");
  const [paymentStatusMessage, setPaymentStatusMessage] = useState("");

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

  const toggleExpand = async (tenantId: number) => {
    setEditMode(false);
    setEditError("");
    setOverrideMode(false);
    setOverrideError("");
    setPaymentPanelOpen(false);
    setPaymentError("");
    setPaymentStatusMessage("");
    if (expandedTenantId === tenantId) {
      setExpandedTenantId(null);
      return;
    }
    setExpandedTenantId(tenantId);
    if (tenantId in mpesaSettings) return;
    setMpesaLoading((prev) => ({ ...prev, [tenantId]: true }));
    setMpesaError((prev) => ({ ...prev, [tenantId]: "" }));
    try {
      const settings = await getMerchantMpesaSettings(adminApi, tenantId);
      setMpesaSettings((prev) => ({ ...prev, [tenantId]: settings }));
    } catch (err) {
      setMpesaSettings((prev) => ({ ...prev, [tenantId]: null }));
      setMpesaError((prev) => ({
        ...prev,
        [tenantId]:
          err instanceof Error
            ? err.message
            : "Couldn't load M-Pesa settings.",
      }));
    } finally {
      setMpesaLoading((prev) => ({ ...prev, [tenantId]: false }));
    }
  };

  const handleVerify = async (tenantId: number) => {
    const phone = testPhone[tenantId];
    if (!phone) {
      setMpesaError((prev) => ({
        ...prev,
        [tenantId]: "Enter a phone number to send the test push to.",
      }));
      return;
    }
    setMpesaError((prev) => ({ ...prev, [tenantId]: "" }));
    setMpesaSubmitting((prev) => ({ ...prev, [tenantId]: true }));
    try {
      await verifyMpesaSettings(adminApi, tenantId, phone);
      const settings = await getMerchantMpesaSettings(adminApi, tenantId);
      setMpesaSettings((prev) => ({ ...prev, [tenantId]: settings }));
    } catch (err) {
      setMpesaError((prev) => ({
        ...prev,
        [tenantId]:
          err instanceof Error ? err.message : "Verification push failed.",
      }));
    } finally {
      setMpesaSubmitting((prev) => ({ ...prev, [tenantId]: false }));
    }
  };

  const handleToggleEnabled = async (tenantId: number, isEnabled: boolean) => {
    setMpesaError((prev) => ({ ...prev, [tenantId]: "" }));
    setMpesaSubmitting((prev) => ({ ...prev, [tenantId]: true }));
    try {
      await setMpesaEnabled(adminApi, tenantId, isEnabled);
      const settings = await getMerchantMpesaSettings(adminApi, tenantId);
      setMpesaSettings((prev) => ({ ...prev, [tenantId]: settings }));
    } catch (err) {
      setMpesaError((prev) => ({
        ...prev,
        [tenantId]:
          err instanceof Error ? err.message : "Couldn't update status.",
      }));
    } finally {
      setMpesaSubmitting((prev) => ({ ...prev, [tenantId]: false }));
    }
  };

  const startEdit = (tenant: TenantSummary) => {
    setEditForm({
      brandName: tenant.brandName,
      businessDescription: "",
      email: tenant.email ?? "",
      phoneNumber: tenant.phoneNumber ?? "",
      domainName: tenant.domainName,
      customMonthlyFee: "",
    });
    setEditError("");
    setEditMode(true);
  };

  const handleSaveEdit = async (tenantId: number) => {
    setEditError("");
    setEditSubmitting(true);
    try {
      await updateTenant(adminApi, tenantId, {
        ...(editForm.brandName && { brandName: editForm.brandName }),
        ...(editForm.businessDescription && {
          businessDescription: editForm.businessDescription,
        }),
        ...(editForm.email && { email: editForm.email }),
        ...(editForm.phoneNumber && { phoneNumber: editForm.phoneNumber }),
        ...(editForm.domainName && { domainName: editForm.domainName }),
        ...(editForm.customMonthlyFee && {
          customMonthlyFee: Number(editForm.customMonthlyFee),
        }),
      });
      setEditMode(false);
      await loadDirectory();
    } catch (err) {
      setEditError(
        err instanceof Error ? err.message : "Couldn't update this merchant.",
      );
    } finally {
      setEditSubmitting(false);
    }
  };

  const startOverride = (tenant: TenantSummary) => {
    setOverrideForm({
      ...EMPTY_OVERRIDE_FORM,
      subscriptionId: tenant.subscription?.id
        ? String(tenant.subscription.id)
        : "",
      status: tenant.subscription?.status ?? "",
      isPaid: tenant.subscription?.isPaid ?? false,
    });
    setOverrideError("");
    setOverrideMode(true);
  };

  const handleSaveOverride = async () => {
    const subscriptionId = Number(overrideForm.subscriptionId);
    if (!overrideForm.subscriptionId || Number.isNaN(subscriptionId)) {
      setOverrideError("Enter a valid subscription ID.");
      return;
    }
    setOverrideError("");
    setOverrideSubmitting(true);
    try {
      await overrideTenantSubscription(adminApi, subscriptionId, {
        ...(overrideForm.status && { status: overrideForm.status }),
        isPaid: overrideForm.isPaid,
        ...(overrideForm.paymentMethod && {
          paymentMethod: overrideForm.paymentMethod,
        }),
        ...(overrideForm.customMonthlyFee && {
          customMonthlyFee: Number(overrideForm.customMonthlyFee),
        }),
        ...(overrideForm.totalPaid && {
          totalPaid: Number(overrideForm.totalPaid),
        }),
        ...(overrideForm.startDate && { startDate: overrideForm.startDate }),
        ...(overrideForm.endDate && { endDate: overrideForm.endDate }),
      });
      setOverrideMode(false);
      await loadDirectory();
    } catch (err) {
      setOverrideError(
        err instanceof Error
          ? err.message
          : "Couldn't override this subscription.",
      );
    } finally {
      setOverrideSubmitting(false);
    }
  };

  const startPayment = (tenant: TenantSummary) => {
    setPaymentForm({
      ...EMPTY_PAYMENT_FORM,
      subscriptionId: tenant.subscription?.id
        ? String(tenant.subscription.id)
        : "",
    });
    setPaymentMethod("stk");
    setPaymentError("");
    setPaymentStatusMessage("");
    setPaymentPanelOpen(true);
  };

  // Actively resolves a Pending STK push by polling every 4s, mirroring
  // apps/clearack's checkout-status polling — the backend queries Daraja
  // itself on each call rather than just waiting on the webhook. Backs off
  // client-side after 90s (the backend's own force-resolve window) so this
  // never spins forever.
  const pollStkStatus = async (checkoutRequestId: string) => {
    const startedAt = Date.now();
    while (Date.now() - startedAt < 90_000) {
      await new Promise((resolve) => setTimeout(resolve, 4000));
      try {
        const status = await getSubscriptionStkPushStatus(
          adminApi,
          checkoutRequestId,
        );
        if (status.status !== "Pending") {
          return status;
        }
      } catch {
        // Transient error mid-poll — keep trying until the timeout above.
      }
    }
    return null;
  };

  const handleStkPush = async () => {
    const subscriptionId = Number(paymentForm.subscriptionId);
    const amount = Number(paymentForm.amount);
    if (!paymentForm.subscriptionId || Number.isNaN(subscriptionId)) {
      setPaymentError("Enter a valid subscription ID.");
      return;
    }
    if (!paymentForm.phoneNumber) {
      setPaymentError("Enter a phone number to push the STK prompt to.");
      return;
    }
    if (!paymentForm.amount || Number.isNaN(amount)) {
      setPaymentError("Enter a valid amount.");
      return;
    }
    setPaymentError("");
    setPaymentSubmitting(true);
    setPaymentStatusMessage("Sending STK push...");
    try {
      const result = await initiateSubscriptionStkPush(adminApi, {
        subscriptionId,
        phoneNumber: paymentForm.phoneNumber,
        amount,
      });
      setPaymentStatusMessage(
        "STK push sent — waiting for the merchant to enter their M-Pesa PIN...",
      );
      const outcome = await pollStkStatus(result.checkoutRequestId);
      if (!outcome) {
        setPaymentStatusMessage(
          "Still pending after 90s — check the payment ledger shortly.",
        );
      } else if (outcome.status === "Success") {
        setPaymentStatusMessage("Payment successful.");
        await loadDirectory();
      } else {
        setPaymentStatusMessage(`Payment ${outcome.status.toLowerCase()}.`);
      }
    } catch (err) {
      setPaymentError(err instanceof Error ? err.message : "STK push failed.");
      setPaymentStatusMessage("");
    } finally {
      setPaymentSubmitting(false);
    }
  };

  const handleManualPayment = async () => {
    const subscriptionId = Number(paymentForm.subscriptionId);
    const amount = Number(paymentForm.amount);
    if (!paymentForm.subscriptionId || Number.isNaN(subscriptionId)) {
      setPaymentError("Enter a valid subscription ID.");
      return;
    }
    if (!paymentForm.amount || Number.isNaN(amount)) {
      setPaymentError("Enter a valid amount.");
      return;
    }
    setPaymentError("");
    setPaymentSubmitting(true);
    try {
      await logManualPayment(adminApi, {
        subscriptionId,
        amount,
        paymentMode: paymentForm.mode,
        ...(paymentForm.referenceNumber && {
          referenceNumber: paymentForm.referenceNumber,
        }),
        ...(paymentForm.notes && { notes: paymentForm.notes }),
        ...(paymentForm.extendDays && {
          extendDays: Number(paymentForm.extendDays),
        }),
      });
      setPaymentPanelOpen(false);
      await loadDirectory();
    } catch (err) {
      setPaymentError(
        err instanceof Error ? err.message : "Couldn't log this payment.",
      );
    } finally {
      setPaymentSubmitting(false);
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
                  <th className="pb-3 font-medium">Online Payment</th>
                </tr>
              </thead>
              <tbody>
                {tenants.map((tenant) => (
                  <Fragment key={tenant.id}>
                    <tr
                      className="border-b border-input-bg last:border-0 cursor-pointer"
                      onClick={() => toggleExpand(tenant.id)}
                    >
                      <td className="py-3 text-text">{tenant.brandName}</td>
                      <td className="py-3 text-muted">{tenant.domainName}</td>
                      <td className="py-3">
                        <StatusBadge
                          status={tenant.subscription?.status ?? "unknown"}
                        />
                      </td>
                      <td className="py-3 text-accent text-xs font-bold">
                        {expandedTenantId === tenant.id ? "Hide" : "Manage"}
                      </td>
                    </tr>
                    {expandedTenantId === tenant.id && (
                      <tr
                        key={`${tenant.id}-mpesa`}
                        className="border-b border-input-bg last:border-0"
                      >
                        <td colSpan={4} className="py-4">
                          {mpesaLoading[tenant.id] ? (
                            <p className="text-muted text-xs">
                              Loading M-Pesa settings...
                            </p>
                          ) : mpesaSettings[tenant.id] === undefined ||
                            mpesaSettings[tenant.id] === null ? (
                            <p className="text-muted text-xs">
                              {mpesaError[tenant.id] ||
                                "This merchant hasn't submitted M-Pesa credentials yet."}
                            </p>
                          ) : (
                            <div className="bg-inputBg rounded-xl p-4 space-y-3 max-w-md">
                              <div className="flex items-center gap-2 text-xs">
                                <span className="text-muted">Credentials:</span>
                                <StatusBadge
                                  status={
                                    mpesaSettings[tenant.id]?.hasSecrets
                                      ? "active"
                                      : "pending"
                                  }
                                />
                              </div>
                              <div className="flex items-center gap-2 text-xs">
                                <span className="text-muted">Verified:</span>
                                <StatusBadge
                                  status={
                                    mpesaSettings[tenant.id]?.isVerified
                                      ? "verified"
                                      : "unverified"
                                  }
                                />
                              </div>
                              <div className="flex items-center gap-2 text-xs">
                                <span className="text-muted">
                                  Online checkout:
                                </span>
                                <StatusBadge
                                  status={
                                    mpesaSettings[tenant.id]?.isEnabled
                                      ? "enabled"
                                      : "disabled"
                                  }
                                />
                              </div>

                              <div
                                className="flex items-center gap-2 pt-2"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <input
                                  type="text"
                                  placeholder="Test phone (2547...)"
                                  value={testPhone[tenant.id] ?? ""}
                                  onChange={(e) =>
                                    setTestPhone((prev) => ({
                                      ...prev,
                                      [tenant.id]: e.target.value,
                                    }))
                                  }
                                  className="flex-1 bg-background text-text rounded px-2 py-1 text-xs"
                                />
                                <Button
                                  type="button"
                                  variant="secondary"
                                  disabled={mpesaSubmitting[tenant.id]}
                                  onClick={() => handleVerify(tenant.id)}
                                >
                                  {mpesaSubmitting[tenant.id]
                                    ? "Sending..."
                                    : "Send verification push"}
                                </Button>
                              </div>

                              <div onClick={(e) => e.stopPropagation()}>
                                <Button
                                  type="button"
                                  variant="accent"
                                  disabled={
                                    mpesaSubmitting[tenant.id] ||
                                    !mpesaSettings[tenant.id]?.isVerified
                                  }
                                  onClick={() =>
                                    handleToggleEnabled(
                                      tenant.id,
                                      !mpesaSettings[tenant.id]?.isEnabled,
                                    )
                                  }
                                >
                                  {mpesaSettings[tenant.id]?.isEnabled
                                    ? "Disable"
                                    : "Enable"}{" "}
                                  online checkout
                                </Button>
                              </div>

                              {mpesaError[tenant.id] && (
                                <p className="text-xs text-rose-400">
                                  {mpesaError[tenant.id]}
                                </p>
                              )}
                            </div>
                          )}

                          <div
                            className="mt-3"
                            onClick={(e) => e.stopPropagation()}
                          >
                            {!editMode ? (
                              <Button
                                type="button"
                                variant="secondary"
                                onClick={() => startEdit(tenant)}
                              >
                                Edit Details
                              </Button>
                            ) : (
                              <div className="bg-inputBg rounded-xl p-4 space-y-3 max-w-md mt-2">
                                <p className="text-xs uppercase tracking-widest text-muted">
                                  Edit Merchant Details
                                </p>
                                <Input
                                  label="Brand Name"
                                  value={editForm.brandName}
                                  onChange={(e) =>
                                    setEditForm({
                                      ...editForm,
                                      brandName: e.target.value,
                                    })
                                  }
                                />
                                <Input
                                  label="Business Description"
                                  value={editForm.businessDescription}
                                  onChange={(e) =>
                                    setEditForm({
                                      ...editForm,
                                      businessDescription: e.target.value,
                                    })
                                  }
                                />
                                <Input
                                  label="Email"
                                  type="email"
                                  value={editForm.email}
                                  onChange={(e) =>
                                    setEditForm({
                                      ...editForm,
                                      email: e.target.value,
                                    })
                                  }
                                />
                                <Input
                                  label="Phone Number"
                                  value={editForm.phoneNumber}
                                  onChange={(e) =>
                                    setEditForm({
                                      ...editForm,
                                      phoneNumber: e.target.value,
                                    })
                                  }
                                />
                                <Input
                                  label="Domain Name"
                                  value={editForm.domainName}
                                  onChange={(e) =>
                                    setEditForm({
                                      ...editForm,
                                      domainName: e.target.value,
                                    })
                                  }
                                />
                                <Input
                                  label="Custom Monthly Fee"
                                  type="number"
                                  value={editForm.customMonthlyFee}
                                  onChange={(e) =>
                                    setEditForm({
                                      ...editForm,
                                      customMonthlyFee: e.target.value,
                                    })
                                  }
                                />
                                {editError && (
                                  <p className="text-xs text-rose-400">
                                    {editError}
                                  </p>
                                )}
                                <div className="flex gap-2">
                                  <Button
                                    type="button"
                                    variant="secondary"
                                    onClick={() => setEditMode(false)}
                                  >
                                    Cancel
                                  </Button>
                                  <Button
                                    type="button"
                                    variant="accent"
                                    disabled={editSubmitting}
                                    onClick={() => handleSaveEdit(tenant.id)}
                                  >
                                    {editSubmitting ? "Saving..." : "Save"}
                                  </Button>
                                </div>
                              </div>
                            )}
                          </div>

                          <div
                            className="mt-3"
                            onClick={(e) => e.stopPropagation()}
                          >
                            {!overrideMode ? (
                              <Button
                                type="button"
                                variant="secondary"
                                onClick={() => startOverride(tenant)}
                              >
                                Override Subscription
                              </Button>
                            ) : (
                              <div className="bg-inputBg rounded-xl p-4 space-y-3 max-w-md mt-2">
                                <p className="text-xs uppercase tracking-widest text-muted">
                                  Manual Subscription Override
                                </p>
                                <p className="text-xs text-muted">
                                  Directly corrects subscription fields —
                                  doesn&apos;t collect payment. Enter the
                                  subscription ID (not the tenant ID); it
                                  can&apos;t always be prefilled here.
                                </p>
                                <Input
                                  label="Subscription ID"
                                  type="number"
                                  value={overrideForm.subscriptionId}
                                  onChange={(e) =>
                                    setOverrideForm({
                                      ...overrideForm,
                                      subscriptionId: e.target.value,
                                    })
                                  }
                                />
                                <Input
                                  label="Status"
                                  value={overrideForm.status}
                                  onChange={(e) =>
                                    setOverrideForm({
                                      ...overrideForm,
                                      status: e.target.value,
                                    })
                                  }
                                />
                                <label className="flex items-center gap-3 bg-background px-4 py-3 rounded-lg cursor-pointer">
                                  <input
                                    type="checkbox"
                                    checked={overrideForm.isPaid}
                                    onChange={(e) =>
                                      setOverrideForm({
                                        ...overrideForm,
                                        isPaid: e.target.checked,
                                      })
                                    }
                                  />
                                  <span className="text-text text-sm">
                                    Paid
                                  </span>
                                </label>
                                <Input
                                  label="Payment Method"
                                  value={overrideForm.paymentMethod}
                                  onChange={(e) =>
                                    setOverrideForm({
                                      ...overrideForm,
                                      paymentMethod: e.target.value,
                                    })
                                  }
                                />
                                <Input
                                  label="Custom Monthly Fee"
                                  type="number"
                                  value={overrideForm.customMonthlyFee}
                                  onChange={(e) =>
                                    setOverrideForm({
                                      ...overrideForm,
                                      customMonthlyFee: e.target.value,
                                    })
                                  }
                                />
                                <Input
                                  label="Total Paid"
                                  type="number"
                                  value={overrideForm.totalPaid}
                                  onChange={(e) =>
                                    setOverrideForm({
                                      ...overrideForm,
                                      totalPaid: e.target.value,
                                    })
                                  }
                                />
                                <Input
                                  label="Start Date"
                                  type="date"
                                  value={overrideForm.startDate}
                                  onChange={(e) =>
                                    setOverrideForm({
                                      ...overrideForm,
                                      startDate: e.target.value,
                                    })
                                  }
                                />
                                <Input
                                  label="End Date"
                                  type="date"
                                  value={overrideForm.endDate}
                                  onChange={(e) =>
                                    setOverrideForm({
                                      ...overrideForm,
                                      endDate: e.target.value,
                                    })
                                  }
                                />
                                {overrideError && (
                                  <p className="text-xs text-rose-400">
                                    {overrideError}
                                  </p>
                                )}
                                <div className="flex gap-2">
                                  <Button
                                    type="button"
                                    variant="secondary"
                                    onClick={() => setOverrideMode(false)}
                                  >
                                    Cancel
                                  </Button>
                                  <Button
                                    type="button"
                                    variant="accent"
                                    disabled={overrideSubmitting}
                                    onClick={handleSaveOverride}
                                  >
                                    {overrideSubmitting
                                      ? "Saving..."
                                      : "Save"}
                                  </Button>
                                </div>
                              </div>
                            )}
                          </div>

                          <div
                            className="mt-3"
                            onClick={(e) => e.stopPropagation()}
                          >
                            {!paymentPanelOpen ? (
                              <Button
                                type="button"
                                variant="secondary"
                                onClick={() => startPayment(tenant)}
                              >
                                Collect Payment
                              </Button>
                            ) : (
                              <div className="bg-inputBg rounded-xl p-4 space-y-3 max-w-md mt-2">
                                <p className="text-xs uppercase tracking-widest text-muted">
                                  Collect Subscription Payment
                                </p>
                                <div className="flex gap-2">
                                  <Button
                                    type="button"
                                    variant={
                                      paymentMethod === "stk"
                                        ? "accent"
                                        : "secondary"
                                    }
                                    onClick={() => setPaymentMethod("stk")}
                                  >
                                    STK Push
                                  </Button>
                                  <Button
                                    type="button"
                                    variant={
                                      paymentMethod === "manual"
                                        ? "accent"
                                        : "secondary"
                                    }
                                    onClick={() => setPaymentMethod("manual")}
                                  >
                                    Log Manual Payment
                                  </Button>
                                </div>
                                <p className="text-xs text-muted">
                                  Enter the subscription ID (not the tenant
                                  ID); it can&apos;t always be prefilled here.
                                </p>
                                <Input
                                  label="Subscription ID"
                                  type="number"
                                  value={paymentForm.subscriptionId}
                                  onChange={(e) =>
                                    setPaymentForm({
                                      ...paymentForm,
                                      subscriptionId: e.target.value,
                                    })
                                  }
                                />
                                <Input
                                  label="Amount (KES)"
                                  type="number"
                                  value={paymentForm.amount}
                                  onChange={(e) =>
                                    setPaymentForm({
                                      ...paymentForm,
                                      amount: e.target.value,
                                    })
                                  }
                                />

                                {paymentMethod === "stk" ? (
                                  <>
                                    <Input
                                      label="Phone Number"
                                      value={paymentForm.phoneNumber}
                                      onChange={(e) =>
                                        setPaymentForm({
                                          ...paymentForm,
                                          phoneNumber: e.target.value,
                                        })
                                      }
                                    />
                                    {paymentStatusMessage && (
                                      <p className="text-xs text-accent">
                                        {paymentStatusMessage}
                                      </p>
                                    )}
                                  </>
                                ) : (
                                  <>
                                    <div className="space-y-1">
                                      <label className="text-xs text-muted">
                                        Payment Mode
                                      </label>
                                      <select
                                        className="w-full bg-background text-text rounded px-3 py-2 text-sm"
                                        value={paymentForm.mode}
                                        onChange={(e) =>
                                          setPaymentForm({
                                            ...paymentForm,
                                            mode: e.target
                                              .value as PaymentMode,
                                          })
                                        }
                                      >
                                        {PAYMENT_MODES.map((mode) => (
                                          <option key={mode} value={mode}>
                                            {mode}
                                          </option>
                                        ))}
                                      </select>
                                    </div>
                                    <Input
                                      label="Reference Number"
                                      value={paymentForm.referenceNumber}
                                      onChange={(e) =>
                                        setPaymentForm({
                                          ...paymentForm,
                                          referenceNumber: e.target.value,
                                        })
                                      }
                                    />
                                    <Input
                                      label="Notes"
                                      value={paymentForm.notes}
                                      onChange={(e) =>
                                        setPaymentForm({
                                          ...paymentForm,
                                          notes: e.target.value,
                                        })
                                      }
                                    />
                                    <Input
                                      label="Extend Days (override)"
                                      type="number"
                                      value={paymentForm.extendDays}
                                      onChange={(e) =>
                                        setPaymentForm({
                                          ...paymentForm,
                                          extendDays: e.target.value,
                                        })
                                      }
                                    />
                                  </>
                                )}

                                {paymentError && (
                                  <p className="text-xs text-rose-400">
                                    {paymentError}
                                  </p>
                                )}
                                <div className="flex gap-2">
                                  <Button
                                    type="button"
                                    variant="secondary"
                                    disabled={paymentSubmitting}
                                    onClick={() => setPaymentPanelOpen(false)}
                                  >
                                    Cancel
                                  </Button>
                                  <Button
                                    type="button"
                                    variant="accent"
                                    disabled={paymentSubmitting}
                                    onClick={
                                      paymentMethod === "stk"
                                        ? handleStkPush
                                        : handleManualPayment
                                    }
                                  >
                                    {paymentSubmitting
                                      ? "Submitting..."
                                      : paymentMethod === "stk"
                                        ? "Send STK Push"
                                        : "Log Payment"}
                                  </Button>
                                </div>
                              </div>
                            )}
                          </div>
                        </td>
                      </tr>
                    )}
                  </Fragment>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
}
