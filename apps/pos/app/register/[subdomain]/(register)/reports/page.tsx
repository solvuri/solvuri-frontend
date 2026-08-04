"use client";

import { useState } from "react";
import { getMerchantId, useCurrentUser } from "@/lib/auth";
import {
  useCashierReport,
  usePaymentMethodReport,
  useProfitReport,
  useReturnsReport,
  useSalesReport,
  useTaxReport,
  useTopCustomers,
  useTopProducts,
} from "@/lib/posApi";

function isoDate(date: Date): string {
  return date.toISOString().slice(0, 10);
}

export default function ReportsPage() {
  const merchantId = getMerchantId();
  const user = useCurrentUser();

  const [from, setFrom] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() - 30);
    return isoDate(d);
  });
  const [to, setTo] = useState(() => isoDate(new Date()));

  const { data: sales } = useSalesReport(merchantId, from, to);
  const { data: profit } = useProfitReport(merchantId, from, to);
  const { data: tax } = useTaxReport(merchantId, from, to);
  const { data: topProducts } = useTopProducts(merchantId, from, to);
  const { data: topCustomers } = useTopCustomers(merchantId, from, to);
  const { data: cashiers } = useCashierReport(merchantId, from, to);
  const { data: paymentMethods } = usePaymentMethodReport(merchantId, from, to);
  const { data: returns } = useReturnsReport(merchantId, from, to);

  if (user && user.appRole !== "Merchant") {
    return (
      <p className="text-muted text-sm">
        Reports are only available to the store owner.
      </p>
    );
  }

  return (
    <div className="max-w-4xl space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bebas text-text">Reports</h2>
        <div className="flex items-center gap-2 text-sm">
          <input
            type="date"
            value={from}
            onChange={(e) => setFrom(e.target.value)}
            className="bg-inputBg border border-primary/10 rounded-lg p-2 text-text"
          />
          <span className="text-muted">to</span>
          <input
            type="date"
            value={to}
            onChange={(e) => setTo(e.target.value)}
            className="bg-inputBg border border-primary/10 rounded-lg p-2 text-text"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-surface rounded-2xl border border-primary/10 p-5">
          <p className="text-xs text-muted uppercase tracking-widest mb-1">
            Sales
          </p>
          <p className="text-xl font-bold text-text">
            KES {(sales?.totalRevenue ?? 0).toLocaleString()}
          </p>
          <p className="text-xs text-muted">{sales?.saleCount ?? 0} sales</p>
        </div>
        <div className="bg-surface rounded-2xl border border-primary/10 p-5">
          <p className="text-xs text-muted uppercase tracking-widest mb-1">
            Profit
          </p>
          <p className="text-xl font-bold text-text">
            KES {(profit?.totalProfit ?? 0).toLocaleString()}
          </p>
          <p className="text-xs text-muted">
            Revenue {(profit?.totalRevenue ?? 0).toLocaleString()} — Cost{" "}
            {(profit?.totalCost ?? 0).toLocaleString()}
          </p>
        </div>
        <div className="bg-surface rounded-2xl border border-primary/10 p-5">
          <p className="text-xs text-muted uppercase tracking-widest mb-1">
            Tax Collected
          </p>
          <p className="text-xl font-bold text-text">
            KES {(tax?.totalTax ?? 0).toLocaleString()}
          </p>
          <p className="text-xs text-muted">
            Taxable revenue {(tax?.taxableRevenue ?? 0).toLocaleString()}
          </p>
        </div>
      </div>

      {sales && sales.byDay.length > 0 && (
        <div className="bg-surface rounded-2xl border border-primary/10 p-6">
          <h3 className="text-sm font-bold text-text mb-4">Sales by Day</h3>
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-muted uppercase text-xs tracking-widest border-b border-input-bg">
                <th className="pb-2 font-medium">Date</th>
                <th className="pb-2 font-medium text-right">Sales</th>
                <th className="pb-2 font-medium text-right">Revenue</th>
              </tr>
            </thead>
            <tbody>
              {sales.byDay.map((day) => (
                <tr key={day.date} className="border-b border-input-bg last:border-0">
                  <td className="py-2 text-text">
                    {new Date(day.date).toLocaleDateString()}
                  </td>
                  <td className="py-2 text-muted text-right">
                    {day.saleCount}
                  </td>
                  <td className="py-2 text-text text-right">
                    KES {day.revenue.toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-surface rounded-2xl border border-primary/10 p-6">
          <h3 className="text-sm font-bold text-text mb-4">Top Products</h3>
          {!topProducts || topProducts.length === 0 ? (
            <p className="text-muted text-xs">No sales in this range.</p>
          ) : (
            <ul className="space-y-2 text-sm">
              {topProducts.map((p) => (
                <li key={p.productId} className="flex justify-between">
                  <span className="text-text">{p.productName}</span>
                  <span className="text-muted">
                    {p.unitsSold} sold — KES {p.revenue.toLocaleString()}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="bg-surface rounded-2xl border border-primary/10 p-6">
          <h3 className="text-sm font-bold text-text mb-4">Top Customers</h3>
          {!topCustomers || topCustomers.length === 0 ? (
            <p className="text-muted text-xs">No sales in this range.</p>
          ) : (
            <ul className="space-y-2 text-sm">
              {topCustomers.map((c, i) => (
                <li key={i} className="flex justify-between">
                  <span className="text-text">{c.customerName}</span>
                  <span className="text-muted">
                    {c.orderCount} orders — KES {c.totalSpent.toLocaleString()}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="bg-surface rounded-2xl border border-primary/10 p-6">
          <h3 className="text-sm font-bold text-text mb-4">By Cashier</h3>
          {!cashiers || cashiers.length === 0 ? (
            <p className="text-muted text-xs">No sales in this range.</p>
          ) : (
            <ul className="space-y-2 text-sm">
              {cashiers.map((c) => (
                <li key={c.cashierUserId} className="flex justify-between">
                  <span className="text-text">{c.cashierName}</span>
                  <span className="text-muted">
                    {c.saleCount} sales — KES {c.revenue.toLocaleString()}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="bg-surface rounded-2xl border border-primary/10 p-6">
          <h3 className="text-sm font-bold text-text mb-4">
            By Payment Method
          </h3>
          {!paymentMethods || paymentMethods.length === 0 ? (
            <p className="text-muted text-xs">No sales in this range.</p>
          ) : (
            <ul className="space-y-2 text-sm">
              {paymentMethods.map((m) => (
                <li key={m.method} className="flex justify-between">
                  <span className="text-text">{m.method}</span>
                  <span className="text-muted">
                    {m.count} — KES {m.totalAmount.toLocaleString()}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <div className="bg-surface rounded-2xl border border-primary/10 p-6">
        <h3 className="text-sm font-bold text-text mb-4">Returns</h3>
        <div className="flex gap-6 text-sm">
          <span className="text-muted">
            Refunds:{" "}
            <span className="text-text font-bold">
              {returns?.refundCount ?? 0}
            </span>{" "}
            (KES {(returns?.totalRefunded ?? 0).toLocaleString()})
          </span>
          <span className="text-muted">
            Voids:{" "}
            <span className="text-text font-bold">
              {returns?.voidCount ?? 0}
            </span>
          </span>
        </div>
      </div>
    </div>
  );
}
