"use client";

import { useEffect, useState } from "react";
import {
  listTenantRequests,
  updateTenantRequestStatus,
} from "@repo/api-client";
import type { TenantRequest } from "@repo/types";
import { StatusBadge } from "../../../components/StatusBadge";
import { adminApi } from "../../../lib/api";

export default function TenantRequestsPage() {
  const [requests, setRequests] = useState<TenantRequest[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [actioningId, setActioningId] = useState<number | null>(null);

  const load = () => {
    setIsLoading(true);
    listTenantRequests(adminApi)
      .then(setRequests)
      .catch((err) =>
        setError(
          err instanceof Error ? err.message : "Couldn't load requests.",
        ),
      )
      .finally(() => setIsLoading(false));
  };

  useEffect(load, []);

  const handleStatus = async (id: number, status: "Approved" | "Rejected") => {
    setActioningId(id);
    setError("");
    try {
      await updateTenantRequestStatus(adminApi, id, status);
      load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Couldn't update request.");
    } finally {
      setActioningId(null);
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-4xl font-bebas text-text mb-2">
        Tenant / License Requests
      </h1>
      <p className="text-muted text-sm mb-8">
        Applications submitted via the public contact form&apos;s Super
        License option. Approving a request does not create the merchant
        account automatically — do that separately from the Merchants page
        once you&apos;ve reviewed it.
      </p>

      <div className="bg-surface rounded-2xl border border-primary/10 p-8">
        {isLoading ? (
          <p className="text-muted text-sm">Loading requests...</p>
        ) : error ? (
          <p className="text-sm text-rose-400">{error}</p>
        ) : !requests || requests.length === 0 ? (
          <p className="text-muted text-sm">No requests found.</p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-muted uppercase text-xs tracking-widest border-b border-input-bg">
                <th className="pb-3 font-medium">Applicant</th>
                <th className="pb-3 font-medium">Brand</th>
                <th className="pb-3 font-medium">Contact</th>
                <th className="pb-3 font-medium">Systems</th>
                <th className="pb-3 font-medium">Description</th>
                <th className="pb-3 font-medium">Status</th>
                <th className="pb-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {requests.map((req) => (
                <tr
                  key={req.id}
                  className="border-b border-input-bg last:border-0 align-top"
                >
                  <td className="py-3 text-text">
                    {[req.firstName, req.middleName, req.lastName]
                      .filter(Boolean)
                      .join(" ")}
                  </td>
                  <td className="py-3 text-muted">{req.brandName}</td>
                  <td className="py-3 text-muted">
                    <div>{req.email}</div>
                    <div>{req.phoneNumber}</div>
                  </td>
                  <td className="py-3 text-muted">{req.requestedSystems}</td>
                  <td className="py-3 text-muted max-w-xs">
                    {req.businessDescription}
                  </td>
                  <td className="py-3">
                    <StatusBadge
                      status={
                        req.status === "Approved"
                          ? "active"
                          : req.status === "Rejected"
                            ? "inactive"
                            : "pending"
                      }
                    />
                  </td>
                  <td className="py-3">
                    {req.status === "Pending" ? (
                      <div className="flex gap-2">
                        <button
                          type="button"
                          disabled={actioningId === req.id}
                          onClick={() => handleStatus(req.id, "Approved")}
                          className="text-xs px-3 py-1.5 rounded-lg bg-emerald-500/15 text-emerald-400 hover:bg-emerald-500/25 disabled:opacity-50 cursor-pointer"
                        >
                          Approve
                        </button>
                        <button
                          type="button"
                          disabled={actioningId === req.id}
                          onClick={() => handleStatus(req.id, "Rejected")}
                          className="text-xs px-3 py-1.5 rounded-lg bg-rose-500/15 text-rose-400 hover:bg-rose-500/25 disabled:opacity-50 cursor-pointer"
                        >
                          Reject
                        </button>
                      </div>
                    ) : (
                      <span className="text-muted text-xs">—</span>
                    )}
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
