// Real POS API shapes (see API_DOCUMENTATION.md §4) — distinct from the
// mock Sale/SaleItem still used elsewhere. POS sells the same Product
// catalog as Clearack (no separate POS product endpoint exists), so
// PosProduct just re-exports ClearackProduct rather than duplicating it.

export type { ClearackProduct as PosProduct } from "./clearack";

export interface PosSaleSummary {
  id: number;
  createdAt: string;
  customerName: string;
  totalAmount: number;
  status: string;
  paymentStatus: string;
}

export interface PosSaleItem {
  orderItemId: number;
  productId: number;
  productName: string;
  quantity: number;
  price: number;
}

export interface PosSalePayment {
  id: number;
  method: string;
  amount: number;
  referenceNumber: string | null;
  status: string;
}

export interface PosSaleDetail extends PosSaleSummary {
  items: PosSaleItem[];
  payments: PosSalePayment[];
}

export interface VoidSaleInput {
  merchantId: number;
  reason?: string;
}

export interface RefundLineInput {
  orderItemId: number;
  quantity: number;
}

export interface RefundSaleInput {
  merchantId: number;
  reason?: string;
  isFullRefund: boolean;
  items?: RefundLineInput[];
}

export interface ExchangeNewItemInput {
  productId: number;
  quantity: number;
}

export interface ExchangeSaleInput {
  merchantId: number;
  returnItems?: RefundLineInput[];
  newItems?: ExchangeNewItemInput[];
}

// Confirmed shape only for exchange (the API doc gives an explicit response
// example for it); void/refund have no documented response example, so
// they're typed as returning the same PosSaleDetail by inference from this
// endpoint's own pattern — not confirmed via a live probe. Refetch the sale
// afterward if that assumption turns out wrong.
export interface ExchangeSaleResult {
  sale: PosSaleDetail;
  netAmountDue: number;
}

export interface PosReceipt {
  saleId: number;
  merchantName: string;
  soldAt: string;
  customerName: string;
  items: { productName: string; quantity: number; price: number }[];
  subtotal: number;
  totalAmount: number;
  payments: { method: string; amount: number }[];
}

// Cart shapes, confirmed against the real backend (not documented with
// example bodies for create/fetch) — every mutation (create, add/update/
// remove item, apply/remove discount) returns the full updated cart, so
// callers can use the mutation response directly instead of refetching.
export interface PosCartItem {
  id: number;
  productId: number;
  productName: string;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
}

export interface PosCart {
  id: number;
  status: string;
  customerName: string | null;
  customerPhone: string | null;
  discountType: string | null;
  discountValue: number | null;
  couponCode: string | null;
  items: PosCartItem[];
  subtotal: number;
  discountAmount: number;
  total: number;
}

// Only Percentage/FixedAmount are wired in the UI — the API also lists
// Coupon/Staff discount types but documents no request shape for either.
export interface PosDiscountInput {
  discountType: "Percentage" | "FixedAmount";
  discountValue: number;
}

export interface PosPaymentInput {
  method: "Cash" | "Card" | "Mpesa";
  amount: number;
  referenceNumber?: string;
}

// Register/till session shapes, also confirmed against the real backend.
export interface PosRegisterSession {
  id: number;
  openedAt: string;
  openingCashAmount: number;
  closedAt: string | null;
  closingCashAmount: number | null;
  expectedCashAmount: number | null;
  status: string;
  notes: string | null;
}

// Same shape for the live reconciliation preview and the final close
// result — the preview just has null actualCashAmount/variance until close.
export interface PosRegisterReconciliation {
  sessionId: number;
  openingCashAmount: number;
  cashSales: number;
  cashRefunds: number;
  cashIn: number;
  cashOut: number;
  expectedCashAmount: number;
  actualCashAmount: number | null;
  variance: number | null;
}

// Report shapes, confirmed against the real backend — several field
// names differ from the API doc's own prose/examples (e.g. "totalTax"
// not "taxCollected", "unitsSold" not "quantitySold", "cashierUserId"/
// "cashierName" not "agentUserId"/"agentName").
export interface PosSalesReportDay {
  date: string;
  saleCount: number;
  revenue: number;
}

