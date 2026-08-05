import { describe, expect, it, vi } from "vitest";
import type { AxiosInstance } from "axios";
import {
  getRevenueReport,
  getSubscriptionStkPushStatus,
  initiateSubscriptionStkPush,
  listPayments,
  logManualPayment,
} from "./payments";

function mockClient(responseData: unknown): AxiosInstance {
  return {
    get: vi.fn().mockResolvedValue({ data: responseData }),
    post: vi.fn().mockResolvedValue({ data: responseData }),
  } as unknown as AxiosInstance;
}

describe("listPayments", () => {
  it("fetches the full payment ledger with no tenantId filter", async () => {
    const payments = [
      {
        id: 88,
        tenantId: 7,
        tenantBrandName: "Acme Retail Ltd",
        subscriptionId: 12,
        amount: 1500,
        paymentMode: "Cash",
        referenceNumber: "RCPT-0042",
        loggedByUsername: "jane.admin",
        paymentDate: "2026-07-29T10:00:00Z",
        notes: "Paid at the office in person",
      },
    ];
    const client = mockClient(payments);

    const result = await listPayments(client);

    expect(client.get).toHaveBeenCalledWith("/api/solvuri/payments", {
      params: undefined,
    });
    expect(result).toEqual(payments);
  });

  it("scopes to one merchant when a tenantId is given", async () => {
    const client = mockClient([]);

    await listPayments(client, 7);

    expect(client.get).toHaveBeenCalledWith("/api/solvuri/payments", {
      params: { tenantId: 7 },
    });
  });
});

describe("getRevenueReport", () => {
  it("fetches the platform revenue report for a date range", async () => {
    const report = {
      from: "2026-07-01T00:00:00Z",
      to: "2026-07-29T00:00:00Z",
      totalRevenue: 45500,
      paymentCount: 12,
      byPaymentMode: [
        { paymentMode: "MpesaSTK", amount: 30000, count: 8 },
        { paymentMode: "Cash", amount: 15500, count: 4 },
      ],
      byPeriod: [{ period: "2026-07-29", amount: 1500, count: 1 }],
    };
    const client = mockClient(report);

    const result = await getRevenueReport(
      client,
      "2026-07-01T00:00:00Z",
      "2026-07-29T00:00:00Z",
      "day",
    );

    expect(client.get).toHaveBeenCalledWith(
      "/api/solvuri/payments/revenue-report",
      {
        params: {
          from: "2026-07-01T00:00:00Z",
          to: "2026-07-29T00:00:00Z",
          groupBy: "day",
        },
      },
    );
    expect(result).toEqual(report);
  });
});

describe("initiateSubscriptionStkPush", () => {
  it("posts the push request and returns the checkout reference", async () => {
    const result = {
      success: true,
      message: "STK push sent",
      checkoutRequestId: "ws_CO_290720261234567890",
    };
    const client = mockClient(result);

    const output = await initiateSubscriptionStkPush(client, {
      subscriptionId: 12,
      phoneNumber: "254712345678",
      amount: 1500,
    });

    expect(client.post).toHaveBeenCalledWith("/api/solvuri/payments/stk-push", {
      subscriptionId: 12,
      phoneNumber: "254712345678",
      amount: 1500,
    });
    expect(output).toEqual(result);
  });
});

describe("getSubscriptionStkPushStatus", () => {
  it("fetches the outcome of a push by its checkout request id", async () => {
    const status = {
      checkoutRequestId: "ws_CO_290720261234567890",
      status: "Success",
      activatedFeatureIds: [5],
    };
    const client = mockClient(status);

    const result = await getSubscriptionStkPushStatus(
      client,
      "ws_CO_290720261234567890",
    );

    expect(client.get).toHaveBeenCalledWith(
      "/api/solvuri/payments/stk-push/status/ws_CO_290720261234567890",
    );
    expect(result).toEqual(status);
  });
});

describe("logManualPayment", () => {
  it("posts a manually-received payment and returns the logged row", async () => {
    const payment = {
      id: 88,
      tenantId: 7,
      tenantBrandName: "Acme Retail Ltd",
      subscriptionId: 12,
      amount: 1500,
      paymentMode: "Cash",
      referenceNumber: "RCPT-0042",
      loggedByUsername: "jane.admin",
      paymentDate: "2026-07-29T10:00:00Z",
      notes: "Paid at the office in person",
    };
    const client = mockClient(payment);

    const result = await logManualPayment(client, {
      subscriptionId: 12,
      amount: 1500,
      paymentMode: "Cash",
      referenceNumber: "RCPT-0042",
      notes: "Paid at the office in person",
    });

    expect(client.post).toHaveBeenCalledWith("/api/solvuri/payments/manual", {
      subscriptionId: 12,
      amount: 1500,
      paymentMode: "Cash",
      referenceNumber: "RCPT-0042",
      notes: "Paid at the office in person",
    });
    expect(result).toEqual(payment);
  });
});
