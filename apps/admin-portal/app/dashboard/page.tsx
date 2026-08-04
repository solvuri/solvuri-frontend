"use client";

import { useEffect, useState } from "react";
import {
  getRevenueReport,
  listPayments,
  type Payment,
  type RevenueReport,
} from "@repo/api-client";
import { Card, Lucide } from "@repo/ui";
import { adminApi } from "../../lib/api";
import { StatusBadge } from "../../components/StatusBadge";

const { DollarSign, Receipt, Store, TrendingUp } = Lucide;

const THIRTY_DAYS_MS = 30 * 24 * 60 * 60 * 1000;

export default function AdminDashboard() {
  const [revenue, setRevenue] = useState<RevenueReport | null>(null);
  const [payments, setPayments] = useState<Payment[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const to = new Date().toISOString();
    const from = new Date(Date.now() - THIRTY_DAYS_MS).toISOString();

    // Independent fetches — a failure in one (e.g. an empty/erroring ledger)
    // must not block the other, same Promise.allSettled convention used on
    // the merchants page.
    Promise.allSettled([
      getRevenueReport(adminApi, from, to, "day"),
      listPayments(adminApi),
    ]).then(([revenueResult, paymentsResult]) => {
      if (revenueResult.status === "fulfilled") {
        setRevenue(revenueResult.value);
      } else {
        setError(
          revenueResult.reason instanceof Error
            ? revenueResult.reason.message
            : "Couldn't load the revenue report.",
        );
      }
      if (paymentsResult.status === "fulfilled") {
        setPayments(paymentsResult.value);
      }
      setIsLoading(false);
    });
  }, []);

  const uniqueMerchants = payments
    ? new Set(payments.map((p) => p.tenantId)).size
    : 0;
  const avgPayment =
    revenue && revenue.paymentCount > 0
      ? revenue.totalRevenue / revenue.paymentCount
      : 0;
  const recentPayments = payments
    ? [...payments]
        .sort(
          (a, b) =>
            new Date(b.paymentDate).getTime() -
            new Date(a.paymentDate).getTime(),
        )
        .slice(0, 8)
    : [];

  return (
    <div className="p-8">
      <h1 className="text-4xl font-bebas text-text mb-8">
        Dashboard Overview
      </h1>

      {error && (
        <p className="text-sm text-rose-400 mb-4">{error}</p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card
          title="Platform Revenue (30d)"
          value={
            isLoading ? "—" : `KES ${revenue?.totalRevenue.toLocaleString() ?? 0}`
          }
          icon={<DollarSign className="w-5 h-5" />}
        />
        <Card
          title="Payments Processed (30d)"
          value={isLoading ? "—" : String(revenue?.paymentCount ?? 0)}
          icon={<Receipt className="w-5 h-5" />}
        />
        <Card
          title="Unique Paying Merchants"
          value={isLoading ? "—" : String(uniqueMerchants)}
          icon={<Store className="w-5 h-5" />}
        />
        <Card
          title="Avg Payment Value (30d)"
          value={isLoading ? "—" : `KES ${Math.round(avgPayment).toLocaleString()}`}
          icon={<TrendingUp className="w-5 h-5" />}
        />
      </div>

      {revenue && revenue.byPaymentMode.length > 0 && (
        <div className="mt-8 bg-surface rounded-2xl border border-primary/10 p-8">
          <h2 className="text-xl font-bebas text-text tracking-wide mb-6">
            Revenue by Payment Mode (30d)
          </h2>
          <div className="flex flex-wrap gap-4">
            {revenue.byPaymentMode.map((mode) => (
              <div
                key={mode.paymentMode}
                className="bg-inputBg rounded-xl px-5 py-3"
              >
                <StatusBadge status={mode.paymentMode} />
                <p className="text-text font-bold mt-2">
                  KES {mode.amount.toLocaleString()}
                </p>
                <p className="text-muted text-xs">{mode.count} payments</p>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="mt-8 bg-surface rounded-2xl border border-primary/10 p-8">
        <h2 className="text-xl font-bebas text-text tracking-wide mb-6">
          Recent Payments
        </h2>

        {recentPayments.length === 0 ? (
          <p className="text-muted text-sm">
            {isLoading ? "Loading payments..." : "No payments logged yet."}
          </p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-muted uppercase text-xs tracking-widest border-b border-input-bg">
                <th className="pb-3 font-medium">Merchant</th>
                <th className="pb-3 font-medium">Date</th>
                <th className="pb-3 font-medium">Mode</th>
                <th className="pb-3 font-medium text-right">Amount</th>
              </tr>
            </thead>
            <tbody>
              {recentPayments.map((payment) => (
                <tr
                  key={payment.id}
                  className="border-b border-input-bg last:border-0"
                >
                  <td className="py-3 text-text">{payment.tenantBrandName}</td>
                  <td className="py-3 text-muted">
                    {new Date(payment.paymentDate).toLocaleDateString()}
                  </td>
                  <td className="py-3">
                    <StatusBadge status={payment.paymentMode} />
                  </td>
                  <td className="py-3 text-text text-right">
                    KES {payment.amount.toLocaleString()}
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
