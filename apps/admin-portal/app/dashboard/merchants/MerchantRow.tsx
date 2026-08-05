"use client";

import { useState } from "react";
import {
  TenantSummary,
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

// Shared "raw" control styling for the few fields that can't use the
// @repo/ui Input component (checkbox rows, <select>) — kept in sync with
// Input's own visible border/background so every control in this panel
// reads consistently, regardless of which one it is.
const RAW_FIELD_CLASS =
  "bg-inputBg text-text rounded-lg border border-white/10 focus:border-primary outline-none transition-all";

// A recessed "well" card for panel content — deliberately a different
// background than the table's own bg-surface container, so nested panels
// read as a distinct layer rather than blending into the row.
const PANEL_CLASS =
  "bg-background rounded-xl border border-primary/10 p-5 space-y-4 max-w-xl mt-3";

const SECTION_TITLE_CLASS =
  "text-xs uppercase tracking-widest text-muted font-semibold";

const FIELD_GRID_CLASS = "grid grid-cols-1 sm:grid-cols-2 gap-4";

const ACTIONS_ROW_CLASS =
  "flex gap-2 pt-3 mt-1 border-t border-primary/10 justify-end";

interface MerchantRowProps {
  tenant: TenantSummary;
  isExpanded: boolean;
  onToggleExpand: () => void;
  onChanged: () => Promise<void>;
}

export function MerchantRow({
  tenant,
  isExpanded,
  onToggleExpand,
  onChanged,
}: MerchantRowProps) {
  const [mpesaSettings, setMpesaSettingsState] = useState<
    MerchantMpesaSettings | null | undefined
  >(undefined);
  const [mpesaLoading, setMpesaLoading] = useState(false);
  const [mpesaError, setMpesaError] = useState("");
  const [testPhone, setTestPhone] = useState("");
  const [mpesaSubmitting, setMpesaSubmitting] = useState(false);

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

  const closeAllPanels = () => {
    setEditMode(false);
    setEditError("");
    setOverrideMode(false);
    setOverrideError("");
    setPaymentPanelOpen(false);
    setPaymentError("");
    setPaymentStatusMessage("");
  };

  const handleToggle = async () => {
    closeAllPanels();
    if (isExpanded) {
      onToggleExpand();
      return;
    }
    onToggleExpand();
    if (mpesaSettings !== undefined) return;
    setMpesaLoading(true);
    setMpesaError("");
    try {
      const settings = await getMerchantMpesaSettings(adminApi, tenant.id);
      setMpesaSettingsState(settings);
    } catch (err) {
      setMpesaSettingsState(null);
      setMpesaError(
        err instanceof Error ? err.message : "Couldn't load M-Pesa settings.",
      );
    } finally {
      setMpesaLoading(false);
    }
  };

  const handleVerify = async () => {
    if (!testPhone) {
      setMpesaError("Enter a phone number to send the test push to.");
      return;
    }
    setMpesaError("");
    setMpesaSubmitting(true);
    try {
      await verifyMpesaSettings(adminApi, tenant.id, testPhone);
      const settings = await getMerchantMpesaSettings(adminApi, tenant.id);
      setMpesaSettingsState(settings);
    } catch (err) {
      setMpesaError(
        err instanceof Error ? err.message : "Verification push failed.",
      );
    } finally {
      setMpesaSubmitting(false);
    }
  };

  const handleToggleEnabled = async (nextEnabled: boolean) => {
    setMpesaError("");
    setMpesaSubmitting(true);
    try {
      await setMpesaEnabled(adminApi, tenant.id, nextEnabled);
      const settings = await getMerchantMpesaSettings(adminApi, tenant.id);
      setMpesaSettingsState(settings);
    } catch (err) {
      setMpesaError(
        err instanceof Error ? err.message : "Couldn't update status.",
      );
    } finally {
      setMpesaSubmitting(false);
    }
  };

  const startEdit = () => {
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

  const handleSaveEdit = async () => {
    setEditError("");
    setEditSubmitting(true);
    try {
      await updateTenant(adminApi, tenant.id, {
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
      await onChanged();
    } catch (err) {
      setEditError(
        err instanceof Error ? err.message : "Couldn't update this merchant.",
      );
    } finally {
      setEditSubmitting(false);
    }
  };

  const startOverride = () => {
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
      await onChanged();
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

  const startPayment = () => {
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
        await onChanged();
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
      await onChanged();
    } catch (err) {
      setPaymentError(
        err instanceof Error ? err.message : "Couldn't log this payment.",
      );
    } finally {
      setPaymentSubmitting(false);
    }
  };

  return (
    <>
      <tr
        className="border-b border-input-bg last:border-0 cursor-pointer"
        onClick={handleToggle}
      >
        <td className="py-3 text-text">{tenant.brandName}</td>
        <td className="py-3 text-muted">{tenant.domainName}</td>
        <td className="py-3">
          <StatusBadge status={tenant.subscription?.status ?? "unknown"} />
        </td>
        <td className="py-3 text-accent text-xs font-bold">
          {isExpanded ? "Hide" : "Manage"}
        </td>
      </tr>
      {isExpanded && (
        <tr className="border-b border-input-bg last:border-0">
          <td colSpan={4} className="py-4">
            {mpesaLoading ? (
              <p className="text-muted text-xs">Loading M-Pesa settings...</p>
            ) : mpesaSettings === undefined || mpesaSettings === null ? (
              <p className="text-muted text-xs">
                {mpesaError ||
                  "This merchant hasn't submitted M-Pesa credentials yet."}
              </p>
            ) : (
              <div className={PANEL_CLASS}>
                <p className={SECTION_TITLE_CLASS}>M-Pesa Online Checkout</p>
                <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="text-muted">Credentials:</span>
                    <StatusBadge
                      status={mpesaSettings.hasSecrets ? "active" : "pending"}
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-muted">Verified:</span>
                    <StatusBadge
                      status={
                        mpesaSettings.isVerified ? "verified" : "unverified"
                      }
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-muted">Online checkout:</span>
                    <StatusBadge
                      status={mpesaSettings.isEnabled ? "enabled" : "disabled"}
                    />
                  </div>
                </div>

                <div
                  className="flex items-center gap-2"
                  onClick={(e) => e.stopPropagation()}
                >
                  <input
                    type="text"
                    placeholder="Test phone (2547...)"
                    value={testPhone}
                    onChange={(e) => setTestPhone(e.target.value)}
                    className={`flex-1 px-3 py-2 text-xs ${RAW_FIELD_CLASS}`}
                  />
                  <Button
                    type="button"
                    variant="secondary"
                    disabled={mpesaSubmitting}
                    onClick={handleVerify}
                  >
                    {mpesaSubmitting ? "Sending..." : "Send verification push"}
                  </Button>
                </div>

                <div
                  className={ACTIONS_ROW_CLASS}
                  onClick={(e) => e.stopPropagation()}
                >
                  <Button
                    type="button"
                    variant="accent"
                    disabled={mpesaSubmitting || !mpesaSettings.isVerified}
                    onClick={() =>
                      handleToggleEnabled(!mpesaSettings.isEnabled)
                    }
                  >
                    {mpesaSettings.isEnabled ? "Disable" : "Enable"} online
                    checkout
                  </Button>
                </div>

                {mpesaError && (
                  <p className="text-xs text-rose-400">{mpesaError}</p>
                )}
              </div>
            )}

            <div onClick={(e) => e.stopPropagation()}>
              {!editMode ? (
                <Button
                  type="button"
                  variant="secondary"
                  className="mt-3"
                  onClick={startEdit}
                >
                  Edit Details
                </Button>
              ) : (
                <div className={PANEL_CLASS}>
                  <p className={SECTION_TITLE_CLASS}>Edit Merchant Details</p>
                  <div className={FIELD_GRID_CLASS}>
                    <Input
                      label="Brand Name"
                      value={editForm.brandName}
                      onChange={(e) =>
                        setEditForm({ ...editForm, brandName: e.target.value })
                      }
                    />
                    <Input
                      label="Domain Name"
                      value={editForm.domainName}
                      onChange={(e) =>
                        setEditForm({ ...editForm, domainName: e.target.value })
                      }
                    />
                    <Input
                      label="Email"
                      type="email"
                      value={editForm.email}
                      onChange={(e) =>
                        setEditForm({ ...editForm, email: e.target.value })
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
                    <div className="sm:col-span-2">
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
                    </div>
                  </div>
                  {editError && (
                    <p className="text-xs text-rose-400">{editError}</p>
                  )}
                  <div className={ACTIONS_ROW_CLASS}>
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
                      onClick={handleSaveEdit}
                    >
                      {editSubmitting ? "Saving..." : "Save"}
                    </Button>
                  </div>
                </div>
              )}
            </div>

            <div onClick={(e) => e.stopPropagation()}>
              {!overrideMode ? (
                <Button
                  type="button"
                  variant="secondary"
                  className="mt-3"
                  onClick={startOverride}
                >
                  Override Subscription
                </Button>
              ) : (
                <div className={PANEL_CLASS}>
                  <p className={SECTION_TITLE_CLASS}>
                    Manual Subscription Override
                  </p>
                  <p className="text-xs text-muted">
                    Directly corrects subscription fields — doesn&apos;t collect
                    payment. Enter the subscription ID (not the tenant ID); it
                    can&apos;t always be prefilled here.
                  </p>
                  <div className={FIELD_GRID_CLASS}>
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
                    <label
                      className={`flex items-center gap-3 px-4 h-14.5 mt-auto cursor-pointer ${RAW_FIELD_CLASS}`}
                    >
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
                      <span className="text-text text-sm">Paid</span>
                    </label>
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
                  </div>
                  {overrideError && (
                    <p className="text-xs text-rose-400">{overrideError}</p>
                  )}
                  <div className={ACTIONS_ROW_CLASS}>
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
                      {overrideSubmitting ? "Saving..." : "Save"}
                    </Button>
                  </div>
                </div>
              )}
            </div>

            <div onClick={(e) => e.stopPropagation()}>
              {!paymentPanelOpen ? (
                <Button
                  type="button"
                  variant="secondary"
                  className="mt-3"
                  onClick={startPayment}
                >
                  Collect Payment
                </Button>
              ) : (
                <div className={PANEL_CLASS}>
                  <p className={SECTION_TITLE_CLASS}>
                    Collect Subscription Payment
                  </p>
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant={paymentMethod === "stk" ? "accent" : "secondary"}
                      onClick={() => setPaymentMethod("stk")}
                    >
                      STK Push
                    </Button>
                    <Button
                      type="button"
                      variant={
                        paymentMethod === "manual" ? "accent" : "secondary"
                      }
                      onClick={() => setPaymentMethod("manual")}
                    >
                      Log Manual Payment
                    </Button>
                  </div>
                  <p className="text-xs text-muted">
                    Enter the subscription ID (not the tenant ID); it can&apos;t
                    always be prefilled here.
                  </p>

                  <div className={FIELD_GRID_CLASS}>
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
                      <div className="sm:col-span-2">
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
                      </div>
                    ) : (
                      <>
                        <div className="space-y-2">
                          <label className="block text-sm text-muted">
                            Payment Mode
                          </label>
                          <select
                            className={`w-full px-4 py-4 text-sm ${RAW_FIELD_CLASS}`}
                            value={paymentForm.mode}
                            onChange={(e) =>
                              setPaymentForm({
                                ...paymentForm,
                                mode: e.target.value as PaymentMode,
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
                  </div>

                  {paymentMethod === "stk" && paymentStatusMessage && (
                    <p className="text-xs text-accent">
                      {paymentStatusMessage}
                    </p>
                  )}
                  {paymentError && (
                    <p className="text-xs text-rose-400">{paymentError}</p>
                  )}
                  <div className={ACTIONS_ROW_CLASS}>
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
    </>
  );
}
