"use client";

import { useReservations } from "@repo/data";
import { Card } from "@repo/ui";
import { StatusBadge } from "../../../components/StatusBadge";

export default function SafyriBookingsPage() {
  const { data: reservations, isLoading } = useReservations();

  const bookings = reservations ?? [];
  const pendingCount = bookings.filter((r) => r.status === "pending").length;

  return (
    <div className="p-8">
      <h1 className="text-4xl font-bebas text-text mb-8">Safyri Bookings</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Card
          title="Total Bookings"
          value={isLoading ? "—" : String(bookings.length)}
        />
        <Card
          title="Pending Bookings"
          value={isLoading ? "—" : String(pendingCount)}
        />
      </div>

      <div className="bg-surface rounded-2xl border border-primary/10 p-8">
        {isLoading ? (
          <p className="text-muted text-sm">Loading bookings...</p>
        ) : bookings.length === 0 ? (
          <p className="text-muted text-sm">No bookings yet.</p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-muted uppercase text-xs tracking-widest border-b border-input-bg">
                <th className="pb-3 font-medium">Customer</th>
                <th className="pb-3 font-medium">Experience</th>
                <th className="pb-3 font-medium">Date</th>
                <th className="pb-3 font-medium">Guests</th>
                <th className="pb-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((booking) => (
                <tr
                  key={booking.id}
                  className="border-b border-input-bg last:border-0"
                >
                  <td className="py-3 text-text">{booking.customerName}</td>
                  <td className="py-3 text-muted">
                    {booking.experienceName}
                  </td>
                  <td className="py-3 text-muted">
                    {booking.date.toLocaleDateString()}
                  </td>
                  <td className="py-3 text-muted">{booking.guests}</td>
                  <td className="py-3">
                    <StatusBadge status={booking.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
