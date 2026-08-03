import { describe, expect, it } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { ReactNode } from "react";
import { useSale, useSales } from "./sales";

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return function Wrapper({ children }: { children: ReactNode }) {
    return (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );
  };
}

describe("useSales", () => {
  it("resolves the full sale list", async () => {
    const { result } = renderHook(() => useSales(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data?.length).toBeGreaterThan(0);
  });
});

describe("useSale", () => {
  it("resolves the matching sale for a known id", async () => {
    const { result } = renderHook(() => useSale("sale-001"), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data?.id).toBe("sale-001");
    expect(result.current.data?.paymentMethod).toBe("cash");
  });

  it("resolves null for an unknown id", async () => {
    const { result } = renderHook(() => useSale("does-not-exist"), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toBeNull();
  });
});
