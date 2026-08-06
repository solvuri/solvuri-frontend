"use client";

import { useEffect, useState } from "react";
import { listPlatformUsers, type PlatformUser } from "@repo/api-client";
import { StatusBadge } from "../../../components/StatusBadge";
import { adminApi } from "../../../lib/api";

export default function UsersPage() {
  const [users, setUsers] = useState<PlatformUser[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    listPlatformUsers(adminApi)
      .then(setUsers)
      .catch((err) =>
        setError(
          err instanceof Error ? err.message : "Couldn't load users.",
        ),
      )
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <div className="p-8">
      <h1 className="text-4xl font-bebas text-text mb-8">Users</h1>

      <div className="bg-surface rounded-2xl border border-primary/10 p-8">
        {isLoading ? (
          <p className="text-muted text-sm">Loading users...</p>
        ) : error ? (
          <p className="text-sm text-rose-400">{error}</p>
        ) : !users || users.length === 0 ? (
          <p className="text-muted text-sm">No users found.</p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-muted uppercase text-xs tracking-widest border-b border-input-bg">
                <th className="pb-3 font-medium">Username</th>
                <th className="pb-3 font-medium">Email</th>
                <th className="pb-3 font-medium">Scope</th>
                <th className="pb-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr
                  key={user.id}
                  className="border-b border-input-bg last:border-0"
                >
                  <td className="py-3 text-text">{user.username}</td>
                  <td className="py-3 text-muted">{user.email}</td>
                  <td className="py-3 text-muted">
                    {user.tenantId === null
                      ? "Platform admin"
                      : `Tenant #${user.tenantId}`}
                  </td>
                  <td className="py-3">
                    <StatusBadge
                      status={user.isActive ? "active" : "inactive"}
                    />
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
