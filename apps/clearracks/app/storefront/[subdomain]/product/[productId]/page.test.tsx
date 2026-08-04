import { Suspense } from "react";
import { describe, expect, it, vi } from "vitest";
import { act, render, screen } from "@testing-library/react";
import ProductDetailPage from "./page";

// Regression test for the params-as-Promise bug: this page was originally
// written with `params: { productId: string }` (a plain object), which
// type-checked fine but silently received `undefined` at runtime in this
// Next.js version, since `params` is always a Promise — even for Client
// Components. If this ever regresses back to synchronous access, these
// tests fail because the product never resolves.
//
// The initial render must happen inside an awaited `act()` — the page
// suspends on `use(params)` synchronously inside `render()`, and without
// this, React schedules the retry outside of what `render()` itself awaits.

vi.mock("@/lib/merchants", () => ({
  resolveMerchantId: (subdomain: string) =>
    subdomain === "onestop" ? 1 : null,
}));

vi.mock("@/lib/clearackApi", () => ({
  useMerchantProducts: (merchantId: number | null) => {
    if (merchantId !== 1) {
      return { data: undefined, isLoading: false, error: null };
    }
    return {
      data: [
        {
          id: 101,
          productName: "Safari Linen Shirt",
          price: 2850,
          stockQuantity: 5,
          mainImageUrl: null,
          isVisible: true,
          categoryId: 1,
        },
        {
          id: 102,
          productName: "Leather Safari Bag",
          price: 8500,
          stockQuantity: 2,
          mainImageUrl: null,
          isVisible: true,
          categoryId: 1,
        },
      ],
      isLoading: false,
      error: null,
    };
  },
  useMerchantCategories: () => ({
    data: [{ id: 1, categoryName: "Accessories" }],
    isLoading: false,
    error: null,
  }),
}));

async function renderWithProviders(ui: React.ReactElement) {
  let utils!: ReturnType<typeof render>;
  await act(async () => {
    utils = render(<Suspense fallback="loading">{ui}</Suspense>);
  });
  return utils;
}

describe("ProductDetailPage", () => {
  it("renders the matching product for a known id", async () => {
    await renderWithProviders(
      <ProductDetailPage
        params={Promise.resolve({ subdomain: "onestop", productId: "101" })}
      />,
    );

    expect(await screen.findByText("Safari Linen Shirt")).toBeInTheDocument();
  });

  it("renders a different product for a different id", async () => {
    await renderWithProviders(
      <ProductDetailPage
        params={Promise.resolve({ subdomain: "onestop", productId: "102" })}
      />,
    );

    expect(await screen.findByText("Leather Safari Bag")).toBeInTheDocument();
  });

  it("shows a not-found message for an unknown id", async () => {
    await renderWithProviders(
      <ProductDetailPage
        params={Promise.resolve({ subdomain: "onestop", productId: "999" })}
      />,
    );

    expect(
      await screen.findByText("Couldn't find this product."),
    ).toBeInTheDocument();
  });
});
