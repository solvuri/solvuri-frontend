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
