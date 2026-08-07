"use client";

import { useState } from "react";
import Link from "next/link";
import { getMerchantId } from "@/lib/auth";
import { createCustomer, useCustomers } from "@/lib/posApi";

const FIELD_CLASS =
  "w-full bg-inputBg border border-primary/10 rounded-lg p-2 text-sm text-text";

export default function CustomersPage() {
  const merchantId = getMerchantId();
  const { data: customers, isLoading, error, refetch } = useCustomers(merchantId);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [formError, setFormError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!merchantId || !name) return;
    setFormError("");
    setSubmitting(true);
    try {
      await createCustomer(merchantId, {
        name,
        ...(email && { email }),
        ...(phone && { phone }),
      });
      setName("");
      setEmail("");
      setPhone("");
      await refetch();
    } catch (err) {
      setFormError(
        err instanceof Error ? err.message : "Couldn't create this customer.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl space-y-6">
      <h2 className="text-2xl font-bebas text-text">Customers</h2>

      <div className="bg-surface rounded-2xl border border-primary/10 p-6">
        <h3 className="text-sm font-bold text-text mb-4">All Customers</h3>
        {isLoading && <p className="text-muted text-sm">Loading...</p>}
        {error && (
          <p className="text-sm text-rose-400">
            {error instanceof Error ? error.message : "Couldn't load customers."}
          </p>
        )}
        {!isLoading && !error && (!customers || customers.length === 0) && (
          <p className="text-muted text-sm">No customers yet — add one below.</p>
        )}
        {!isLoading && customers && customers.length > 0 && (
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-muted uppercase text-xs tracking-widest border-b border-input-bg">
                <th className="pb-2 font-medium">Name</th>
                <th className="pb-2 font-medium">Phone</th>
                <th className="pb-2 font-medium">Email</th>
                <th className="pb-2 font-medium text-right">Loyalty Points</th>
              </tr>
            </thead>
            <tbody>
              {customers.map((customer) => (
                <tr
                  key={customer.id}
                  className="border-b border-input-bg last:border-0"
                >
                  <td className="py-2 text-text">
                    <Link
                      href={`/customers/${customer.id}`}
                      className="hover:underline"
                    >
                      {customer.name}
                    </Link>
                  </td>
                  <td className="py-2 text-muted">{customer.phone ?? "—"}</td>
                  <td className="py-2 text-muted">{customer.email ?? "—"}</td>
                  <td className="py-2 text-text text-right">
                    {customer.loyaltyPoints}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <form
        onSubmit={handleCreate}
        className="bg-surface rounded-2xl border border-primary/10 p-6 space-y-3 max-w-md"
      >
        <h3 className="text-sm font-bold text-text">Add Customer</h3>
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
          placeholder="Phone (2547...)"
          className={FIELD_CLASS}
        />
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email (optional)"
          className={FIELD_CLASS}
        />
        {formError && <p className="text-sm text-rose-400">{formError}</p>}
        <button
          type="submit"
          disabled={submitting || !name}
          className="px-4 py-2 rounded-lg text-sm font-medium bg-primary text-white disabled:opacity-50"
        >
          {submitting ? "Adding..." : "Add Customer"}
        </button>
      </form>
    </div>
  );
}