export interface PosSalesReport {
  from: string;
  to: string;
  saleCount: number;
  totalRevenue: number;
  byDay: PosSalesReportDay[];
}

export interface PosProfitReport {
  from: string;
  to: string;
  totalRevenue: number;
  totalCost: number;
  totalProfit: number;
}

export interface PosTaxReport {
  from: string;
  to: string;
  taxableRevenue: number;
  totalTax: number;
}

export interface PosTopProduct {
  productId: number;
  productName: string;
  unitsSold: number;
  revenue: number;
}

export interface PosTopCustomer {
  customerId: number | null;
  customerName: string;
  orderCount: number;
  totalSpent: number;
}

export interface PosCashierReport {
  cashierUserId: number;
  cashierName: string;
  saleCount: number;
  revenue: number;
}

export interface PosPaymentMethodReport {
  method: string;
  count: number;
  totalAmount: number;
}

export interface PosReturnsReport {
  refundCount: number;
  totalRefunded: number;
  voidCount: number;
}

// Inventory & stock shapes, also confirmed against the real backend.
export interface PosInventoryItem {
  productId: number;
  productName: string;
  stockQuantity: number;
  lowStockThreshold: number;
}

export interface PosInventoryMovement {
  id: number;
  productId: number;
  productName: string;
  quantity: number;
  transactionType: string;
  reference: string | null;
  notes: string | null;
  createdAt: string;
}

// Customer + loyalty shapes. The API doc gives request bodies for every
// endpoint here but no response examples at all — this shape is inferred
// from the create request's fields (merchantId/name/email/phone) plus the
// id/createdAt convention every other entity in this API follows, and
// loyaltyPoints since that's the whole point of the loyalty endpoint. Not
// confirmed via a live probe; adjust if a real response disagrees.
export interface PosCustomer {
  id: number;
  merchantId: number;
  name: string;
  email: string | null;
  phone: string | null;
  loyaltyPoints: number;
  createdAt: string;
}

export interface CreatePosCustomerInput {
  name: string;
  email?: string;
  phone?: string;
}

export interface UpdatePosCustomerInput {
  name?: string;
  email?: string;
  phone?: string;
}

export interface AwardLoyaltyInput {
  points: number;
  reason?: string;
}

export interface PriceOverrideInput {
  cartItemId: number;
  overridePrice: number;
  reason?: string;
}

export interface BulkPriceUpdateItem {
  productId: number;
  newPrice: number;
}

export interface BulkPriceUpdateResult {
  updatedCount: number;
}

// GET /api/pos/pricing/history — "Audit log of every price change (override
// or bulk)" per the API doc, which gives no response example at all for
// this endpoint. Shape inferred from the two request DTOs above plus this
// API's own id/createdAt convention — not confirmed via a live probe.
export interface PosPriceHistoryEntry {
  id: number;
  productId: number;
  productName: string;
  oldPrice: number;
  newPrice: number;
  reason: string | null;
  createdAt: string;
}

// Formal stock-count (cycle count) shapes — confirmed against the API
// doc's own scan-response example, the only response example given for
// this whole sub-section. start/complete/history/detail all return this
// same PosStockCountSession shape by inference from that one example, not
// individually confirmed via a live probe.
export interface PosStockCountItem {
  productId: number;
  productName: string;
  systemQuantity: number;
  countedQuantity: number;
  variance: number;
}

export interface PosStockCountSession {
  id: number;
  startedAt: string;
  completedAt: string | null;
  status: string;
  notes: string | null;
  items: PosStockCountItem[];
}

export interface PosStockBatch {
  id: number;
  productId: number;
  productName: string;
  unitPrice: number;
  label: string;
  qrCode: string;
  // Only populated on the create response — subsequent fetches return
  // null, confirmed against the real backend (presumably to keep list/
  // lookup payloads small once the code itself is already known).
  qrImage: string | null;
  expectedQuantity: number;
  receivedQuantity: number;
  createdAt: string;
}
