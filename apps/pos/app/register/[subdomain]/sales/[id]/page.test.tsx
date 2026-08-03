import { Suspense } from "react";
import { describe, expect, it } from "vitest";
import { act, render, screen } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import SaleDetailPage from "./page";

// params is a Promise in this Next.js version, even for Client Components —
// the render must be wrapped in an awaited `act()` or the component's
// initial suspend on `use(params)` happens outside what render() awaits and
// the test hangs on the Suspense fallback.
async function renderWithProviders(ui: React.ReactElement) {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  let utils!: ReturnType<typeof render>;
  await act(async () => {
    utils = render(
      <QueryClientProvider client={queryClient}>
        <Suspense fallback="loading">{ui}</Suspense>
      </QueryClientProvider>,
    );
  });
  return utils;
}

describe("SaleDetailPage", () => {
  it("renders the matching sale for a known id", async () => {
    await renderWithProviders(
      <SaleDetailPage
        params={Promise.resolve({ subdomain: "demo", id: "sale-001" })}
      />,
    );

    expect(await screen.findByText("Sale #sale-001")).toBeInTheDocument();
  });

  it("renders a different sale for a different id", async () => {
    await renderWithProviders(
      <SaleDetailPage
        params={Promise.resolve({ subdomain: "demo", id: "sale-002" })}
      />,
    );

    expect(await screen.findByText("Sale #sale-002")).toBeInTheDocument();
  });

  it("shows a not-found message for an unknown id", async () => {
    await renderWithProviders(
      <SaleDetailPage
        params={Promise.resolve({ subdomain: "demo", id: "does-not-exist" })}
      />,
    );

    expect(
      await screen.findByText("Couldn't find this sale."),
    ).toBeInTheDocument();
  });
});
