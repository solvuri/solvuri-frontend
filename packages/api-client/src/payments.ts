// packages/api-client/src/payments.ts
import type { AxiosInstance } from "axios";

export interface Payment {
  id: number;
  tenantId: number;
  tenantBrandName: string;
  subscriptionId: number;
  amount: number;
  paymentMode: string;
  referenceNumber: string | null;
  loggedByUsername: string | null;
  paymentDate: string;
  notes: string | null;
}

// GET /api/solvuri/payments[?tenantId=] — Solvuri Admin/SuperAdmin only.
// Full subscription payment ledger, optionally scoped to one merchant.
export async function listPayments(
  client: AxiosInstance,
  tenantId?: number,
): Promise<Payment[]> {
  const response = await client.get<Payment[]>("/api/solvuri/payments", {
    params: tenantId ? { tenantId } : undefined,
  });
  return response.data;
}

export interface RevenueByMode {
  paymentMode: string;
  amount: number;
  count: number;
}

export interface RevenueByPeriod {
  period: string;
  amount: number;
  count: number;
}

export interface RevenueReport {
  from: string;
  to: string;
  totalRevenue: number;
  paymentCount: number;
  byPaymentMode: RevenueByMode[];
  byPeriod: RevenueByPeriod[];
}

// GET /api/solvuri/payments/revenue-report?from=&to=&groupBy= — Solvuri
// Admin/SuperAdmin only. Platform revenue dashboard (groupBy: day/week/
// month/year).
export async function getRevenueReport(
  client: AxiosInstance,
  from: string,
  to: string,
  groupBy: "day" | "week" | "month" | "year" = "day",
): Promise<RevenueReport> {
  const response = await client.get<RevenueReport>(
    "/api/solvuri/payments/revenue-report",
    { params: { from, to, groupBy } },
  );
  return response.data;
}
