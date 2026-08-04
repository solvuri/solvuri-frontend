// apps/pos/lib/posApi.ts
import { useQuery } from "@tanstack/react-query";
import type {
  PosCart,
  PosCashierReport,
  PosDiscountInput,
  PosInventoryItem,
  PosInventoryMovement,
  PosPaymentInput,
  PosPaymentMethodReport,
  PosProduct,
  PosProfitReport,
  PosReceipt,
  PosRegisterReconciliation,
  PosRegisterSession,
  PosReturnsReport,
  PosSaleDetail,
  PosSalesReport,
  PosSaleSummary,
  PosStockBatch,
  PosTaxReport,
  PosTopCustomer,
  PosTopProduct,
} from "@repo/types";
import { posApi } from "./api";

// GET /api/clearack/products/merchant/{merchantId} — same anonymous
// storefront catalog apps/clearracks uses. POS sells the same Product
// table (no dedicated POS product-list endpoint exists), so this is a
// deliberate reuse, not a duplicate implementation.
export function fetchCatalogProducts(
  merchantId: number,
): Promise<PosProduct[]> {
  return posApi
    .get<PosProduct[]>(`/api/clearack/products/merchant/${merchantId}`)
    .then((res) => res.data);
}

export function useCatalogProducts(merchantId: number | null) {
  return useQuery({
    queryKey: ["pos-catalog-products", merchantId],
    queryFn: () => fetchCatalogProducts(merchantId as number),
    enabled: merchantId !== null,
  });
}

// GET /api/pos/sales?merchantId=... — list/filter completed sales.
export function fetchSales(merchantId: number): Promise<PosSaleSummary[]> {
  return posApi
    .get<PosSaleSummary[]>("/api/pos/sales", { params: { merchantId } })
    .then((res) => res.data);
}

export function useSales(merchantId: number | null) {
  return useQuery({
    queryKey: ["pos-sales", merchantId],
    queryFn: () => fetchSales(merchantId as number),
    enabled: merchantId !== null,
  });
}

// GET /api/pos/sales/{saleId}?merchantId= — one sale's detail.
export function fetchSale(
  merchantId: number,
  saleId: number,
): Promise<PosSaleDetail> {
  return posApi
    .get<PosSaleDetail>(`/api/pos/sales/${saleId}`, { params: { merchantId } })
    .then((res) => res.data);
}

export function useSale(merchantId: number | null, saleId: number | null) {
  return useQuery({
    queryKey: ["pos-sale", merchantId, saleId],
    queryFn: () => fetchSale(merchantId as number, saleId as number),
    enabled: merchantId !== null && saleId !== null,
  });
}

// GET /api/pos/sales/{saleId}/receipt?merchantId= — structured,
// print-ready receipt payload.
export function fetchReceipt(
  merchantId: number,
  saleId: number,
): Promise<PosReceipt> {
  return posApi
    .get<PosReceipt>(`/api/pos/sales/${saleId}/receipt`, {
      params: { merchantId },
    })
    .then((res) => res.data);
}

export function useReceipt(merchantId: number | null, saleId: number | null) {
  return useQuery({
    queryKey: ["pos-receipt", merchantId, saleId],
    queryFn: () => fetchReceipt(merchantId as number, saleId as number),
    enabled: merchantId !== null && saleId !== null,
  });
}

// --- Cart-based checkout (discounts + split-tender payments) ---
//
// Every cart mutation below (create, add/update/remove item, apply/remove
// discount) returns the FULL updated cart — confirmed by probing the real
// backend, since the API doc gives no example body for POST /carts or GET
// /carts/{cartId}. Callers should use the mutation's own response to
// update state directly rather than re-fetching.

export function createCart(merchantId: number): Promise<PosCart> {
  return posApi
    .post<PosCart>("/api/pos/carts", { merchantId })
    .then((res) => res.data);
}

export function fetchCart(
  merchantId: number,
  cartId: number,
): Promise<PosCart> {
  return posApi
    .get<PosCart>(`/api/pos/carts/${cartId}`, { params: { merchantId } })
    .then((res) => res.data);
}

export function useCart(merchantId: number | null, cartId: number | null) {
  return useQuery({
    queryKey: ["pos-cart", merchantId, cartId],
    queryFn: () => fetchCart(merchantId as number, cartId as number),
    enabled: merchantId !== null && cartId !== null,
  });
}

export function addCartItem(
  merchantId: number,
  cartId: number,
  productId: number,
  quantity: number,
): Promise<PosCart> {
  return posApi
    .post<PosCart>(`/api/pos/carts/${cartId}/items`, {
      merchantId,
      productId,
      quantity,
    })
    .then((res) => res.data);
}

