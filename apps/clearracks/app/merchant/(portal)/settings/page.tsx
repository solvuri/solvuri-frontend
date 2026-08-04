"use client";

import { useEffect, useState } from "react";
import { Lucide } from "@repo/ui";
import { useMpesaSettings, submitMpesaSettings } from "@/lib/merchantApi";

const { CheckCircle2, XCircle, Clock } = Lucide;

const TRANSACTION_TYPES = [
  "CustomerBuyGoodsOnline",
  "CustomerPayBillOnline",
] as const;

export default function MerchantSettingsPage() {
  const { data: settings, isLoading, error, refetch } = useMpesaSettings();

  const [consumerKey, setConsumerKey] = useState("");
  const [consumerSecret, setConsumerSecret] = useState("");
  const [shortcode, setShortcode] = useState("");
  const [passkey, setPasskey] = useState("");
  const [partyB, setPartyB] = useState("");
  const [transactionType, setTransactionType] = useState<string>(
    TRANSACTION_TYPES[0],
  );
  const [formError, setFormError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [justSubmitted, setJustSubmitted] = useState(false);

  useEffect(() => {
    if (settings) {
      setShortcode(settings.shortcode);
      setPartyB(settings.partyB);
      setTransactionType(settings.transactionType);
    }
  }, [settings]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");
    setIsSubmitting(true);
    try {
      await submitMpesaSettings({
        consumerKey,
        consumerSecret,
        shortcode,
        passkey,
        partyB,
        transactionType,
      });
      setJustSubmitted(true);
      setConsumerKey("");
      setConsumerSecret("");
      setPasskey("");
      await refetch();
    } catch (err) {
      setFormError(err instanceof Error ? err.message : "Submission failed.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const notConfiguredYet = Boolean(error) && !settings;

  return (
    <div className="max-w-xl">
      <h2 className="text-xl font-black text-zinc-900 mb-1">
        Online Payment (M-Pesa)
      </h2>
      <p className="text-sm text-zinc-500 mb-6">
        Submit your Daraja credentials to accept real M-Pesa STK-push
        payments on your storefront. Verification and enabling are handled
        by Solvuri support after you submit — they&apos;ll fire a small test
        charge to confirm your credentials work, then turn it on.
      </p>

      {isLoading && <p className="text-sm text-zinc-500">Loading...</p>}

      {!isLoading && !notConfiguredYet && settings && (
        <div className="bg-white border rounded-2xl p-6 mb-6 space-y-3">
          <h3 className="font-bold text-sm text-zinc-900 mb-2">
            Current Status
          </h3>
          <div className="flex items-center gap-2 text-sm">
            {settings.hasSecrets ? (
              <CheckCircle2 size={16} className="text-emerald-600" />
            ) : (
              <XCircle size={16} className="text-zinc-400" />
            )}
            <span>
              Credentials {settings.hasSecrets ? "on file" : "not submitted"}
            </span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            {settings.isVerified ? (
              <CheckCircle2 size={16} className="text-emerald-600" />
            ) : (
              <Clock size={16} className="text-amber-500" />
            )}
            <span>
              {settings.isVerified ? "Verified" : "Pending verification"}
            </span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            {settings.isEnabled ? (
              <CheckCircle2 size={16} className="text-emerald-600" />
            ) : (
              <XCircle size={16} className="text-zinc-400" />
            )}
            <span>
              Online checkout {settings.isEnabled ? "enabled" : "not enabled"}
            </span>
          </div>
        </div>
      )}

      {notConfiguredYet && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 mb-6 text-sm text-amber-800">
          You haven&apos;t submitted M-Pesa credentials yet.
        </div>
      )}

      {justSubmitted && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 mb-6 text-sm text-emerald-800">
          Submitted — this reset any previous verification, so Solvuri
          support will need to re-verify before it goes live.
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="bg-white border rounded-2xl p-6 space-y-4"
      >
        <div>
          <label className="text-[10px] font-bold text-zinc-500 mb-1 block">
            CONSUMER KEY
          </label>
          <input
            type="text"
            value={consumerKey}
            onChange={(e) => setConsumerKey(e.target.value)}
            className="w-full border rounded-lg p-3 text-sm bg-zinc-50"
          />
        </div>
        <div>
          <label className="text-[10px] font-bold text-zinc-500 mb-1 block">
            CONSUMER SECRET
          </label>
          <input
            type="password"
            value={consumerSecret}
            onChange={(e) => setConsumerSecret(e.target.value)}
            className="w-full border rounded-lg p-3 text-sm bg-zinc-50"
          />
        </div>
        <div>
          <label className="text-[10px] font-bold text-zinc-500 mb-1 block">
            SHORTCODE
          </label>
          <input
            type="text"
            value={shortcode}
            onChange={(e) => setShortcode(e.target.value)}
            className="w-full border rounded-lg p-3 text-sm bg-zinc-50"
          />
        </div>
        <div>
          <label className="text-[10px] font-bold text-zinc-500 mb-1 block">
            PASSKEY
          </label>
          <input
            type="password"
            value={passkey}
            onChange={(e) => setPasskey(e.target.value)}
            className="w-full border rounded-lg p-3 text-sm bg-zinc-50"
          />
        </div>
        <div>
          <label className="text-[10px] font-bold text-zinc-500 mb-1 block">
            PARTY B (TILL/PAYBILL NUMBER)
          </label>
          <input
            type="text"
            value={partyB}
            onChange={(e) => setPartyB(e.target.value)}
            className="w-full border rounded-lg p-3 text-sm bg-zinc-50"
          />
        </div>
        <div>
          <label className="text-[10px] font-bold text-zinc-500 mb-1 block">
            TRANSACTION TYPE
          </label>
          <select
            value={transactionType}
            onChange={(e) => setTransactionType(e.target.value)}
            className="w-full border rounded-lg p-3 text-sm bg-zinc-50"
          >
            {TRANSACTION_TYPES.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>

        {formError && <p className="text-sm text-red-600">{formError}</p>}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-blue-700 text-white py-3 rounded-lg font-bold cursor-pointer hover:bg-blue-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? "Submitting..." : "Save Credentials"}
        </button>
      </form>
    </div>
  );
}
