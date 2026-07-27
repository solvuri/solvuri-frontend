import { useQuery } from "@tanstack/react-query";
import type { Tenant } from "@repo/types";
import { MOCK_TENANTS } from "./mock/tenants";

// Stand-in for a real `GET /tenants` call — swap this body for a real
// endpoint once one exists. useTenants' return shape (data/isLoading/error)
// won't need to change.
function fetchTenants(): Promise<Tenant[]> {
  return Promise.resolve(MOCK_TENANTS);
}

export function useTenants() {
  return useQuery({
    queryKey: ["tenants"],
    queryFn: fetchTenants,
  });
}

// Stand-in for a real `GET /tenants/:id` call — same swap-out story as
// fetchTenants above. Resolves to `null` (not `undefined`) when not found —
// React Query treats an `undefined` queryFn result as invalid and never
// transitions the query to "success".
function fetchTenant(id: string): Promise<Tenant | null> {
  return Promise.resolve(MOCK_TENANTS.find((t) => t.id === id) ?? null);
}

export function useTenant(id: string) {
  return useQuery({
    queryKey: ["tenants", id],
    queryFn: () => fetchTenant(id),
    enabled: Boolean(id),
  });
}
