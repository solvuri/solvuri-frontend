"use client";

import { useState } from "react";
import Link from "next/link";
import { getMerchantId } from "@/lib/auth";
import {
  completeStockCount,
  scanStockCountItem,
  startStockCount,
  useCatalogProducts,
  useStockCountHistory,
} from "@/lib/posApi";

const FIELD_CLASS =
  "bg-inputBg border border-primary/10 rounded-lg p-2 text-sm text-text";

export default function StockCountPage() {
  const merchantId = getMerchantId();
  const { data: history, isLoading, refetch } = useStockCountHistory(merchantId);
  const { data: products } = useCatalogProducts(merchantId);

  const activeSession = history?.find((s) => s.status === "InProgress");

  const [notes, setNotes] = useState("");
  const [startError, setStartError] = useState("");
  const [starting, setStarting] = useState(false);

  const [scanProductId, setScanProductId] = useState("");
  const [scanQuantity, setScanQuantity] = useState("");
  const [scanError, setScanError] = useState("");
  const [scanning, setScanning] = useState(false);

  const [completing, setCompleting] = useState(false);
  const [completeError, setCompleteError] = useState("");

  const handleStart = async () => {
    if (!merchantId) return;
    setStartError("");
    setStarting(true);
    try {
      await startStockCount(merchantId, notes || undefined);
      setNotes("");
      await refetch();
    } catch (err) {
      setStartError(
        err instanceof Error ? err.message : "Couldn't start a count session.",
      );
    } finally {
      setStarting(false);
    }
  };

  const handleScan = async () => {
    if (!merchantId || !activeSession || !scanProductId || !scanQuantity)
      return;
    setScanError("");
    setScanning(true);
    try {
      await scanStockCountItem(
        merchantId,
        activeSession.id,
        Number(scanProductId),
        Number(scanQuantity),
      );
      setScanProductId("");
      setScanQuantity("");
      await refetch();
    } catch (err) {
      setScanError(
        err instanceof Error ? err.message : "Couldn't record that scan.",
      );
    } finally {
      setScanning(false);
    }
  };

  const handleComplete = async () => {
    if (!merchantId || !activeSession) return;
    setCompleteError("");
    setCompleting(true);
    try {
      await completeStockCount(merchantId, activeSession.id);
      await refetch();
    } catch (err) {
      setCompleteError(
        err instanceof Error ? err.message : "Couldn't complete this count.",
      );
    } finally {
      setCompleting(false);
    }
  };

  return (
    <div className="max-w-3xl space-y-6">
      <h2 className="text-2xl font-bebas text-text">Stock Count</h2>
      <p className="text-sm text-muted">
        A periodic audit of what&apos;s actually on the shelf against what the
        system thinks is there — separate from receiving new stock via Stock
        Batches on the Inventory page.
      </p>

      {isLoading && <p className="text-muted text-sm">Loading...</p>}

      {!isLoading && !activeSession && (
        <div className="bg-surface rounded-2xl border border-primary/10 p-6 space-y-3 max-w-md">
          <h3 className="text-sm font-bold text-text">Start a New Count</h3>
          <input
            type="text"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Notes (optional)"
            className={`w-full ${FIELD_CLASS}`}
          />
          {startError && <p className="text-sm text-rose-400">{startError}</p>}
          <button
            type="button"
            disabled={starting}
            onClick={handleStart}
            className="px-4 py-2 rounded-lg text-sm font-medium bg-primary text-white disabled:opacity-50"
          >
            {starting ? "Starting..." : "Start Count"}
          </button>
        </div>
      )}

      {activeSession && (
        <div className="bg-surface rounded-2xl border border-primary/10 p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-text">
              Count #{activeSession.id} — In Progress
            </h3>
            <button
              type="button"
              disabled={completing}
              onClick={handleComplete}
              className="px-4 py-2 rounded-lg text-sm font-medium bg-primary text-white disabled:opacity-50"
            >
              {completing ? "Completing..." : "Complete Count"}
            </button>
          </div>
          {activeSession.notes && (
            <p className="text-xs text-muted">{activeSession.notes}</p>
          )}
          {completeError && (
            <p className="text-sm text-rose-400">{completeError}</p>
          )}

          {activeSession.items.length === 0 ? (
            <p className="text-muted text-sm">No items scanned yet.</p>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-muted uppercase text-xs tracking-widest border-b border-input-bg">
                  <th className="pb-2 font-medium">Product</th>
                  <th className="pb-2 font-medium text-right">System Qty</th>
                  <th className="pb-2 font-medium text-right">Counted Qty</th>
                  <th className="pb-2 font-medium text-right">Variance</th>
                </tr>
              </thead>
              <tbody>
                {activeSession.items.map((item) => (
                  <tr
                    key={item.productId}
                    className="border-b border-input-bg last:border-0"
                  >
                    <td className="py-2 text-text">{item.productName}</td>
                    <td className="py-2 text-muted text-right">
                      {item.systemQuantity}
                    </td>
                    <td className="py-2 text-text text-right">
                      {item.countedQuantity}
                    </td>
                    <td
                      className={`py-2 text-right font-bold ${
                        item.variance === 0
                          ? "text-muted"
                          : item.variance < 0
                            ? "text-rose-400"
                            : "text-emerald-400"
                      }`}
                    >
                      {item.variance > 0 ? `+${item.variance}` : item.variance}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          <div className="flex gap-2 pt-2 border-t border-input-bg">
            <select
              value={scanProductId}
              onChange={(e) => setScanProductId(e.target.value)}
              className={FIELD_CLASS}
            >
              <option value="">Select product...</option>
              {(products ?? []).map((p) => (
                <option key={p.id} value={p.id}>
                  {p.productName}
                </option>
              ))}
            </select>
            <input
              type="number"
              min={0}
              value={scanQuantity}
              onChange={(e) => setScanQuantity(e.target.value)}
              placeholder="Counted qty"
              className={`w-32 ${FIELD_CLASS}`}
            />
            <button
              type="button"
              disabled={scanning || !scanProductId || !scanQuantity}
              onClick={handleScan}
              className="px-4 py-2 rounded-lg text-sm font-medium bg-inputBg text-text disabled:opacity-50"
            >
              {scanning ? "Recording..." : "Record Scan"}
            </button>
          </div>
          {scanError && <p className="text-sm text-rose-400">{scanError}</p>}
        </div>
      )}

      <div className="bg-surface rounded-2xl border border-primary/10 p-6">
        <h3 className="text-sm font-bold text-text mb-4">Past Counts</h3>
        {!history || history.length === 0 ? (
          <p className="text-muted text-sm">No count sessions yet.</p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-muted uppercase text-xs tracking-widest border-b border-input-bg">
                <th className="pb-2 font-medium">Started</th>
                <th className="pb-2 font-medium">Status</th>
                <th className="pb-2 font-medium">Notes</th>
                <th className="pb-2 font-medium text-right">Items</th>
              </tr>
            </thead>
            <tbody>
              {history.map((session) => (
                <tr
                  key={session.id}
                  className="border-b border-input-bg last:border-0"
                >
                  <td className="py-2 text-text">
                    <Link
                      href={`/stock-count/${session.id}`}
                      className="hover:underline"
                    >
                      {new Date(session.startedAt).toLocaleString()}
                    </Link>
                  </td>
                  <td className="py-2 text-muted">{session.status}</td>
                  <td className="py-2 text-muted">{session.notes ?? "—"}</td>
                  <td className="py-2 text-text text-right">
                    {session.items.length}
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
