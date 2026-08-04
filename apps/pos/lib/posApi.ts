// apps/pos/lib/posApi.ts
import { useQuery } from "@tanstack/react-query";
import type {
  PosProduct,
  PosReceipt,
  PosSaleDetail,
  PosSaleInput,
  PosSaleResult,
  PosSaleSummary,
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

// POST /api/pos/sale — instant one-shot walk-in sale (single payment
// method, no discount/split-tender). The fuller cart/checkout/discount
// flow exists server-side but isn't wired here — out of scope for this
// pass, same as real STK-push checkout was deferred for apps/clearracks.
export function submitSale(input: PosSaleInput): Promise<PosSaleResult> {
  return posApi
    .post<PosSaleResult>("/api/pos/sale", input)
    .then((res) => res.data);
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
