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

interface PosLocation {
  tenant: TenantSummary;
  subscription: MerchantSubscriptionSummary;
}

export default function PosLocationsPage() {
  const [locations, setLocations] = useState<PosLocation[] | null>(null);
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
          setLocations([]);
          setIsLoading(false);
        }
        return;
      }

      // Each tenant's subscription is fetched independently — one tenant's
      // subscription lookup failing shouldn't hide the others.
      const subscriptions = await Promise.allSettled(
        tenants.map((tenant) => getTenantSubscription(adminApi, tenant.id)),
      );

      const posLocations: PosLocation[] = [];
      subscriptions.forEach((result, i) => {
        if (
          result.status === "fulfilled" &&
          result.value.categories.some(
            (c) => c.name.trim().toLowerCase() === "pos",
          )
        ) {
          posLocations.push({ tenant: tenants[i], subscription: result.value });
        }
      });

      if (!cancelled) {
        setLocations(posLocations);
        setIsLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  const totalRevenue = (locations ?? []).reduce(
    (sum, loc) => sum + loc.subscription.totalMonthlyCost,
    0,
  );

  return (
    <div className="p-8">
      <h1 className="text-4xl font-bebas text-text mb-8">POS Locations</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Card
          title="POS Locations"
          value={isLoading ? "—" : String(locations?.length ?? 0)}
        />
        <Card
          title="Total Monthly Revenue"
          value={isLoading ? "—" : `KES ${totalRevenue.toLocaleString()}`}
        />
      </div>

      <div className="bg-surface rounded-2xl border border-primary/10 p-8 mb-8">
        {isLoading ? (
          <p className="text-muted text-sm">Loading POS locations...</p>
        ) : error ? (
          <p className="text-sm text-rose-400">{error}</p>
        ) : !locations || locations.length === 0 ? (
          <p className="text-muted text-sm">No POS locations yet.</p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-muted uppercase text-xs tracking-widest border-b border-input-bg">
                <th className="pb-3 font-medium">Brand</th>
                <th className="pb-3 font-medium">Domain</th>
                <th className="pb-3 font-medium">Status</th>
                <th className="pb-3 font-medium text-right">Monthly Cost</th>
              </tr>
            </thead>
            <tbody>
              {locations.map(({ tenant, subscription }) => (
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
          Per-sale POS activity — transactions, till sessions, inventory — is
          only visible from within the POS register app itself, logged in as
          the merchant or one of their cashiers. This view shows subscription
          and billing status only.
        </p>
      </div>
    </div>
  );
}
