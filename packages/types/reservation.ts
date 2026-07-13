// # Booking interfaces

export interface Reservation {
  id: string;
  tenantId: string;
  productId: string;
  userId: string;
  date: Date;
  status: "pending" | "confirmed" | "cancelled";
}
