import { Suspense } from "react";
import { describe, expect, it } from "vitest";
import { act, render, screen } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import ProductDetailPage from "./page";

// Regression test for the params-as-Promise bug: this page was originally
// written with `params: { productId: string }` (a plain object), which
// type-checked fine but silently received `undefined` at runtime in this
// Next.js version, since `params` is always a Promise — even for Client
// Components. If this ever regresses back to synchronous access, these
// tests fail because the product/order never resolves.
//
// The initial render must happen inside an awaited `act()` — the page
// suspends on `use(params)` synchronously inside `render()`, and without
// this, React schedules the retry outside of what `render()` itself awaits.
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

describe("ProductDetailPage", () => {
  it("renders the matching product for a known id", async () => {
    await renderWithProviders(
      <ProductDetailPage params={Promise.resolve({ productId: "prod-1" })} />,
    );

    expect(await screen.findByText("Safari Linen Shirt")).toBeInTheDocument();
  });

  it("renders a different product for a different id", async () => {
    await renderWithProviders(
      <ProductDetailPage params={Promise.resolve({ productId: "prod-2" })} />,
    );

    expect(await screen.findByText("Leather Safari Bag")).toBeInTheDocument();
  });

  it("shows a not-found message for an unknown id", async () => {
    await renderWithProviders(
      <ProductDetailPage
        params={Promise.resolve({ productId: "does-not-exist" })}
      />,
    );

    expect(
      await screen.findByText("Couldn't find this product."),
    ).toBeInTheDocument();
  });
});