export function updateCartItemQty(
  merchantId: number,
  cartId: number,
  itemId: number,
  quantity: number,
): Promise<PosCart> {
  return posApi
    .put<PosCart>(`/api/pos/carts/${cartId}/items/${itemId}`, {
      merchantId,
      quantity,
    })
    .then((res) => res.data);
}

export function removeCartItem(
  merchantId: number,
  cartId: number,
  itemId: number,
): Promise<PosCart> {
  return posApi
    .delete<PosCart>(`/api/pos/carts/${cartId}/items/${itemId}`, {
      params: { merchantId },
    })
    .then((res) => res.data);
}

export function applyCartDiscount(
  merchantId: number,
  cartId: number,
  input: PosDiscountInput,
): Promise<PosCart> {
  return posApi
    .post<PosCart>(`/api/pos/carts/${cartId}/discount`, {
      merchantId,
      ...input,
    })
    .then((res) => res.data);
}

export function removeCartDiscount(
  merchantId: number,
  cartId: number,
): Promise<PosCart> {
  return posApi
    .delete<PosCart>(`/api/pos/carts/${cartId}/discount`, {
      params: { merchantId },
    })
    .then((res) => res.data);
}

export function cancelCart(
  merchantId: number,
  cartId: number,
): Promise<void> {
  return posApi
    .post(`/api/pos/carts/${cartId}/cancel`, null, { params: { merchantId } })
    .then(() => undefined);
}

export function checkoutCart(
  merchantId: number,
  cartId: number,
  payments: PosPaymentInput[],
): Promise<PosSaleDetail> {
  return posApi
    .post<PosSaleDetail>(`/api/pos/carts/${cartId}/checkout`, {
      merchantId,
      payments,
    })
    .then((res) => res.data);
}

// --- Register/till sessions (optional — sales work with or without one) ---

export function openRegister(
  merchantId: number,
  openingCashAmount: number,
  notes?: string,
): Promise<PosRegisterSession> {
  return posApi
    .post<PosRegisterSession>("/api/pos/register/open", {
      merchantId,
      openingCashAmount,
      notes,
    })
    .then((res) => res.data);
}

// GET /api/pos/register/current — 404s with "No open register session"
// when none is open, confirmed against the real backend. That's not an
// error state for this hook's purposes, so any failure here resolves to
// null rather than surfacing react-query's error state.
export function fetchCurrentRegisterSession(
  merchantId: number,
): Promise<PosRegisterSession | null> {
  return posApi
    .get<PosRegisterSession>("/api/pos/register/current", {
      params: { merchantId },
    })
    .then((res) => res.data)
    .catch(() => null);
}

export function useCurrentRegisterSession(merchantId: number | null) {
  return useQuery({
    queryKey: ["pos-register-current", merchantId],
    queryFn: () => fetchCurrentRegisterSession(merchantId as number),
    enabled: merchantId !== null,
  });
}

export function closeRegister(
  merchantId: number,
  sessionId: number,
  closingCashAmount: number,
  notes?: string,
): Promise<PosRegisterReconciliation> {
  return posApi
    .post<PosRegisterReconciliation>(
      "/api/pos/register/close",
      { merchantId, closingCashAmount, notes },
      { params: { sessionId } },
    )
    .then((res) => res.data);
}

export function cashIn(
  merchantId: number,
  amount: number,
  notes?: string,
): Promise<PosRegisterSession> {
  return posApi
    .post<PosRegisterSession>("/api/pos/register/cash-in", {
      merchantId,
      amount,
      notes,
    })
    .then((res) => res.data);
}

export function cashOut(
  merchantId: number,
  amount: number,
  notes?: string,
): Promise<PosRegisterSession> {
  return posApi
    .post<PosRegisterSession>("/api/pos/register/cash-out", {
      merchantId,
      amount,
      notes,
    })
    .then((res) => res.data);
}

export function fetchReconciliationPreview(
  merchantId: number,
  sessionId: number,
): Promise<PosRegisterReconciliation> {
  return posApi
    .get<PosRegisterReconciliation>("/api/pos/register/reconciliation", {
      params: { merchantId, sessionId },
    })
    .then((res) => res.data);
}

export function useReconciliationPreview(
  merchantId: number | null,
  sessionId: number | null,
) {
  return useQuery({
    queryKey: ["pos-register-reconciliation", merchantId, sessionId],
    queryFn: () =>
      fetchReconciliationPreview(merchantId as number, sessionId as number),
    enabled: merchantId !== null && sessionId !== null,
  });
}

