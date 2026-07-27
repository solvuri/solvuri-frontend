import { describe, expect, it } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { ReactNode } from "react";
import { useTenant, useTenants } from "./tenants";

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

describe("useTenants", () => {
  it("resolves the full tenant list", async () => {
    const { result } = renderHook(() => useTenants(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data?.length).toBeGreaterThan(0);
  });
});

describe("useTenant", () => {
  it("resolves the matching tenant for a known id", async () => {
    const { result } = renderHook(() => useTenant("tnt-001"), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data?.id).toBe("tnt-001");
    expect(result.current.data?.module).toBe("clearrack");
  });

  it("resolves null for an unknown id", async () => {
    const { result } = renderHook(() => useTenant("does-not-exist"), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toBeNull();
  });
});
