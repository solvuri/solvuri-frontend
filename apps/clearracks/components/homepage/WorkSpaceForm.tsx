"use client";

import { useState } from "react";
import { Lucide } from "@repo/ui";
const { ArrowRight, Layers, CheckCircle2, Loader2, MessageSquare } = Lucide;

export default function WorkspaceForm() {
  const [storeName, setStoreName] = useState("");
  const [slug, setSlug] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<{
    loading: boolean;
    success: boolean | null;
    errorMsg: string;
  }>({
    loading: false,
    success: null,
    errorMsg: "",
  });

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;
    setStoreName(name);
    setSlug(
      name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)+/g, ""),
    );
  };

  const handleSlugManualChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]+/g, ""));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!storeName || !slug || !phone || !email) return;

    setStatus({ loading: true, success: null, errorMsg: "" });

    try {
      // Pointing fetch directly to your workspace configuration database handler
      const res = await fetch("/api/workspaces", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          storeName: storeName,
          slug: slug,
          email: email,
          phone: phone, // Captures WhatsApp context for onboarding triggers
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setStatus({ loading: false, success: true, errorMsg: "" });
      } else {
        // Capture specific backend error strings (e.g. "This boutique address is already claimed")
        setStatus({
          loading: false,
          success: false,
          errorMsg: data.error || "Workspace instantiation anomaly.",
        });
      }
    } catch (err) {
      setStatus({
        loading: false,
        success: false,
        errorMsg: "Network gateway drop. Please verify details and retry.",
      });
    }
  };

  if (status.success) {
    return (
      <div className="bg-brand-surface border border-brand-border p-8 rounded-3xl shadow-xl shadow-stone-200/50 w-full max-w-md mx-auto text-center space-y-5 animate-in fade-in zoom-in-95 duration-200">
        <div className="h-12 w-12 bg-orange-50 border border-brand-primary/20 rounded-full flex items-center justify-center text-brand-primary mx-auto">
          <CheckCircle2 className="h-6 w-6" />
        </div>
        <div className="space-y-2">
          <h2 className="text-xl font-black text-stone-900 tracking-tight uppercase">
            Workspace Provisioned
          </h2>
          <p className="text-xs text-brand-muted font-semibold leading-relaxed px-2">
            Your live store space is reserved at{" "}
            <span className="text-stone-900 font-black underline">
              {slug}.boutique
            </span>
            ! We are setting up your workspace parameters now and will reach out
            over WhatsApp to hook up your M-Pesa automated collection pipeline.
          </p>
        </div>
        <div className="bg-stone-50 border border-stone-200/60 p-3.5 rounded-xl text-[11px] font-bold text-stone-600 flex items-center justify-center gap-2">
          <MessageSquare className="h-3.5 w-3.5 text-brand-primary" />
          Keep your phone nearby for setup validation
        </div>
      </div>
    );
  }

  return (
    <div className="bg-brand-surface border border-brand-border p-8 rounded-3xl shadow-xl shadow-stone-200/50 w-full max-w-md mx-auto">
      <div className="h-11 w-11 bg-orange-50 border border-brand-primary/20 rounded-xl flex items-center justify-center text-brand-primary mb-5">
        <Layers className="h-5 w-5" />
      </div>

      <h2 className="text-xl font-black text-stone-900 tracking-tight uppercase">
        Claim Your Workspace
      </h2>
      <p className="text-xs text-brand-muted font-semibold mt-1">
        Reserve your custom brand storefront and request premium onboarding.
      </p>

      <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
        {/* Input 1: Boutique Name */}
        <div className="space-y-1.5">
          <label className="text-[10px] font-black text-stone-700 uppercase tracking-wider ml-0.5">
            Boutique / Brand Name
          </label>
          <input
            type="text"
            required
            value={storeName}
            onChange={handleNameChange}
            placeholder="e.g. Lyvera Outlets"
            className="w-full bg-white border border-brand-border p-3.5 rounded-xl outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary font-medium text-sm transition-all placeholder:text-stone-300 text-stone-900"
          />
        </div>

        {/* Input 2: Merchant Email Address */}
        <div className="space-y-1.5">
          <label className="text-[10px] font-black text-stone-700 uppercase tracking-wider ml-0.5">
            Email Address
          </label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="name@business.com"
            className="w-full bg-white border border-brand-border p-3.5 rounded-xl outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary font-medium text-sm transition-all placeholder:text-stone-300 text-stone-900"
          />
        </div>

        {/* Input 3: Contact Phone Number */}
        <div className="space-y-1.5">
          <label className="text-[10px] font-black text-stone-700 uppercase tracking-wider ml-0.5">
            WhatsApp Contact Number
          </label>
          <input
            type="tel"
            required
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="e.g. 0712345678"
            className="w-full bg-white border border-brand-border p-3.5 rounded-xl outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary font-medium text-sm transition-all placeholder:text-stone-300 text-stone-900"
          />
        </div>

        {/* Input 4: Subdomain/Slug handler */}
        <div className="space-y-1.5">
          <label className="text-[10px] font-black text-stone-700 uppercase tracking-wider ml-0.5">
            Requested Storefront Web Address
          </label>
          <div className="flex items-center w-full bg-white border border-brand-border rounded-xl overflow-hidden px-3.5 focus-within:border-brand-primary focus-within:ring-1 focus-within:ring-brand-primary transition-all">
            <input
              type="text"
              required
              value={slug}
              onChange={handleSlugManualChange}
              placeholder="handle"
              className="bg-transparent py-3.5 outline-none font-bold text-brand-primary text-sm w-1/2 placeholder:text-stone-300"
            />
            <span className="text-stone-400 font-bold text-xs text-right w-1/2 truncate">
              .boutique
            </span>
          </div>
        </div>

        {/* Dynamic Ready Preview Ribbon */}
        {slug && (
          <div className="flex items-center gap-2.5 text-orange-700 bg-orange-50/60 border border-brand-primary/20 p-3 rounded-lg transition-all animate-in fade-in duration-150">
            <CheckCircle2 className="h-4 w-4 shrink-0 text-brand-primary" />
            <p className="text-[12px] font-bold tracking-tight">
              Ready to configure:{" "}
              <span className="underline font-black text-stone-900">
                {slug}.boutique
              </span>
            </p>
          </div>
        )}

        {/* Submission Failure Catch Ribbon */}
        {status.success === false && (
          <p className="text-[11px] text-red-500 font-bold text-center bg-red-50 py-2.5 rounded-lg border border-red-200 animate-shake">
            {status.errorMsg}
          </p>
        )}

        {/* Action Button */}
        <button
          type="submit"
          disabled={!slug || !storeName || !phone || !email || status.loading}
          className={`w-full font-black text-xs tracking-widest uppercase py-4 rounded-xl flex items-center justify-center gap-2 transition-all duration-200 mt-3 shadow-lg ${
            slug && storeName && phone && email && !status.loading
              ? "bg-brand-primary text-white hover:bg-orange-600 active:scale-[0.99] cursor-pointer shadow-brand-primary/20"
              : "bg-stone-200 text-stone-400 opacity-50 cursor-not-allowed shadow-none"
          }`}
        >
          {status.loading ? (
            <>
              Configuring Tenant Engine{" "}
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            </>
          ) : (
            <>
              Claim Storefront Link <ArrowRight className="h-3.5 w-3.5" />
            </>
          )}
        </button>
      </form>
    </div>
  );
}
