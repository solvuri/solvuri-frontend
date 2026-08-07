// apps/pos/lib/posApi.ts
import { useQuery } from "@tanstack/react-query";
import type {
  AwardLoyaltyInput,
  BulkPriceUpdateItem,
  BulkPriceUpdateResult,
  CreatePosCustomerInput,
  ExchangeSaleInput,
  ExchangeSaleResult,
  PosCart,
  PosCashierReport,
  PosCustomer,
  PosDiscountInput,
  PosInventoryItem,
  PosInventoryMovement,
  PosPaymentInput,
  PosPaymentMethodReport,
  PosPriceHistoryEntry,
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
  PosStockCountSession,
  PosTaxReport,
  PosTopCustomer,
  PosTopProduct,
  RefundSaleInput,
  UpdatePosCustomerInput,
  VoidSaleInput,
} from "@repo/types";
import { posApi } from "./api";

// GET /api/clearack/products/merchant/{merchantId} — same anonymous
// storefront catalog apps/clearack uses. POS sells the same Product
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

// POST /api/pos/sales/{saleId}/receipt/email — no documented response
// example; typed as void, matching the envelope's data:null convention for
// other action-only endpoints in this API (e.g. agent deactivate/reactivate).
export function emailReceipt(
  merchantId: number,
  saleId: number,
  email: string,
): Promise<void> {
  return posApi
    .post(`/api/pos/sales/${saleId}/receipt/email`, { merchantId, email })
    .then(() => undefined);
}

// POST /api/pos/sales/{saleId}/receipt/sms — same undocumented-response
// caveat as emailReceipt above.
export function smsReceipt(
  merchantId: number,
  saleId: number,
  phone: string,
): Promise<void> {
  return posApi
    .post(`/api/pos/sales/${saleId}/receipt/sms`, { merchantId, phone })
    .then(() => undefined);
}

// POST /api/pos/sales/{saleId}/void — Merchant owner only. Fully reverses
// a sale: restocks every line, reverses all payments. No response example
// in the API doc — typed as returning the updated sale, matching every
// other sale-lifecycle mutation on this controller; callers should refetch
// via useSale if that assumption turns out wrong.
export function voidSale(
  saleId: number,
  input: VoidSaleInput,
): Promise<PosSaleDetail> {
  return posApi
    .post<PosSaleDetail>(`/api/pos/sales/${saleId}/void`, input)
    .then((res) => res.data);
}

// POST /api/pos/sales/{saleId}/refund — full or partial (per-line) refund.
// Same undocumented-response caveat as voidSale above.
export function refundSale(
  saleId: number,
  input: RefundSaleInput,
): Promise<PosSaleDetail> {
  return posApi
    .post<PosSaleDetail>(`/api/pos/sales/${saleId}/refund`, input)
    .then((res) => res.data);
}

