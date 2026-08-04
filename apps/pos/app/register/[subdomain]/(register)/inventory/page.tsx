"use client";

import { useState } from "react";
import Image from "next/image";
import { useQueryClient } from "@tanstack/react-query";
import { getMerchantId } from "@/lib/auth";
import {
  createStockBatch,
  receiveStockBatch,
  submitAdjustment,
  submitSupplierReturn,
  useCatalogProducts,
  useInventory,
  useInventoryMovements,
  useStockBatches,
} from "@/lib/posApi";

const ADJUSTMENT_REASONS = ["Damaged", "Lost", "Stolen", "Expired", "Other"];

export default function InventoryPage() {
  const merchantId = getMerchantId();
  const queryClient = useQueryClient();

  const { data: inventory, isLoading: inventoryLoading } =
    useInventory(merchantId);
  const { data: products } = useCatalogProducts(merchantId);
  const { data: movements } = useInventoryMovements(merchantId);
  const { data: batches } = useStockBatches(merchantId);

  const [adjProductId, setAdjProductId] = useState("");
  const [adjQuantity, setAdjQuantity] = useState("");
  const [adjReason, setAdjReason] = useState<string>("Damaged");
  const [adjNotes, setAdjNotes] = useState("");
  const [adjError, setAdjError] = useState("");
  const [adjSubmitting, setAdjSubmitting] = useState(false);

  const [returnProductId, setReturnProductId] = useState("");
  const [returnQuantity, setReturnQuantity] = useState("");
  const [returnNotes, setReturnNotes] = useState("");
  const [returnError, setReturnError] = useState("");
  const [returnSubmitting, setReturnSubmitting] = useState(false);

  const [batchProductId, setBatchProductId] = useState("");
  const [batchUnitPrice, setBatchUnitPrice] = useState("");
  const [batchLabel, setBatchLabel] = useState("");
  const [batchExpected, setBatchExpected] = useState("");
  const [batchError, setBatchError] = useState("");
  const [batchSubmitting, setBatchSubmitting] = useState(false);
  const [newBatchQr, setNewBatchQr] = useState<string | null>(null);

  const [receiveCode, setReceiveCode] = useState("");
  const [receiveQuantity, setReceiveQuantity] = useState("");
  const [receiveError, setReceiveError] = useState("");
  const [receiveSubmitting, setReceiveSubmitting] = useState(false);

  const refreshInventory = () => {
    queryClient.invalidateQueries({ queryKey: ["pos-inventory", merchantId] });
    queryClient.invalidateQueries({
      queryKey: ["pos-inventory-movements", merchantId],
    });
  };

  const handleAdjustment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!merchantId || !adjProductId || !adjQuantity) return;
    setAdjError("");
    setAdjSubmitting(true);
    try {
      await submitAdjustment(
        merchantId,
        Number(adjProductId),
        Number(adjQuantity),
        adjReason,
        adjNotes,
      );
      setAdjQuantity("");
      setAdjNotes("");
      refreshInventory();
    } catch (err) {
      setAdjError(
        err instanceof Error ? err.message : "Couldn't record that adjustment.",
      );
    } finally {
      setAdjSubmitting(false);
    }
  };

  const handleSupplierReturn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!merchantId || !returnProductId || !returnQuantity) return;
    setReturnError("");
    setReturnSubmitting(true);
    try {
      await submitSupplierReturn(
        merchantId,
        Number(returnProductId),
        Number(returnQuantity),
        returnNotes,
      );
      setReturnQuantity("");
      setReturnNotes("");
      refreshInventory();
    } catch (err) {
      setReturnError(
        err instanceof Error ? err.message : "Couldn't record that return.",
      );
    } finally {
      setReturnSubmitting(false);
    }
  };

  const handleCreateBatch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!merchantId || !batchProductId || !batchUnitPrice || !batchExpected)
      return;
    setBatchError("");
    setBatchSubmitting(true);
    try {
      const batch = await createStockBatch(
        merchantId,
        Number(batchProductId),
        Number(batchUnitPrice),
        batchLabel,
        Number(batchExpected),
      );
      setNewBatchQr(batch.qrImage);
      setBatchUnitPrice("");
      setBatchLabel("");
      setBatchExpected("");
      queryClient.invalidateQueries({
        queryKey: ["pos-stock-batches", merchantId],
      });
    } catch (err) {
      setBatchError(
        err instanceof Error ? err.message : "Couldn't create that batch.",
      );
    } finally {
      setBatchSubmitting(false);
    }
  };

  const handleReceive = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!merchantId || !receiveCode || !receiveQuantity) return;
    setReceiveError("");
    setReceiveSubmitting(true);
    try {
      await receiveStockBatch(merchantId, receiveCode, Number(receiveQuantity));
      setReceiveCode("");
      setReceiveQuantity("");
      queryClient.invalidateQueries({
        queryKey: ["pos-stock-batches", merchantId],
      });
      refreshInventory();
    } catch (err) {
      setReceiveError(
        err instanceof Error ? err.message : "Couldn't receive that batch.",
      );
    } finally {
      setReceiveSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl space-y-6">
      <h2 className="text-2xl font-bebas text-text">Inventory</h2>

      <div className="bg-surface rounded-2xl border border-primary/10 p-6">
        <h3 className="text-sm font-bold text-text mb-4">Stock Levels</h3>
        {inventoryLoading ? (
          <p className="text-muted text-sm">Loading...</p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-muted uppercase text-xs tracking-widest border-b border-input-bg">
                <th className="pb-2 font-medium">Product</th>
                <th className="pb-2 font-medium text-right">Stock</th>
                <th className="pb-2 font-medium text-right">Status</th>
              </tr>
            </thead>
            <tbody>
              {(inventory ?? []).map((item) => (
                <tr
                  key={item.productId}
                  className="border-b border-input-bg last:border-0"
                >
                  <td className="py-2 text-text">{item.productName}</td>
                  <td className="py-2 text-muted text-right">
                    {item.stockQuantity}
                  </td>
                  <td className="py-2 text-right">
                    {item.stockQuantity === 0 ? (
                      <span className="text-rose-400 text-xs font-bold">
                        Out of Stock
                      </span>
                    ) : item.stockQuantity <= item.lowStockThreshold ? (
                      <span className="text-amber-400 text-xs font-bold">
                        Low Stock
                      </span>
                    ) : (
                      <span className="text-emerald-400 text-xs font-bold">
                        OK
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <form
          onSubmit={handleAdjustment}
          className="bg-surface rounded-2xl border border-primary/10 p-6 space-y-3"
        >
          <h3 className="text-sm font-bold text-text">Manual Adjustment</h3>
          <select
            value={adjProductId}
            onChange={(e) => setAdjProductId(e.target.value)}
            className="w-full bg-inputBg border border-primary/10 rounded-lg p-2 text-sm text-text"
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
            value={adjQuantity}
            onChange={(e) => setAdjQuantity(e.target.value)}
            placeholder="Quantity (negative to remove)"
            className="w-full bg-inputBg border border-primary/10 rounded-lg p-2 text-sm text-text"
          />
          <select
            value={adjReason}
            onChange={(e) => setAdjReason(e.target.value)}
            className="w-full bg-inputBg border border-primary/10 rounded-lg p-2 text-sm text-text"
          >
            {ADJUSTMENT_REASONS.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
          <input
            type="text"
            value={adjNotes}
            onChange={(e) => setAdjNotes(e.target.value)}
            placeholder="Notes (optional)"
            className="w-full bg-inputBg border border-primary/10 rounded-lg p-2 text-sm text-text"
          />
          {adjError && <p className="text-xs text-rose-400">{adjError}</p>}
          <button
            type="submit"
            disabled={adjSubmitting}
            className="w-full py-2 rounded-lg bg-inputBg text-text text-sm font-bold disabled:opacity-50 cursor-pointer"
          >
            {adjSubmitting ? "Saving..." : "Record Adjustment"}
          </button>
        </form>

        <form
          onSubmit={handleSupplierReturn}
          className="bg-surface rounded-2xl border border-primary/10 p-6 space-y-3"
        >
          <h3 className="text-sm font-bold text-text">Supplier Return</h3>
          <select
            value={returnProductId}
            onChange={(e) => setReturnProductId(e.target.value)}
            className="w-full bg-inputBg border border-primary/10 rounded-lg p-2 text-sm text-text"
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
            value={returnQuantity}
            onChange={(e) => setReturnQuantity(e.target.value)}
            placeholder="Quantity"
            className="w-full bg-inputBg border border-primary/10 rounded-lg p-2 text-sm text-text"
          />
          <input
            type="text"
            value={returnNotes}
            onChange={(e) => setReturnNotes(e.target.value)}
            placeholder="Notes (optional)"
            className="w-full bg-inputBg border border-primary/10 rounded-lg p-2 text-sm text-text"
          />
          {returnError && <p className="text-xs text-rose-400">{returnError}</p>}
          <button
            type="submit"
            disabled={returnSubmitting}
            className="w-full py-2 rounded-lg bg-inputBg text-text text-sm font-bold disabled:opacity-50 cursor-pointer"
          >
            {returnSubmitting ? "Saving..." : "Record Return"}
          </button>
        </form>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <form
          onSubmit={handleCreateBatch}
          className="bg-surface rounded-2xl border border-primary/10 p-6 space-y-3"
        >
          <h3 className="text-sm font-bold text-text">Receive Stock (New Batch)</h3>
          <select
            value={batchProductId}
            onChange={(e) => setBatchProductId(e.target.value)}
            className="w-full bg-inputBg border border-primary/10 rounded-lg p-2 text-sm text-text"
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
            value={batchUnitPrice}
            onChange={(e) => setBatchUnitPrice(e.target.value)}
            placeholder="Unit cost price (KES)"
            className="w-full bg-inputBg border border-primary/10 rounded-lg p-2 text-sm text-text"
          />
          <input
            type="text"
            value={batchLabel}
            onChange={(e) => setBatchLabel(e.target.value)}
            placeholder="Label (e.g. July delivery)"
            className="w-full bg-inputBg border border-primary/10 rounded-lg p-2 text-sm text-text"
          />
          <input
            type="number"
            value={batchExpected}
            onChange={(e) => setBatchExpected(e.target.value)}
            placeholder="Expected quantity"
            className="w-full bg-inputBg border border-primary/10 rounded-lg p-2 text-sm text-text"
          />
          {batchError && <p className="text-xs text-rose-400">{batchError}</p>}
          <button
            type="submit"
            disabled={batchSubmitting}
            className="w-full py-2 rounded-lg bg-inputBg text-text text-sm font-bold disabled:opacity-50 cursor-pointer"
          >
            {batchSubmitting ? "Creating..." : "Create Batch"}
          </button>
          {newBatchQr && (
            <div className="pt-2 text-center">
              <p className="text-xs text-muted mb-2">
                Print/display this QR code on the delivery
              </p>
              <Image
                src={`data:image/png;base64,${newBatchQr}`}
                alt="Stock batch QR code"
                width={120}
                height={120}
                className="mx-auto"
                unoptimized
              />
            </div>
          )}
        </form>

        <form
          onSubmit={handleReceive}
          className="bg-surface rounded-2xl border border-primary/10 p-6 space-y-3"
        >
          <h3 className="text-sm font-bold text-text">
            Scan &amp; Receive Batch
          </h3>
          <input
            type="text"
            value={receiveCode}
            onChange={(e) => setReceiveCode(e.target.value)}
            placeholder="Batch code"
            className="w-full bg-inputBg border border-primary/10 rounded-lg p-2 text-sm text-text"
          />
          <input
            type="number"
            value={receiveQuantity}
            onChange={(e) => setReceiveQuantity(e.target.value)}
            placeholder="Quantity received"
            className="w-full bg-inputBg border border-primary/10 rounded-lg p-2 text-sm text-text"
          />
          {receiveError && (
            <p className="text-xs text-rose-400">{receiveError}</p>
          )}
          <button
            type="submit"
            disabled={receiveSubmitting}
            className="w-full py-2 rounded-lg bg-inputBg text-text text-sm font-bold disabled:opacity-50 cursor-pointer"
          >
            {receiveSubmitting ? "Recording..." : "Receive"}
          </button>

          {batches && batches.length > 0 && (
            <div className="pt-2 space-y-1">
              <p className="text-xs text-muted">Existing batches:</p>
              {batches.map((b) => (
                <p key={b.id} className="text-xs text-text">
                  {b.label || b.productName} — {b.receivedQuantity}/
                  {b.expectedQuantity} received ({b.qrCode.slice(0, 8)}...)
                </p>
              ))}
            </div>
          )}
        </form>
      </div>

      <div className="bg-surface rounded-2xl border border-primary/10 p-6">
        <h3 className="text-sm font-bold text-text mb-4">
          Inventory Movements
        </h3>
        {!movements || movements.length === 0 ? (
          <p className="text-muted text-xs">No movements yet.</p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-muted uppercase text-xs tracking-widest border-b border-input-bg">
                <th className="pb-2 font-medium">Product</th>
                <th className="pb-2 font-medium">Type</th>
                <th className="pb-2 font-medium text-right">Qty</th>
                <th className="pb-2 font-medium">Date</th>
              </tr>
            </thead>
            <tbody>
              {movements.slice(0, 15).map((m) => (
                <tr key={m.id} className="border-b border-input-bg last:border-0">
                  <td className="py-2 text-text">{m.productName}</td>
                  <td className="py-2 text-muted">{m.transactionType}</td>
                  <td
                    className={`py-2 text-right font-bold ${
                      m.quantity < 0 ? "text-rose-400" : "text-emerald-400"
                    }`}
                  >
                    {m.quantity > 0 ? "+" : ""}
                    {m.quantity}
                  </td>
                  <td className="py-2 text-muted">
                    {new Date(m.createdAt).toLocaleString()}
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
