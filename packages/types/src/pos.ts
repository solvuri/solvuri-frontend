// Real POS API shapes (see API_DOCUMENTATION.md §4) — distinct from the
// mock Sale/SaleItem still used elsewhere. POS sells the same Product
// catalog as Clearack (no separate POS product endpoint exists), so
// PosProduct just re-exports ClearackProduct rather than duplicating it.

export type { ClearackProduct as PosProduct } from "./clearack";

export interface PosSaleItemInput {
  productId: number;
  quantity: number;
}

export interface PosSaleInput {
  merchantId: number;
  customerName: string;
  customerPhone: string;
  items: PosSaleItemInput[];
  paymentMethod: "Cash" | "Card" | "Mpesa";
}

export interface PosSaleResult {
  orderId: number;
  totalAmount: number;
  status: string;
  paymentStatus: string;
}

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
