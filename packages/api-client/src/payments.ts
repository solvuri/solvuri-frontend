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

export interface SubscriptionStkPushInput {
  subscriptionId: number;
  phoneNumber: string;
  amount: number;
  featureIds?: number[] | null;
}

export interface SubscriptionStkPushResult {
  success: boolean;
  message: string;
  checkoutRequestId: string;
}

// POST /api/solvuri/payments/stk-push — Solvuri Admin/SuperAdmin only. Push
// an STK prompt to a merchant's phone via Solvuri's own static till, to
// collect their subscription fee. featureIds omitted/null = "whatever is
// currently unpaid, once this succeeds."
export async function initiateSubscriptionStkPush(
  client: AxiosInstance,
  input: SubscriptionStkPushInput,
): Promise<SubscriptionStkPushResult> {
  const response = await client.post<SubscriptionStkPushResult>(
    "/api/solvuri/payments/stk-push",
    input,
  );
  return response.data;
}

export interface SubscriptionStkPushStatus {
  checkoutRequestId: string;
  status: string;
  activatedFeatureIds: number[];
}

// GET /api/solvuri/payments/stk-push/status/{checkoutRequestId} — Solvuri
// Admin/SuperAdmin only. Actively resolves a Pending push (queries Daraja,
// doesn't just wait on the webhook) — poll this every few seconds until
// `status` leaves "Pending", same mechanics as every other STK flow in
// this API (see apps/clearracks' checkout status polling).
export async function getSubscriptionStkPushStatus(
  client: AxiosInstance,
  checkoutRequestId: string,
): Promise<SubscriptionStkPushStatus> {
  const response = await client.get<SubscriptionStkPushStatus>(
    `/api/solvuri/payments/stk-push/status/${checkoutRequestId}`,
  );
  return response.data;
}

export type PaymentMode = "Cash" | "Card" | "BankDeposit" | "Paybill" | "Till";

export interface ManualPaymentInput {
  subscriptionId: number;
  amount: number;
  paymentMode: PaymentMode;
  referenceNumber?: string;
  paymentDate?: string;
  notes?: string;
  extendDays?: number;
  featureIds?: number[] | null;
}

// POST /api/solvuri/payments/manual — Solvuri Admin/SuperAdmin only. Logs a
// subscription payment received outside STK (cash, card, bank deposit,
// paybill, till), optionally overriding the extension length directly via
// extendDays. Returns the logged payment row (same shape as listPayments).
export async function logManualPayment(
  client: AxiosInstance,
  input: ManualPaymentInput,
): Promise<Payment> {
  const response = await client.post<Payment>(
    "/api/solvuri/payments/manual",
    input,
  );
  return response.data;
}
