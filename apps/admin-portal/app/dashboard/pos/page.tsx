"use client";

import { useSales, useTenants } from "@repo/data";
import { Card } from "@repo/ui";
import { StatusBadge } from "../../../components/StatusBadge";

export default function PosLocationsPage() {
  const { data: tenants, isLoading: tenantsLoading } = useTenants();
  const { data: sales, isLoading: salesLoading } = useSales();

  const locations = tenants?.filter((t) => t.module === "pos") ?? [];
  const totalRevenue = locations.reduce((sum, t) => sum + t.monthlyRevenue, 0);
  const recentSales = sales?.slice(0, 4) ?? [];

  return (
    <div className="p-8">
      <h1 className="text-4xl font-bebas text-text mb-8">POS Locations</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Card
          title="Total Locations"
          value={tenantsLoading ? "—" : String(locations.length)}
        />
        <Card
          title="Total Revenue"
          value={tenantsLoading ? "—" : `KES ${totalRevenue.toLocaleString()}`}
        />
      </div>

      <div className="bg-surface rounded-2xl border border-primary/10 p-8 mb-8">
        {tenantsLoading ? (
          <p className="text-muted text-sm">Loading locations...</p>
        ) : locations.length === 0 ? (
          <p className="text-muted text-sm">No POS locations yet.</p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-muted uppercase text-xs tracking-widest border-b border-input-bg">
                <th className="pb-3 font-medium">Location</th>
                <th className="pb-3 font-medium">Domain</th>
                <th className="pb-3 font-medium">Plan</th>
                <th className="pb-3 font-medium">Status</th>
                <th className="pb-3 font-medium text-right">
                  Monthly Revenue
                </th>
              </tr>
            </thead>
            <tbody>
              {locations.map((location) => (
                <tr
                  key={location.id}
                  className="border-b border-input-bg last:border-0"
                >
                  <td className="py-3 text-text">{location.name}</td>
                  <td className="py-3 text-muted">{location.domain}</td>
                  <td className="py-3 text-muted capitalize">
                    {location.plan}
                  </td>
                  <td className="py-3">
                    <StatusBadge status={location.status} />
                  </td>
                  <td className="py-3 text-text text-right">
                    KES {location.monthlyRevenue.toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <div className="bg-surface rounded-2xl border border-primary/10 p-8">
        <h2 className="text-xl font-bebas text-text tracking-wide mb-6">
          Recent Sales
        </h2>
        {salesLoading ? (
          <p className="text-muted text-sm">Loading sales...</p>
        ) : recentSales.length === 0 ? (
          <p className="text-muted text-sm">No sales yet.</p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-muted uppercase text-xs tracking-widest border-b border-input-bg">
                <th className="pb-3 font-medium">Sale</th>
                <th className="pb-3 font-medium">Payment</th>
                <th className="pb-3 font-medium text-right">Total</th>
              </tr>
            </thead>
            <tbody>
              {recentSales.map((sale) => (
                <tr
                  key={sale.id}
                  className="border-b border-input-bg last:border-0"
                >
                  <td className="py-3 text-text">{sale.id}</td>
                  <td className="py-3">
                    <StatusBadge status={sale.paymentMethod} />
                  </td>
                  <td className="py-3 text-text text-right">
                    KES {sale.total.toLocaleString()}
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
