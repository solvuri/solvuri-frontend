"use client";

import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@repo/ui";
import type { PosRegisterReconciliation } from "@repo/types";
import { getMerchantId } from "@/lib/auth";
import {
  cashIn,
  cashOut,
  closeRegister,
  openRegister,
  useCurrentRegisterSession,
  useReconciliationPreview,
} from "@/lib/posApi";

export default function RegisterSessionPage() {
  const merchantId = getMerchantId();
  const { data: session, isLoading } = useCurrentRegisterSession(merchantId);
  const queryClient = useQueryClient();

  const [openingAmount, setOpeningAmount] = useState("");
  const [openNotes, setOpenNotes] = useState("");
  const [openError, setOpenError] = useState("");
  const [isOpening, setIsOpening] = useState(false);

  const [cashAmount, setCashAmount] = useState("");
  const [cashNotes, setCashNotes] = useState("");
  const [cashError, setCashError] = useState("");
  const [cashSubmitting, setCashSubmitting] = useState(false);

  const [closingAmount, setClosingAmount] = useState("");
  const [closeNotes, setCloseNotes] = useState("");
  const [closeError, setCloseError] = useState("");
  const [isClosing, setIsClosing] = useState(false);
  const [closeResult, setCloseResult] =
    useState<PosRegisterReconciliation | null>(null);

  const { data: preview } = useReconciliationPreview(
    merchantId,
    session?.id ?? null,
  );

  const refreshSession = () => {
    queryClient.invalidateQueries({
      queryKey: ["pos-register-current", merchantId],
    });
  };

  const handleOpen = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!merchantId || !openingAmount) return;
    setOpenError("");
    setIsOpening(true);
    try {
      await openRegister(merchantId, Number(openingAmount), openNotes);
      setOpeningAmount("");
      setOpenNotes("");
      refreshSession();
    } catch (err) {
      setOpenError(err instanceof Error ? err.message : "Couldn't open the register.");
    } finally {
      setIsOpening(false);
    }
  };

  const handleCashIn = async () => {
    if (!merchantId || !cashAmount) return;
    setCashError("");
    setCashSubmitting(true);
    try {
      await cashIn(merchantId, Number(cashAmount), cashNotes);
      setCashAmount("");
      setCashNotes("");
      queryClient.invalidateQueries({
        queryKey: ["pos-register-reconciliation", merchantId, session?.id],
      });
    } catch (err) {
      setCashError(err instanceof Error ? err.message : "Couldn't record cash-in.");
    } finally {
      setCashSubmitting(false);
    }
  };

  const handleCashOut = async () => {
    if (!merchantId || !cashAmount) return;
    setCashError("");
    setCashSubmitting(true);
    try {
      await cashOut(merchantId, Number(cashAmount), cashNotes);
      setCashAmount("");
      setCashNotes("");
      queryClient.invalidateQueries({
        queryKey: ["pos-register-reconciliation", merchantId, session?.id],
      });
    } catch (err) {
      setCashError(err instanceof Error ? err.message : "Couldn't record cash-out.");
    } finally {
      setCashSubmitting(false);
    }
  };

  const handleClose = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!merchantId || !session || !closingAmount) return;
    setCloseError("");
    setIsClosing(true);
    try {
      const result = await closeRegister(
        merchantId,
        session.id,
        Number(closingAmount),
        closeNotes,
      );
      setCloseResult(result);
      refreshSession();
    } catch (err) {
      setCloseError(err instanceof Error ? err.message : "Couldn't close the register.");
    } finally {
      setIsClosing(false);
    }
  };

  if (isLoading) {
    return <p className="text-muted text-sm">Loading...</p>;
  }

  if (closeResult) {
    return (
      <div className="max-w-md">
        <h2 className="text-2xl font-bebas text-text mb-6">Register Closed</h2>
        <div className="bg-surface rounded-2xl border border-primary/10 p-6 space-y-2 text-sm">
          <div className="flex justify-between text-muted">
            <span>Opening Float</span>
            <span>KES {closeResult.openingCashAmount.toLocaleString()}</span>
          </div>
          <div className="flex justify-between text-muted">
            <span>Cash Sales</span>
            <span>KES {closeResult.cashSales.toLocaleString()}</span>
          </div>
          <div className="flex justify-between text-muted">
            <span>Cash In / Out</span>
            <span>
              +{closeResult.cashIn.toLocaleString()} / -
              {closeResult.cashOut.toLocaleString()}
            </span>
          </div>
          <div className="flex justify-between text-muted">
            <span>Expected Cash</span>
            <span>KES {closeResult.expectedCashAmount.toLocaleString()}</span>
          </div>
          <div className="flex justify-between text-text font-bold">
            <span>Actual Cash</span>
            <span>KES {(closeResult.actualCashAmount ?? 0).toLocaleString()}</span>
          </div>
          <div className="flex justify-between font-bold pt-2 border-t border-input-bg">
            <span className="text-text">Variance</span>
            <span
              className={
                (closeResult.variance ?? 0) === 0
                  ? "text-emerald-400"
                  : "text-rose-400"
              }
            >
              KES {(closeResult.variance ?? 0).toLocaleString()}
            </span>
          </div>
        </div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="max-w-md">
        <h2 className="text-2xl font-bebas text-text mb-6">Open Register</h2>
        <form
          onSubmit={handleOpen}
          className="bg-surface rounded-2xl border border-primary/10 p-6 space-y-4"
        >
          <div>
            <label className="text-xs text-muted mb-1 block">
              Opening Cash Float (KES)
            </label>
            <input
              type="number"
              value={openingAmount}
              onChange={(e) => setOpeningAmount(e.target.value)}
              className="w-full bg-inputBg border border-primary/10 rounded-lg p-3 text-sm text-text outline-none focus:border-accent"
            />
          </div>
          <div>
            <label className="text-xs text-muted mb-1 block">
              Notes (optional)
            </label>
            <input
              type="text"
              value={openNotes}
              onChange={(e) => setOpenNotes(e.target.value)}
              className="w-full bg-inputBg border border-primary/10 rounded-lg p-3 text-sm text-text outline-none focus:border-accent"
            />
          </div>
          {openError && <p className="text-sm text-rose-400">{openError}</p>}
          <Button
            type="submit"
            variant="accent"
            disabled={isOpening}
            className="w-full"
          >
            {isOpening ? "Opening..." : "Open Register"}
          </Button>
        </form>
      </div>
    );
  }

  return (
    <div className="max-w-md space-y-6">
      <h2 className="text-2xl font-bebas text-text">Register Session</h2>

      {preview && (
        <div className="bg-surface rounded-2xl border border-primary/10 p-6 space-y-2 text-sm">
          <div className="flex justify-between text-muted">
            <span>Opening Float</span>
            <span>KES {preview.openingCashAmount.toLocaleString()}</span>
          </div>
          <div className="flex justify-between text-muted">
            <span>Cash Sales</span>
            <span>KES {preview.cashSales.toLocaleString()}</span>
          </div>
          <div className="flex justify-between text-muted">
            <span>Cash In / Out</span>
            <span>
              +{preview.cashIn.toLocaleString()} / -
              {preview.cashOut.toLocaleString()}
            </span>
          </div>
          <div className="flex justify-between text-text font-bold pt-2 border-t border-input-bg">
            <span>Expected Cash</span>
            <span>KES {preview.expectedCashAmount.toLocaleString()}</span>
          </div>
        </div>
      )}

      <div className="bg-surface rounded-2xl border border-primary/10 p-6 space-y-3">
        <h3 className="text-sm font-bold text-text">Cash In / Out</h3>
        <input
          type="number"
          value={cashAmount}
          onChange={(e) => setCashAmount(e.target.value)}
          placeholder="Amount"
          className="w-full bg-inputBg border border-primary/10 rounded-lg p-2 text-sm text-text outline-none focus:border-accent"
        />
        <input
          type="text"
          value={cashNotes}
          onChange={(e) => setCashNotes(e.target.value)}
          placeholder="Notes (optional)"
          className="w-full bg-inputBg border border-primary/10 rounded-lg p-2 text-sm text-text outline-none focus:border-accent"
        />
        {cashError && <p className="text-sm text-rose-400">{cashError}</p>}
        <div className="flex gap-3">
          <button
            type="button"
            disabled={cashSubmitting || !cashAmount}
            onClick={handleCashIn}
            className="flex-1 py-2 rounded-lg bg-inputBg text-text text-sm font-bold disabled:opacity-50 cursor-pointer"
          >
            Cash In
          </button>
          <button
            type="button"
            disabled={cashSubmitting || !cashAmount}
            onClick={handleCashOut}
            className="flex-1 py-2 rounded-lg bg-inputBg text-text text-sm font-bold disabled:opacity-50 cursor-pointer"
          >
            Cash Out
          </button>
        </div>
      </div>

      <form
        onSubmit={handleClose}
        className="bg-surface rounded-2xl border border-primary/10 p-6 space-y-4"
      >
        <h3 className="text-sm font-bold text-text">Close Register</h3>
        <div>
          <label className="text-xs text-muted mb-1 block">
            Counted Cash (KES)
          </label>
          <input
            type="number"
            value={closingAmount}
            onChange={(e) => setClosingAmount(e.target.value)}
            className="w-full bg-inputBg border border-primary/10 rounded-lg p-3 text-sm text-text outline-none focus:border-accent"
          />
        </div>
        <div>
          <label className="text-xs text-muted mb-1 block">
            Notes (optional)
          </label>
          <input
            type="text"
            value={closeNotes}
            onChange={(e) => setCloseNotes(e.target.value)}
            className="w-full bg-inputBg border border-primary/10 rounded-lg p-3 text-sm text-text outline-none focus:border-accent"
          />
        </div>
        {closeError && <p className="text-sm text-rose-400">{closeError}</p>}
        <Button
          type="submit"
          variant="accent"
          disabled={isClosing || !closingAmount}
          className="w-full"
        >
          {isClosing ? "Closing..." : "Close Register"}
        </Button>
      </form>
    </div>
  );
}
