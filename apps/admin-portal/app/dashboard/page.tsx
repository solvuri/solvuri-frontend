"use client";

import { useEffect, useState } from "react";
import {
  getRevenueReport,
  listPayments,
  type Payment,
  type RevenueReport,
} from "@repo/api-client";
import { Button, Card, Input, Lucide } from "@repo/ui";
import { adminApi } from "../../lib/api";
import { StatusBadge } from "../../components/StatusBadge";

const { DollarSign, Receipt, Store, TrendingUp } = Lucide;

const DAY_MS = 24 * 60 * 60 * 1000;

const toDateInputValue = (date: Date) => date.toISOString().slice(0, 10);

const DEFAULT_TO = toDateInputValue(new Date());
const DEFAULT_FROM = toDateInputValue(new Date(Date.now() - 30 * DAY_MS));

const formatRangeLabel = (from: string, to: string) => {
  const opts: Intl.DateTimeFormatOptions = { month: "short", day: "numeric" };
  const fromLabel = new Date(`${from}T00:00:00`).toLocaleDateString(
    "en-US",
    opts,
  );
  const toLabel = new Date(`${to}T00:00:00`).toLocaleDateString(
    "en-US",
    opts,
  );
  return `${fromLabel} – ${toLabel}`;
};

export default function AdminDashboard() {
  const [revenue, setRevenue] = useState<RevenueReport | null>(null);
  const [payments, setPayments] = useState<Payment[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const [appliedFrom, setAppliedFrom] = useState(DEFAULT_FROM);
  const [appliedTo, setAppliedTo] = useState(DEFAULT_TO);
  const [fromInput, setFromInput] = useState(DEFAULT_FROM);
  const [toInput, setToInput] = useState(DEFAULT_TO);
  const [rangeError, setRangeError] = useState("");

  const loadRevenue = (from: string, to: string) => {
    setIsLoading(true);
    setError("");
    const fromIso = new Date(`${from}T00:00:00.000Z`).toISOString();
    const toIso = new Date(`${to}T23:59:59.999Z`).toISOString();

    // Independent fetches — a failure in one (e.g. an empty/erroring ledger)
    // must not block the other, same Promise.allSettled convention used on
    // the merchants page. listPayments has no date-range params in the
    // documented API, so the Recent Payments table below is always the
    // full ledger — only the revenue report respects the selected range.
    Promise.allSettled([
      getRevenueReport(adminApi, fromIso, toIso, "day"),
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
  };

  useEffect(() => {
    loadRevenue(appliedFrom, appliedTo);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const applyRange = () => {
    if (!fromInput || !toInput) {
      setRangeError("Pick both a start and end date.");
      return;
    }
    if (fromInput > toInput) {
      setRangeError("Start date must be before the end date.");
      return;
    }
    setRangeError("");
    setAppliedFrom(fromInput);
    setAppliedTo(toInput);
    loadRevenue(fromInput, toInput);
  };

  const resetToLast30Days = () => {
    setFromInput(DEFAULT_FROM);
    setToInput(DEFAULT_TO);
    setRangeError("");
    setAppliedFrom(DEFAULT_FROM);
    setAppliedTo(DEFAULT_TO);
    loadRevenue(DEFAULT_FROM, DEFAULT_TO);
  };

  const rangeLabel = formatRangeLabel(appliedFrom, appliedTo);

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

      <div className="bg-surface rounded-2xl border border-primary/10 p-6 mb-8 flex flex-wrap items-end gap-4">
        <div className="w-40">
          <Input
            label="From"
            type="date"
            value={fromInput}
            max={toInput}
            onChange={(e) => setFromInput(e.target.value)}
          />
        </div>
        <div className="w-40">
          <Input
            label="To"
            type="date"
            value={toInput}
            min={fromInput}
            max={DEFAULT_TO}
            onChange={(e) => setToInput(e.target.value)}
          />
        </div>
        <Button type="button" variant="accent" onClick={applyRange}>
          Apply Range
        </Button>
        <Button type="button" variant="secondary" onClick={resetToLast30Days}>
          Last 30 Days
        </Button>
        {rangeError && (
          <p className="text-sm text-rose-400 basis-full">{rangeError}</p>
        )}
      </div>

      {error && <p className="text-sm text-rose-400 mb-4">{error}</p>}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card
          title={`Platform Revenue (${rangeLabel})`}
          value={
            isLoading ? "—" : `KES ${revenue?.totalRevenue.toLocaleString() ?? 0}`
          }
          icon={<DollarSign className="w-5 h-5" />}
        />
        <Card
          title={`Payments Processed (${rangeLabel})`}
          value={isLoading ? "—" : String(revenue?.paymentCount ?? 0)}
          icon={<Receipt className="w-5 h-5" />}
        />
        <Card
          title="Unique Paying Merchants"
          value={isLoading ? "—" : String(uniqueMerchants)}
          icon={<Store className="w-5 h-5" />}
        />
        <Card
          title="Avg Payment Value"
          value={isLoading ? "—" : `KES ${Math.round(avgPayment).toLocaleString()}`}
          icon={<TrendingUp className="w-5 h-5" />}
        />
      </div>

      {revenue && revenue.byPaymentMode.length > 0 && (
        <div className="mt-8 bg-surface rounded-2xl border border-primary/10 p-8">
          <h2 className="text-xl font-bebas text-text tracking-wide mb-6">
            Revenue by Payment Mode ({rangeLabel})
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
