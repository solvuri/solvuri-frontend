"use client";

import Image from "next/image";
import { useStore } from "@/lib/store";
import { Lucide } from "@repo/ui";
import { useState } from "react";
const { ChevronLeft, Lock, Truck, CreditCard, CheckCircle2 } = Lucide;

const STEPS = ["Address", "Shipping", "Payment", "Review"];

export default function CheckoutPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [shipping, setShipping] = useState("Standard");
  const [payment, setPayment] = useState("M-Pesa");

  const { cart } = useStore();
  const subtotal = cart.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0,
  );
  const tax = subtotal * 0.16;
  const shippingCost = shipping === "Standard" ? 200 : 500;
  const total = subtotal + tax + shippingCost;

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

      {/* 2. Progress Breadcrumbs with Connecting Lines */}
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
            <CheckCircle2 size={18} /> Delivery Address
          </h2>
          <div className="space-y-4">
            {[
              { label: "FULL NAME", placeholder: "John Doe" },
              { label: "PHONE NUMBER", placeholder: "+254 712 345 678" },
              { label: "COUNTY", placeholder: "Nairobi" },
              { label: "AREA/TOWN", placeholder: "Westlands" },
              {
                label: "STREET/BUILDING",
                placeholder: "Waiyaki Way, Suite 12",
              },
            ].map((field) => (
              <div key={field.label}>
                <label className="text-[10px] font-bold text-zinc-500 mb-1 block">
                  {field.label}
                </label>
                <input
                  type="text"
                  placeholder={field.placeholder}
                  className="w-full border rounded-lg p-3 text-sm focus:outline-blue-600 bg-zinc-50"
                />
              </div>
            ))}
          </div>
        </section>
      )}

      {currentStep === 1 && (
        <section className="bg-white p-6 rounded-xl border mb-6">
          <h2 className="font-bold mb-4 flex items-center gap-2">
            <Truck size={18} /> Shipping Method
          </h2>
          {["Standard", "Express"].map((method) => (
            <button
              key={method}
              onClick={() => setShipping(method)}
              className={`w-full p-4 border rounded-xl mb-3 flex justify-between items-center ${shipping === method ? "border-blue-700 bg-blue-50" : ""}`}
            >
              <div className="text-left">
                <p className="font-bold">{method} Delivery</p>
                <p className="text-xs text-zinc-500">
                  {method === "Standard"
                    ? "3-5 business days"
                    : "1-2 business days"}
                </p>
              </div>
              <span className="font-bold">
                KES {method === "Standard" ? 200 : 500}
              </span>
            </button>
          ))}
        </section>
      )}

      {currentStep === 2 && (
        <section className="bg-white p-6 rounded-xl border mb-6">
          <h2 className="font-bold mb-4 flex items-center gap-2">
            <CreditCard size={18} /> Payment Method
          </h2>
          {["M-Pesa", "Card", "Bank Transfer"].map((method) => (
            <button
              key={method}
              onClick={() => setPayment(method)}
              className={`w-full p-4 border rounded-xl mb-3 ${payment === method ? "border-blue-700 bg-blue-50" : ""}`}
            >
              <p className="font-bold">{method}</p>
            </button>
          ))}
          {payment === "M-Pesa" && (
            <div className="p-4 bg-emerald-50 text-emerald-700 text-sm font-bold rounded-lg mt-2">
              A payment prompt will be sent to +254 712 345 678
            </div>
          )}
        </section>
      )}

      {currentStep === 3 && (
        <section className="space-y-4 mb-6">
          <div className="bg-white p-6 rounded-xl border">
            <h2 className="font-bold mb-4">Order Review</h2>

            {/* Product List with Thumbnail */}
            {cart.map((item) => (
              <div
                key={item.id}
                className="flex gap-4 py-2 border-b last:border-0"
              >
                <div className="relative w-16 h-16 shrink-0">
                  <Image
                    src={item.image}
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

            {/* Financials */}
            <div className="pt-4 space-y-2 text-sm text-zinc-600">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>KES {subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping ({shipping})</span>
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

          {/* Delivery Details */}
          <div className="bg-white p-6 rounded-xl border flex justify-between items-start">
            <div>
              <h3 className="font-bold text-sm mb-2">Delivery to</h3>
              <p className="text-sm font-bold">John Doe</p>
              <p className="text-xs text-zinc-500">
                Waiyaki Way, Suite 12, Westlands, Nairobi
              </p>
              <p className="text-xs text-zinc-500">+254 712 345 678</p>
            </div>
            <button
              onClick={() => setCurrentStep(0)}
              className="text-blue-700 text-xs font-bold underline"
            >
              Edit
            </button>
          </div>

          {/* Payment Details */}
          <div className="bg-white p-6 rounded-xl border flex justify-between items-start">
            <div>
              <h3 className="font-bold text-sm mb-2">Payment</h3>
              <p className="text-sm font-bold">{payment}</p>
            </div>
            <button
              onClick={() => setCurrentStep(2)}
              className="text-blue-700 text-xs font-bold underline"
            >
              Edit
            </button>
          </div>
        </section>
      )}

      {/* 4. Sticky Action Button */}
      <div className="fixed bottom-0 left-0 w-full p-4 bg-white border-t">
        <button
          onClick={() => {
            if (currentStep === 3) {
              // 1. Perform your order submission/payment logic here
              // 2. Redirect to the confirmation page
              window.location.href = "/checkout/confirmation";
            } else {
              // Otherwise, just move to the next step
              setCurrentStep((prev) => Math.min(prev + 1, 3));
            }
          }}
          className="w-full bg-blue-700 text-white py-4 rounded-xl font-bold cursor-pointer hover:bg-blue-800 transition-colors"
        >
          {currentStep === 3 ? "Confirm & Pay" : "Continue"}
        </button>
      </div>
    </main>
  );
}
