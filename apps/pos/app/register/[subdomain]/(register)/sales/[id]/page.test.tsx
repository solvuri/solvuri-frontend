import { Suspense } from "react";
import { describe, expect, it, vi } from "vitest";
import { act, render, screen } from "@testing-library/react";
import SaleDetailPage from "./page";

// params is a Promise in this Next.js version, even for Client Components —
// the render must be wrapped in an awaited `act()` or the component's
// initial suspend on `use(params)` happens outside what render() awaits and
// the test hangs on the Suspense fallback.

vi.mock("@/lib/auth", () => ({
  getMerchantId: () => 1,
}));

vi.mock("@/lib/posApi", () => ({
  useSale: (merchantId: number | null, saleId: number | null) => {
    if (merchantId !== 1 || (saleId !== 101 && saleId !== 102)) {
      return { data: undefined, isLoading: false, error: null };
    }
    const sale =
      saleId === 101
        ? {
            id: 101,
            createdAt: "2026-08-01T10:00:00Z",
            customerName: "Walk-in Customer",
            totalAmount: 1200,
            status: "Completed",
            paymentStatus: "Paid",
            items: [
              { orderItemId: 1, productId: 1, productName: "Wireless Mouse", quantity: 1, price: 1200 },
            ],
            payments: [{ id: 1, method: "Cash", amount: 1200, referenceNumber: null, status: "Completed" }],
          }
        : {
            id: 102,
            createdAt: "2026-08-01T11:00:00Z",
            customerName: "Mary Wanjiru",
            totalAmount: 1800,
            status: "Completed",
            paymentStatus: "Paid",
            items: [
              { orderItemId: 2, productId: 2, productName: "USB-C Fast Charger", quantity: 1, price: 1800 },
            ],
            payments: [{ id: 2, method: "Mpesa", amount: 1800, referenceNumber: "QGH7X8Y9Z0", status: "Completed" }],
          };
    return { data: sale, isLoading: false, error: null };
  },
}));

async function renderWithProviders(ui: React.ReactElement) {
  let utils!: ReturnType<typeof render>;
  await act(async () => {
    utils = render(<Suspense fallback="loading">{ui}</Suspense>);
  });
  return utils;
}

describe("SaleDetailPage", () => {
  it("renders the matching sale for a known id", async () => {
    await renderWithProviders(
      <SaleDetailPage params={Promise.resolve({ subdomain: "demo", id: "101" })} />,
    );

    expect(await screen.findByText("Sale #101")).toBeInTheDocument();
  });

  it("renders a different sale for a different id", async () => {
    await renderWithProviders(
      <SaleDetailPage params={Promise.resolve({ subdomain: "demo", id: "102" })} />,
    );

    expect(await screen.findByText("Sale #102")).toBeInTheDocument();
  });

  it("shows a not-found message for an unknown id", async () => {
    await renderWithProviders(
      <SaleDetailPage params={Promise.resolve({ subdomain: "demo", id: "999" })} />,
    );

    expect(
      await screen.findByText("Couldn't find this sale."),
    ).toBeInTheDocument();
  });
});