// POST /api/pos/sales/{saleId}/exchange — return some lines + add new
// lines in one call. Response shape IS documented: the updated sale plus
// netAmountDue (positive = customer owes more, negative = customer is
// owed a refund) — the endpoint itself never auto-settles that balance.
export function exchangeSale(
  saleId: number,
  input: ExchangeSaleInput,
): Promise<ExchangeSaleResult> {
  return posApi
    .post<ExchangeSaleResult>(`/api/pos/sales/${saleId}/exchange`, input)
    .then((res) => res.data);
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

// --- Formal Stock-Count (cycle count) ---
//
// Distinct from stock-batches above — this is periodically auditing what's
// already on the shelf against what the system thinks is there, not
// receiving new stock. Only one "InProgress" session per merchant at a
// time (enforced server-side); there's no dedicated "current session"
// endpoint, so callers find the in-progress one (if any) by filtering
// useStockCountHistory's results themselves.

export function startStockCount(
  merchantId: number,
  notes?: string,
): Promise<PosStockCountSession> {
  return posApi
    .post<PosStockCountSession>("/api/pos/stock-count/start", {
      merchantId,
      ...(notes && { notes }),
    })
    .then((res) => res.data);
}

export function scanStockCountItem(
  merchantId: number,
  sessionId: number,
  productId: number,
  countedQuantity: number,
): Promise<PosStockCountSession> {
  return posApi
    .post<PosStockCountSession>(`/api/pos/stock-count/${sessionId}/scan`, {
      merchantId,
      productId,
      countedQuantity,
    })
    .then((res) => res.data);
}

// Finalizes the session — any variance overwrites Product.StockQuantity and
// logs an adjustment. No documented response example; typed as returning
// the completed session by inference from the scan endpoint's own shape.
export function completeStockCount(
  merchantId: number,
  sessionId: number,
): Promise<PosStockCountSession> {
  return posApi
    .post<PosStockCountSession>(`/api/pos/stock-count/${sessionId}/complete`, {
      merchantId,
    })
    .then((res) => res.data);
}

export function fetchStockCountHistory(
  merchantId: number,
): Promise<PosStockCountSession[]> {
  return posApi
    .get<PosStockCountSession[]>("/api/pos/stock-count/history", {
      params: { merchantId },
    })
    .then((res) => res.data);
}

export function useStockCountHistory(merchantId: number | null) {
  return useQuery({
    queryKey: ["pos-stock-count-history", merchantId],
    queryFn: () => fetchStockCountHistory(merchantId as number),
    enabled: merchantId !== null,
  });
}

export function fetchStockCountSession(
  merchantId: number,
  sessionId: number,
): Promise<PosStockCountSession> {
  return posApi
    .get<PosStockCountSession>(`/api/pos/stock-count/${sessionId}`, {
      params: { merchantId },
    })
    .then((res) => res.data);
}

export function useStockCountSession(
  merchantId: number | null,
  sessionId: number | null,
) {
  return useQuery({
    queryKey: ["pos-stock-count-session", merchantId, sessionId],
    queryFn: () =>
      fetchStockCountSession(merchantId as number, sessionId as number),
    enabled: merchantId !== null && sessionId !== null,
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

// --- Customers + Loyalty ---
//
// No response example is documented for any endpoint below (see PosCustomer's
// comment in @repo/types) — typed by inference from the request DTOs and this
// API's own id/createdAt convention.

export function fetchCustomers(merchantId: number): Promise<PosCustomer[]> {
  return posApi
    .get<PosCustomer[]>("/api/pos/customers", { params: { merchantId } })
    .then((res) => res.data);
}

export function useCustomers(merchantId: number | null) {
  return useQuery({
    queryKey: ["pos-customers", merchantId],
    queryFn: () => fetchCustomers(merchantId as number),
    enabled: merchantId !== null,
  });
}

export function createCustomer(
  merchantId: number,
  input: CreatePosCustomerInput,
): Promise<PosCustomer> {
  return posApi
    .post<PosCustomer>("/api/pos/customers", { merchantId, ...input })
    .then((res) => res.data);
}

export function fetchCustomer(
  merchantId: number,
  customerId: number,
): Promise<PosCustomer> {
  return posApi
    .get<PosCustomer>(`/api/pos/customers/${customerId}`, {
      params: { merchantId },
    })
    .then((res) => res.data);
}

export function useCustomer(
  merchantId: number | null,
  customerId: number | null,
) {
  return useQuery({
    queryKey: ["pos-customer", merchantId, customerId],
    queryFn: () => fetchCustomer(merchantId as number, customerId as number),
    enabled: merchantId !== null && customerId !== null,
  });
}

export function updateCustomer(
  merchantId: number,
  customerId: number,
  input: UpdatePosCustomerInput,
): Promise<PosCustomer> {
  return posApi
    .put<PosCustomer>(`/api/pos/customers/${customerId}`, {
      merchantId,
      ...input,
    })
    .then((res) => res.data);
}

// GET /api/pos/customers/{id}/sales — matched server-side by phone number
// string against Order.CustomerPhone (no real foreign key), so this only
// finds sales rung up with the same phone number as this customer record.
export function fetchCustomerSales(
  merchantId: number,
  customerId: number,
): Promise<PosSaleSummary[]> {
  return posApi
    .get<PosSaleSummary[]>(`/api/pos/customers/${customerId}/sales`, {
      params: { merchantId },
    })
    .then((res) => res.data);
}

export function useCustomerSales(
  merchantId: number | null,
  customerId: number | null,
) {
  return useQuery({
    queryKey: ["pos-customer-sales", merchantId, customerId],
    queryFn: () =>
      fetchCustomerSales(merchantId as number, customerId as number),
    enabled: merchantId !== null && customerId !== null,
  });
}

// POST /api/pos/customers/{id}/loyalty — positive points to award, negative
// to redeem.
export function awardLoyalty(
  merchantId: number,
  customerId: number,
  input: AwardLoyaltyInput,
): Promise<PosCustomer> {
  return posApi
    .post<PosCustomer>(`/api/pos/customers/${customerId}/loyalty`, {
      merchantId,
      ...input,
    })
    .then((res) => res.data);
}

// --- Pricing (Merchant owner only, or Solvuri admin) ---

// POST /api/pos/pricing/override — one-off price override on an item
// already in an open cart. No documented response example — typed as
// returning the updated cart, matching every other cart-mutation endpoint
// in this API (create/add/update/remove item, apply/remove discount all
// return the full cart).
export function overridePrice(
  merchantId: number,
  cartItemId: number,
  newPrice: number,
  reason?: string,
): Promise<PosCart> {
  return posApi
    .post<PosCart>("/api/pos/pricing/override", {
      merchantId,
      cartItemId,
      overridePrice: newPrice,
      ...(reason && { reason }),
    })
    .then((res) => res.data);
}

// POST /api/pos/pricing/bulk-update — update Product.Price for many
// products at once. Response IS documented: { updatedCount }.
export function bulkUpdatePrices(
  merchantId: number,
  updates: BulkPriceUpdateItem[],
): Promise<BulkPriceUpdateResult> {
  return posApi
    .post<BulkPriceUpdateResult>("/api/pos/pricing/bulk-update", {
      merchantId,
      updates,
    })
    .then((res) => res.data);
}

// GET /api/pos/pricing/history — audit log of every price change. No
// documented response example (see PosPriceHistoryEntry's comment).
export function fetchPriceHistory(
  merchantId: number,
): Promise<PosPriceHistoryEntry[]> {
  return posApi
    .get<PosPriceHistoryEntry[]>("/api/pos/pricing/history", {
      params: { merchantId },
    })
    .then((res) => res.data);
}

export function usePriceHistory(merchantId: number | null) {
  return useQuery({
    queryKey: ["pos-price-history", merchantId],
    queryFn: () => fetchPriceHistory(merchantId as number),
    enabled: merchantId !== null,
  });
}
