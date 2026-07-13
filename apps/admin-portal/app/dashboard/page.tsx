import { Card, Button } from "@repo/ui";

export default function AdminDashboard() {
  return (
    <div className="p-8">
      {/* Changed font to bebas via @apply in globals.css */}
      <h1 className="text-4xl font-bebas text-text mb-8">Dashboard Overview</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Ensure Card component in @repo/ui uses bg-surface and text-text */}
        <Card title="Total Revenue" value="$45,231.89" />
        <Card title="Active Stores" value="12" />
        <Card title="Pending Orders" value="8" />
      </div>

      <div className="mt-8">
        <Button variant="accent">View All Orders</Button>
      </div>
    </div>
  );
}
