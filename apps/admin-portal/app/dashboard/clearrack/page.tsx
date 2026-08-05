"use client";

import { useEffect, useState } from "react";
import {
  type MerchantSubscriptionSummary,
  type TenantSummary,
  getTenantSubscription,
  listTenants,
} from "@repo/api-client";
import { Card } from "@repo/ui";
import { adminApi } from "../../../lib/api";
import { StatusBadge } from "../../../components/StatusBadge";

interface ClearrackStore {
  tenant: TenantSummary;
  subscription: MerchantSubscriptionSummary;
}

export default function ClearrackStoresPage() {
  const [stores, setStores] = useState<ClearrackStore[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    (async () => {
      setIsLoading(true);
      setError("");

      let tenants: TenantSummary[];
      try {
        tenants = await listTenants(adminApi);
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof Error
              ? err.message
              : "Couldn't load the merchant directory.",
          );
          setStores([]);
          setIsLoading(false);
        }
        return;
      }

      // Each tenant's subscription is fetched independently — one tenant's
      // subscription lookup failing shouldn't hide the others.
      const subscriptions = await Promise.allSettled(
        tenants.map((tenant) => getTenantSubscription(adminApi, tenant.id)),
      );

      const clearrackStores: ClearrackStore[] = [];
      subscriptions.forEach((result, i) => {
        if (
          result.status === "fulfilled" &&
          result.value.categories.some(
            (c) => c.name.trim().toLowerCase() === "clearack",
          )
        ) {
          clearrackStores.push({
            tenant: tenants[i],
            subscription: result.value,
          });
        }
      });

      if (!cancelled) {
        setStores(clearrackStores);
        setIsLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  const totalRevenue = (stores ?? []).reduce(
    (sum, store) => sum + store.subscription.totalMonthlyCost,
    0,
  );

  return (
    <div className="p-8">
      <h1 className="text-4xl font-bebas text-text mb-8">Clearrack Stores</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Card
          title="Total Stores"
          value={isLoading ? "—" : String(stores?.length ?? 0)}
        />
        <Card
          title="Total Monthly Revenue"
          value={isLoading ? "—" : `KES ${totalRevenue.toLocaleString()}`}
        />
      </div>

      <div className="bg-surface rounded-2xl border border-primary/10 p-8 mb-8">
        {isLoading ? (
          <p className="text-muted text-sm">Loading stores...</p>
        ) : error ? (
          <p className="text-sm text-rose-400">{error}</p>
        ) : !stores || stores.length === 0 ? (
          <p className="text-muted text-sm">No ClearRack stores yet.</p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-muted uppercase text-xs tracking-widest border-b border-input-bg">
                <th className="pb-3 font-medium">Store</th>
                <th className="pb-3 font-medium">Domain</th>
                <th className="pb-3 font-medium">Status</th>
                <th className="pb-3 font-medium text-right">Monthly Cost</th>
              </tr>
            </thead>
            <tbody>
              {stores.map(({ tenant, subscription }) => (
                <tr
                  key={tenant.id}
                  className="border-b border-input-bg last:border-0"
                >
                  <td className="py-3 text-text">{tenant.brandName}</td>
                  <td className="py-3 text-muted">{tenant.domainName}</td>
                  <td className="py-3">
                    <StatusBadge
                      status={tenant.subscription?.status ?? "unknown"}
                    />
                  </td>
                  <td className="py-3 text-text text-right">
                    KES {subscription.totalMonthlyCost.toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <div className="bg-accent/10 border border-accent/30 rounded-2xl px-6 py-4">
        <p className="text-accent text-sm">
          Per-store order and sales activity isn&apos;t shown here — the real
          Clearack API has no admin-accessible order-listing endpoint, only a
          single order lookup scoped to the storefront that placed it. This
          view shows subscription and billing status only.
        </p>
      </div>
    </div>
  );
}