// --- Reports (Merchant owner only, or Solvuri admin — never MerchantAgent) ---

export function fetchSalesReport(
  merchantId: number,
  from: string,
  to: string,
): Promise<PosSalesReport> {
  return posApi
    .get<PosSalesReport>("/api/pos/reports/sales", {
      params: { merchantId, from, to },
    })
    .then((res) => res.data);
}

export function useSalesReport(
  merchantId: number | null,
  from: string,
  to: string,
) {
  return useQuery({
    queryKey: ["pos-report-sales", merchantId, from, to],
    queryFn: () => fetchSalesReport(merchantId as number, from, to),
    enabled: merchantId !== null,
  });
}

export function fetchProfitReport(
  merchantId: number,
  from: string,
  to: string,
): Promise<PosProfitReport> {
  return posApi
    .get<PosProfitReport>("/api/pos/reports/profit", {
      params: { merchantId, from, to },
    })
    .then((res) => res.data);
}

export function useProfitReport(
  merchantId: number | null,
  from: string,
  to: string,
) {
  return useQuery({
    queryKey: ["pos-report-profit", merchantId, from, to],
    queryFn: () => fetchProfitReport(merchantId as number, from, to),
    enabled: merchantId !== null,
  });
}

export function fetchTaxReport(
  merchantId: number,
  from: string,
  to: string,
): Promise<PosTaxReport> {
  return posApi
    .get<PosTaxReport>("/api/pos/reports/tax", {
      params: { merchantId, from, to },
    })
    .then((res) => res.data);
}

export function useTaxReport(
  merchantId: number | null,
  from: string,
  to: string,
) {
  return useQuery({
    queryKey: ["pos-report-tax", merchantId, from, to],
    queryFn: () => fetchTaxReport(merchantId as number, from, to),
    enabled: merchantId !== null,
  });
}

export function fetchTopProducts(
  merchantId: number,
  from: string,
  to: string,
  take = 5,
): Promise<PosTopProduct[]> {
  return posApi
    .get<PosTopProduct[]>("/api/pos/reports/top-products", {
      params: { merchantId, from, to, take },
    })
    .then((res) => res.data);
}

export function useTopProducts(
  merchantId: number | null,
  from: string,
  to: string,
  take = 5,
) {
  return useQuery({
    queryKey: ["pos-report-top-products", merchantId, from, to, take],
    queryFn: () => fetchTopProducts(merchantId as number, from, to, take),
    enabled: merchantId !== null,
  });
}

export function fetchTopCustomers(
  merchantId: number,
  from: string,
  to: string,
  take = 5,
): Promise<PosTopCustomer[]> {
  return posApi
    .get<PosTopCustomer[]>("/api/pos/reports/top-customers", {
      params: { merchantId, from, to, take },
    })
    .then((res) => res.data);
}

export function useTopCustomers(
  merchantId: number | null,
  from: string,
  to: string,
  take = 5,
) {
  return useQuery({
    queryKey: ["pos-report-top-customers", merchantId, from, to, take],
    queryFn: () => fetchTopCustomers(merchantId as number, from, to, take),
    enabled: merchantId !== null,
  });
}

export function fetchCashierReport(
  merchantId: number,
  from: string,
  to: string,
): Promise<PosCashierReport[]> {
  return posApi
    .get<PosCashierReport[]>("/api/pos/reports/cashiers", {
      params: { merchantId, from, to },
    })
    .then((res) => res.data);
}

export function useCashierReport(
  merchantId: number | null,
  from: string,
  to: string,
) {
  return useQuery({
    queryKey: ["pos-report-cashiers", merchantId, from, to],
    queryFn: () => fetchCashierReport(merchantId as number, from, to),
    enabled: merchantId !== null,
  });
}

export function fetchPaymentMethodReport(
  merchantId: number,
  from: string,
  to: string,
): Promise<PosPaymentMethodReport[]> {
  return posApi
    .get<PosPaymentMethodReport[]>("/api/pos/reports/payment-methods", {
      params: { merchantId, from, to },
    })
    .then((res) => res.data);
}

export function usePaymentMethodReport(
  merchantId: number | null,
  from: string,
  to: string,
) {
  return useQuery({
    queryKey: ["pos-report-payment-methods", merchantId, from, to],
    queryFn: () => fetchPaymentMethodReport(merchantId as number, from, to),
    enabled: merchantId !== null,
  });
}

export function fetchReturnsReport(
  merchantId: number,
  from: string,
  to: string,
): Promise<PosReturnsReport> {
  return posApi
    .get<PosReturnsReport>("/api/pos/reports/returns", {
      params: { merchantId, from, to },
    })
    .then((res) => res.data);
}

