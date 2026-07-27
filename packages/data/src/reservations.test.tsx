import { describe, expect, it } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { ReactNode } from "react";
import { useReservation, useReservations } from "./reservations";

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

describe("useReservations", () => {
  it("resolves the full reservation list", async () => {
    const { result } = renderHook(() => useReservations(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data?.length).toBeGreaterThan(0);
  });
});

describe("useReservation", () => {
  it("resolves the matching reservation for a known id", async () => {
    const { result } = renderHook(() => useReservation("res-001"), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data?.id).toBe("res-001");
    expect(result.current.data?.status).toBe("confirmed");
  });

  it("resolves null for an unknown id", async () => {
    const { result } = renderHook(() => useReservation("does-not-exist"), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toBeNull();
  });
});
