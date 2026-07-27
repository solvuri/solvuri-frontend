// # Booking interfaces

export interface Reservation {
  id: string;
  tenantId: string;
  productId: string;
  userId: string;
  customerName: string;
  experienceName: string;
  guests: number;
  date: Date;
  status: "pending" | "confirmed" | "cancelled";
}
