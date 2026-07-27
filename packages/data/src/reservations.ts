import { useQuery } from "@tanstack/react-query";
import type { Reservation } from "@repo/types";
import { MOCK_RESERVATIONS } from "./mock/reservations";

// Stand-in for a real `GET /reservations` call — swap this body for a real
// endpoint once one exists. useReservations' return shape
// (data/isLoading/error) won't need to change.
function fetchReservations(): Promise<Reservation[]> {
  return Promise.resolve(MOCK_RESERVATIONS);
}

export function useReservations() {
  return useQuery({
    queryKey: ["reservations"],
    queryFn: fetchReservations,
  });
}

// Stand-in for a real `GET /reservations/:id` call — same swap-out story as
// fetchReservations above. Resolves to `null` (not `undefined`) when not
// found — React Query treats an `undefined` queryFn result as invalid and
// never transitions the query to "success".
function fetchReservation(id: string): Promise<Reservation | null> {
  return Promise.resolve(MOCK_RESERVATIONS.find((r) => r.id === id) ?? null);
}

export function useReservation(id: string) {
  return useQuery({
    queryKey: ["reservations", id],
    queryFn: () => fetchReservation(id),
    enabled: Boolean(id),
  });
}
