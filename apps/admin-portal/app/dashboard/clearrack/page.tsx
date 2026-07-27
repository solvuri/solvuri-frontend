"use client";

import { useTenants } from "@repo/data";
import { Card } from "@repo/ui";
import { StatusBadge } from "../../../components/StatusBadge";

export default function ClearrackStoresPage() {
  const { data: tenants, isLoading } = useTenants();

  const stores = tenants?.filter((t) => t.module === "clearrack") ?? [];
  const totalRevenue = stores.reduce((sum, t) => sum + t.monthlyRevenue, 0);

  return (
    <div className="p-8">
      <h1 className="text-4xl font-bebas text-text mb-8">Clearrack Stores</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Card
          title="Total Stores"
          value={isLoading ? "—" : String(stores.length)}
        />
        <Card
          title="Total Revenue"
          value={isLoading ? "—" : `KES ${totalRevenue.toLocaleString()}`}
        />
      </div>

      <div className="bg-surface rounded-2xl border border-primary/10 p-8">
        {isLoading ? (
          <p className="text-muted text-sm">Loading stores...</p>
        ) : stores.length === 0 ? (
          <p className="text-muted text-sm">No ClearRack stores yet.</p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-muted uppercase text-xs tracking-widest border-b border-input-bg">
                <th className="pb-3 font-medium">Store</th>
                <th className="pb-3 font-medium">Domain</th>
                <th className="pb-3 font-medium">Plan</th>
                <th className="pb-3 font-medium">Status</th>
                <th className="pb-3 font-medium text-right">
                  Monthly Revenue
                </th>
              </tr>
            </thead>
            <tbody>
              {stores.map((store) => (
                <tr
                  key={store.id}
                  className="border-b border-input-bg last:border-0"
                >
                  <td className="py-3 text-text">{store.name}</td>
                  <td className="py-3 text-muted">{store.domain}</td>
                  <td className="py-3 text-muted capitalize">{store.plan}</td>
                  <td className="py-3">
                    <StatusBadge status={store.status} />
                  </td>
                  <td className="py-3 text-text text-right">
                    KES {store.monthlyRevenue.toLocaleString()}
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
