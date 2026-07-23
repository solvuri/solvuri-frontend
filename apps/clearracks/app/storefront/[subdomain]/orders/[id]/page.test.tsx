import { Suspense } from "react";
import { describe, expect, it } from "vitest";
import { act, render, screen } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import OrderDetailsPage from "./page";

// Same params-as-Promise regression coverage as the product detail page
// test — see that file for why the render must be wrapped in an awaited
// `act()`.
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

describe("OrderDetailsPage", () => {
  it("renders the matching order for a known id", async () => {
    await renderWithProviders(
      <OrderDetailsPage params={Promise.resolve({ id: "ORD-8700" })} />,
    );

    expect(await screen.findByText("Order #ORD-8700")).toBeInTheDocument();
  });

  it("renders a different order for a different id", async () => {
    await renderWithProviders(
      <OrderDetailsPage params={Promise.resolve({ id: "ORD-4421" })} />,
    );

    expect(await screen.findByText("Order #ORD-4421")).toBeInTheDocument();
  });

  it("shows a not-found message for an unknown id", async () => {
    await renderWithProviders(
      <OrderDetailsPage params={Promise.resolve({ id: "does-not-exist" })} />,
    );

    expect(
      await screen.findByText("Couldn't find this order."),
    ).toBeInTheDocument();
  });
});
