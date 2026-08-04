"use client";

import { use, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useStore } from "@/lib/store";
import { submitCheckoutRequest, useDeliveryTowns } from "@/lib/clearackApi";
import { resolveMerchantId } from "@/lib/merchants";
import { Lucide } from "@repo/ui";
const { ChevronLeft, Lock, Truck, CheckCircle2 } = Lucide;

const STEPS = ["Details", "Review"];

export default function CheckoutPage({
  params,
}: {
  params: Promise<{ subdomain: string }>;
}) {
  const { subdomain } = use(params);
  const merchantId = resolveMerchantId(subdomain);
  const router = useRouter();

  const [currentStep, setCurrentStep] = useState(0);
  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [deliveryTownId, setDeliveryTownId] = useState<number | null>(null);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { cart, clearCart } = useStore();
  const { data: towns } = useDeliveryTowns();

  const selectedTown = towns?.find((t) => t.id === deliveryTownId);
  const subtotal = cart.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0,
  );
  const tax = subtotal * 0.16;
  const shippingCost = selectedTown?.deliveryCost ?? 0;
  const total = subtotal + tax + shippingCost;

  const canContinue = Boolean(
    customerName && customerEmail && customerPhone && deliveryTownId,
  );

  const handleSubmit = async () => {
    if (!merchantId || !selectedTown) return;
    setError("");
    setIsSubmitting(true);
    try {
      const result = await submitCheckoutRequest(merchantId, {
        customerName,
        customerEmail,
        customerPhone,
        shippingAddress: `${selectedTown.townName}, ${selectedTown.county}`,
        deliveryTownId: selectedTown.id,
        items: cart.map((item) => ({
          productId: item.id,
          quantity: item.quantity,
        })),
      });
      clearCart();
      router.push(`/checkout/confirmation?orderId=${result.orderId}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Checkout failed.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-zinc-50 p-4 pb-24">
      {/* 1. Header */}
      <div className="flex items-center justify-between mb-8">
        <button
          onClick={() =>
            currentStep > 0
              ? setCurrentStep((prev) => prev - 1)
              : window.history.back()
          }
          aria-label="Go back"
          className="p-2 bg-white border rounded-lg"
        >
          <ChevronLeft size={20} />
        </button>
        <h1 className="text-lg font-black">Checkout</h1>
        <div className="flex items-center gap-1 text-emerald-600 text-xs font-bold">
          <Lock size={12} /> Secure
        </div>
      </div>

      {/* 2. Progress Breadcrumbs */}
      <div className="flex items-center justify-between mb-8 px-2 relative">
        <div className="absolute top-4 left-10 right-10 h-0.5 bg-zinc-200 z-0" />
        {STEPS.map((step, index) => {
          const isCompleted = index < currentStep;
          const isCurrent = index === currentStep;
          return (
            <div
              key={step}
              className="flex flex-col items-center gap-2 relative z-10"
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm border-2
                ${
                  isCompleted
                    ? "bg-blue-700 border-blue-700 text-white"
                    : isCurrent
                      ? "bg-white border-blue-700 text-blue-700"
                      : "bg-white border-zinc-300 text-zinc-400"
                }`}
              >
                {isCompleted ? <CheckCircle2 size={16} /> : index + 1}
              </div>
              <span
                className={`text-[10px] font-bold ${isCurrent ? "text-blue-700" : "text-zinc-400"}`}
              >
                {step}
              </span>
            </div>
          );
        })}
      </div>

      {/* 3. Step Content */}
      {currentStep === 0 && (
        <section className="bg-white p-6 rounded-xl border mb-6">
          <h2 className="font-bold mb-6 flex items-center gap-2 text-blue-700">
            <Truck size={18} /> Delivery Details
          </h2>
          <div className="space-y-4">
            <div>
              <label className="text-[10px] font-bold text-zinc-500 mb-1 block">
                FULL NAME
              </label>
              <input
                type="text"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="John Doe"
                className="w-full border rounded-lg p-3 text-sm focus:outline-blue-600 bg-zinc-50"
              />
            </div>
            <div>
              <label className="text-[10px] font-bold text-zinc-500 mb-1 block">
                EMAIL
              </label>
              <input
                type="email"
                value={customerEmail}
                onChange={(e) => setCustomerEmail(e.target.value)}
                placeholder="john@example.com"
                className="w-full border rounded-lg p-3 text-sm focus:outline-blue-600 bg-zinc-50"
              />
            </div>
            <div>
              <label className="text-[10px] font-bold text-zinc-500 mb-1 block">
                PHONE NUMBER
              </label>
              <input
                type="text"
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                placeholder="+254 712 345 678"
                className="w-full border rounded-lg p-3 text-sm focus:outline-blue-600 bg-zinc-50"
              />
            </div>
            <div>
              <label className="text-[10px] font-bold text-zinc-500 mb-1 block">
                DELIVERY TOWN
              </label>
              <select
                value={deliveryTownId ?? ""}
                onChange={(e) =>
                  setDeliveryTownId(Number(e.target.value) || null)
                }
                className="w-full border rounded-lg p-3 text-sm bg-zinc-50"
              >
                <option value="">Select a town</option>
                {towns?.map((town) => (
                  <option key={town.id} value={town.id}>
                    {town.townName} — KES {town.deliveryCost.toLocaleString()}
                  </option>
                ))}
              </select>
              {towns && towns.length === 0 && (
                <p className="text-xs text-zinc-500 mt-2">
                  No delivery towns are configured yet.
                </p>
              )}
            </div>
          </div>
        </section>
      )}

      {currentStep === 1 && (
        <section className="space-y-4 mb-6">
          <div className="bg-white p-6 rounded-xl border">
            <h2 className="font-bold mb-4">Order Review</h2>

            {cart.map((item) => (
              <div
                key={item.id}
                className="flex gap-4 py-2 border-b last:border-0"
              >
                <div className="relative w-16 h-16 shrink-0">
                  <Image
                    src={item.image || "/placeholder.png"}
                    alt={item.name}
                    fill
                    sizes="64px"
                    className="object-cover rounded-lg border"
                  />
                </div>
                <div className="flex-1 flex justify-between items-center">
                  <div className="flex flex-col">
                    <span className="font-bold text-sm">{item.name}</span>
                    <span className="text-xs text-zinc-500">
                      Qty: {item.quantity}
                    </span>
                  </div>
                  <span className="font-bold text-sm">
                    KES {(item.price * item.quantity).toLocaleString()}
                  </span>
                </div>
              </div>
            ))}

            <div className="pt-4 space-y-2 text-sm text-zinc-600">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>KES {subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Delivery ({selectedTown?.townName})</span>
                <span>KES {shippingCost.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Tax (16%)</span>
                <span>KES {tax.toLocaleString()}</span>
              </div>
              <div className="flex justify-between font-black text-lg text-blue-900 pt-2 border-t mt-2">
                <span>Total</span>
                <span>KES {total.toLocaleString()}</span>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl border flex justify-between items-start">
            <div>
              <h3 className="font-bold text-sm mb-2">Delivery to</h3>
              <p className="text-sm font-bold">{customerName}</p>
              <p className="text-xs text-zinc-500">
                {selectedTown?.townName}, {selectedTown?.county}
              </p>
              <p className="text-xs text-zinc-500">{customerPhone}</p>
            </div>
            <button
              onClick={() => setCurrentStep(0)}
              className="text-blue-700 text-xs font-bold underline"
            >
              Edit
            </button>
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-800">
            This merchant hasn&apos;t set up online payment yet — your order
            will be recorded as pending, and they&apos;ll follow up to confirm
            and arrange payment.
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}
        </section>
      )}

      {/* 4. Sticky Action Button */}
      <div className="fixed bottom-0 left-0 w-full p-4 bg-white border-t">
        <button
          onClick={() => {
            if (currentStep === 1) {
              handleSubmit();
            } else if (canContinue) {
              setCurrentStep(1);
            }
          }}
          disabled={(currentStep === 0 && !canContinue) || isSubmitting}
          className="w-full bg-blue-700 text-white py-4 rounded-xl font-bold cursor-pointer hover:bg-blue-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {currentStep === 1
            ? isSubmitting
              ? "Placing Order..."
              : "Place Order"
            : "Continue"}
        </button>
      </div>
    </main>
  );
}
