"use client";

import Link from "next/link";
import { useOrders, useReservations, useTenants } from "@repo/data";
import { Button, Card, Lucide } from "@repo/ui";
import { StatusBadge } from "../../components/StatusBadge";

const { DollarSign, Store, Package, CalendarClock } = Lucide;

export default function AdminDashboard() {
  const { data: tenants, isLoading: tenantsLoading } = useTenants();
  const { data: orders, isLoading: ordersLoading } = useOrders();
  const { data: reservations, isLoading: reservationsLoading } =
    useReservations();

  const isLoading = tenantsLoading || ordersLoading || reservationsLoading;

  const totalRevenue =
    tenants?.reduce((sum, t) => sum + t.monthlyRevenue, 0) ?? 0;
  const activeStores =
    tenants?.filter((t) => t.module === "clearrack" && t.status === "active")
      .length ?? 0;
  const pendingOrders =
    orders?.filter((o) => o.status !== "Delivered").length ?? 0;
  const pendingBookings =
    reservations?.filter((r) => r.status === "pending").length ?? 0;

  const recentOrders = orders?.slice(0, 4) ?? [];

  return (
    <div className="p-8">
      <h1 className="text-4xl font-bebas text-text mb-8">
        Dashboard Overview
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card
          title="Total Platform Revenue"
          value={isLoading ? "—" : `KES ${totalRevenue.toLocaleString()}`}
          icon={<DollarSign className="w-5 h-5" />}
        />
        <Card
          title="Active Stores"
          value={isLoading ? "—" : String(activeStores)}
          icon={<Store className="w-5 h-5" />}
        />
        <Card
          title="Pending Orders"
          value={isLoading ? "—" : String(pendingOrders)}
          icon={<Package className="w-5 h-5" />}
        />
        <Card
          title="Pending Bookings"
          value={isLoading ? "—" : String(pendingBookings)}
          icon={<CalendarClock className="w-5 h-5" />}
        />
      </div>

      <div className="mt-8 bg-surface rounded-2xl border border-primary/10 p-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bebas text-text tracking-wide">
            Recent Orders
          </h2>
          <Link href="/dashboard/clearrack">
            <Button variant="accent">View All Orders</Button>
          </Link>
        </div>

        {recentOrders.length === 0 ? (
          <p className="text-muted text-sm">
            {isLoading ? "Loading orders..." : "No orders yet."}
          </p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-muted uppercase text-xs tracking-widest border-b border-input-bg">
                <th className="pb-3 font-medium">Order</th>
                <th className="pb-3 font-medium">Date</th>
                <th className="pb-3 font-medium">Status</th>
                <th className="pb-3 font-medium text-right">Total</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.map((order) => (
                <tr
                  key={order.id}
                  className="border-b border-input-bg last:border-0"
                >
                  <td className="py-3 text-text">{order.id}</td>
                  <td className="py-3 text-muted">{order.date}</td>
                  <td className="py-3">
                    <StatusBadge status={order.status} />
                  </td>
                  <td className="py-3 text-text text-right">
                    KES {order.total.toLocaleString()}
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