export function useReturnsReport(
  merchantId: number | null,
  from: string,
  to: string,
) {
  return useQuery({
    queryKey: ["pos-report-returns", merchantId, from, to],
    queryFn: () => fetchReturnsReport(merchantId as number, from, to),
    enabled: merchantId !== null,
  });
}

// --- Inventory & stock (open to Merchant and MerchantAgent alike) ---

export function fetchInventory(
  merchantId: number,
): Promise<PosInventoryItem[]> {
  return posApi
    .get<PosInventoryItem[]>("/api/pos/inventory", { params: { merchantId } })
    .then((res) => res.data);
}

export function useInventory(merchantId: number | null) {
  return useQuery({
    queryKey: ["pos-inventory", merchantId],
    queryFn: () => fetchInventory(merchantId as number),
    enabled: merchantId !== null,
  });
}

export function fetchLowStock(
  merchantId: number,
): Promise<PosInventoryItem[]> {
  return posApi
    .get<PosInventoryItem[]>("/api/pos/inventory/low-stock", {
      params: { merchantId },
    })
    .then((res) => res.data);
}

export function useLowStock(merchantId: number | null) {
  return useQuery({
    queryKey: ["pos-inventory-low-stock", merchantId],
    queryFn: () => fetchLowStock(merchantId as number),
    enabled: merchantId !== null,
  });
}

export function fetchOutOfStock(
  merchantId: number,
): Promise<PosInventoryItem[]> {
  return posApi
    .get<PosInventoryItem[]>("/api/pos/inventory/out-of-stock", {
      params: { merchantId },
    })
    .then((res) => res.data);
}

export function useOutOfStock(merchantId: number | null) {
  return useQuery({
    queryKey: ["pos-inventory-out-of-stock", merchantId],
    queryFn: () => fetchOutOfStock(merchantId as number),
    enabled: merchantId !== null,
  });
}

export function fetchInventoryMovements(
  merchantId: number,
): Promise<PosInventoryMovement[]> {
  return posApi
    .get<PosInventoryMovement[]>("/api/pos/inventory/movements", {
      params: { merchantId },
    })
    .then((res) => res.data);
}

export function useInventoryMovements(merchantId: number | null) {
  return useQuery({
    queryKey: ["pos-inventory-movements", merchantId],
    queryFn: () => fetchInventoryMovements(merchantId as number),
    enabled: merchantId !== null,
  });
}

// Confirmed via probing: both adjustment and supplier-return responses are
// just { stockQuantity } — the API doc gives request examples for both but
// no response body for either.
export function submitAdjustment(
  merchantId: number,
  productId: number,
  quantity: number,
  reason: string,
  notes?: string,
): Promise<{ stockQuantity: number }> {
  return posApi
    .post<{ stockQuantity: number }>("/api/pos/inventory/adjustment", {
      merchantId,
      productId,
      quantity,
      reason,
      notes,
    })
    .then((res) => res.data);
}

export function submitSupplierReturn(
  merchantId: number,
  productId: number,
  quantity: number,
  notes?: string,
): Promise<{ stockQuantity: number }> {
  return posApi
    .post<{ stockQuantity: number }>("/api/pos/inventory/supplier-return", {
      merchantId,
      productId,
      quantity,
      notes,
    })
    .then((res) => res.data);
}

export function createStockBatch(
  merchantId: number,
  productId: number,
  unitPrice: number,
  label: string,
  expectedQuantity: number,
): Promise<PosStockBatch> {
  return posApi
    .post<PosStockBatch>("/api/pos/stock-batches", {
      merchantId,
      productId,
      unitPrice,
      label,
      expectedQuantity,
    })
    .then((res) => res.data);
}

export function fetchStockBatches(
  merchantId: number,
): Promise<PosStockBatch[]> {
  return posApi
    .get<PosStockBatch[]>("/api/pos/stock-batches", {
      params: { merchantId },
    })
    .then((res) => res.data);
}

export function useStockBatches(merchantId: number | null) {
  return useQuery({
    queryKey: ["pos-stock-batches", merchantId],
    queryFn: () => fetchStockBatches(merchantId as number),
    enabled: merchantId !== null,
  });
}

export function receiveStockBatch(
  merchantId: number,
  code: string,
  quantity: number,
): Promise<PosStockBatch> {
  return posApi
    .post<PosStockBatch>(`/api/pos/stock-batches/${code}/receive`, {
      merchantId,
      quantity,
    })
    .then((res) => res.data);
}
