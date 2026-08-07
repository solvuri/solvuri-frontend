"use client";

import { use, useState } from "react";
import Link from "next/link";
import { getMerchantId } from "@/lib/auth";
import {
  awardLoyalty,
  updateCustomer,
  useCustomer,
  useCustomerSales,
} from "@/lib/posApi";

const FIELD_CLASS =
  "w-full bg-inputBg border border-primary/10 rounded-lg p-2 text-sm text-text";

export default function CustomerDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const customerId = Number(id);
  const merchantId = getMerchantId();
  const {
    data: customer,
    isLoading,
    error,
    refetch,
  } = useCustomer(merchantId, customerId);
  const { data: sales } = useCustomerSales(merchantId, customerId);

  const [editMode, setEditMode] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [editError, setEditError] = useState("");
  const [editSubmitting, setEditSubmitting] = useState(false);

  const [points, setPoints] = useState("");
  const [reason, setReason] = useState("");
  const [loyaltyError, setLoyaltyError] = useState("");
  const [loyaltySubmitting, setLoyaltySubmitting] = useState(false);

  const startEdit = () => {
    if (!customer) return;
    setName(customer.name);
    setEmail(customer.email ?? "");
    setPhone(customer.phone ?? "");
    setEditError("");
    setEditMode(true);
  };

  const handleSaveEdit = async () => {
    if (!merchantId) return;
    setEditError("");
    setEditSubmitting(true);
    try {
      await updateCustomer(merchantId, customerId, {
        ...(name && { name }),
        ...(email && { email }),
        ...(phone && { phone }),
      });
      setEditMode(false);
      await refetch();
    } catch (err) {
      setEditError(
        err instanceof Error ? err.message : "Couldn't update this customer.",
      );
    } finally {
      setEditSubmitting(false);
    }
  };

  const handleLoyalty = async (sign: 1 | -1) => {
    if (!merchantId || !points) return;
    setLoyaltyError("");
    setLoyaltySubmitting(true);
    try {
      await awardLoyalty(merchantId, customerId, {
        points: sign * Math.abs(Number(points)),
        ...(reason && { reason }),
      });
      setPoints("");
      setReason("");
      await refetch();
    } catch (err) {
      setLoyaltyError(
        err instanceof Error ? err.message : "Couldn't update loyalty points.",
      );
    } finally {
      setLoyaltySubmitting(false);
    }
  };

  if (isLoading) {
    return <p className="text-muted text-sm">Loading customer...</p>;
  }

  if (error || !customer) {
    return (
      <p className="text-sm text-rose-400">Couldn&apos;t find this customer.</p>
    );
  }

  return (
    <div className="max-w-2xl space-y-6">
      <Link href="/customers" className="text-sm text-muted hover:text-text">
        &larr; Back to Customers
      </Link>

      <div className="bg-surface rounded-2xl border border-primary/10 p-6 space-y-3">
        {!editMode ? (
          <>
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bebas text-text">{customer.name}</h2>
              <button
                type="button"
                onClick={startEdit}
                className="text-xs font-bold text-accent"
              >
                Edit
              </button>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted">Phone</span>
              <span className="text-text">{customer.phone ?? "—"}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted">Email</span>
              <span className="text-text">{customer.email ?? "—"}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted">Loyalty Points</span>
              <span className="text-text font-bold">
                {customer.loyaltyPoints}
              </span>
            </div>
          </>
        ) : (
          <>
            <h3 className="text-sm font-bold text-text">Edit Customer</h3>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Name"
              className={FIELD_CLASS}
            />
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Phone"
              className={FIELD_CLASS}
            />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              className={FIELD_CLASS}
            />
            {editError && <p className="text-sm text-rose-400">{editError}</p>}
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setEditMode(false)}
                className="px-4 py-2 rounded-lg text-sm font-medium bg-inputBg text-text"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={editSubmitting}
                onClick={handleSaveEdit}
                className="px-4 py-2 rounded-lg text-sm font-medium bg-primary text-white disabled:opacity-50"
              >
                {editSubmitting ? "Saving..." : "Save"}
              </button>
            </div>
          </>
        )}
      </div>

      <div className="bg-surface rounded-2xl border border-primary/10 p-6 space-y-3">
        <h3 className="text-sm font-bold text-text">Award / Redeem Loyalty Points</h3>
        <p className="text-xs text-muted">
          Enter a positive amount, then choose Award or Redeem.
        </p>
        <div className="flex gap-2">
          <input
            type="number"
            min={0}
            value={points}
            onChange={(e) => setPoints(e.target.value)}
            placeholder="Points"
            className={FIELD_CLASS}
          />
          <input
            type="text"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Reason (optional)"
            className={FIELD_CLASS}
          />
        </div>
        {loyaltyError && (
          <p className="text-sm text-rose-400">{loyaltyError}</p>
        )}
        <div className="flex gap-2">
          <button
            type="button"
            disabled={loyaltySubmitting || !points}
            onClick={() => handleLoyalty(1)}
            className="px-4 py-2 rounded-lg text-sm font-medium bg-primary text-white disabled:opacity-50"
          >
            Award
          </button>
          <button
            type="button"
            disabled={loyaltySubmitting || !points}
            onClick={() => handleLoyalty(-1)}
            className="px-4 py-2 rounded-lg text-sm font-medium bg-inputBg text-text disabled:opacity-50"
          >
            Redeem
          </button>
        </div>
      </div>

      <div className="bg-surface rounded-2xl border border-primary/10 p-6">
        <h3 className="text-sm font-bold text-text mb-4">Purchase History</h3>
        <p className="text-xs text-muted mb-4">
          Matched by this customer&apos;s phone number against past sales — a
          sale rung up with a different or missing phone number won&apos;t
          show here.
        </p>
        {!sales || sales.length === 0 ? (
          <p className="text-muted text-sm">No matching sales yet.</p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-muted uppercase text-xs tracking-widest border-b border-input-bg">
                <th className="pb-2 font-medium">Sale</th>
                <th className="pb-2 font-medium">Status</th>
                <th className="pb-2 font-medium text-right">Total</th>
              </tr>
            </thead>
            <tbody>
              {sales.map((sale) => (
                <tr
                  key={sale.id}
                  className="border-b border-input-bg last:border-0"
                >
                  <td className="py-2 text-text">
                    <Link
                      href={`/sales/${sale.id}`}
                      className="hover:underline"
                    >
                      #{sale.id}
                    </Link>
                  </td>
                  <td className="py-2 text-muted">{sale.status}</td>
                  <td className="py-2 text-text text-right">
                    KES {sale.totalAmount.toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
