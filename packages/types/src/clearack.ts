// # Real Clearack API shapes (distinct from the mock Product/Order used
// elsewhere) — see API_DOCUMENTATION.md §3. No rating/colors/sizes/
// highlights here: the real backend doesn't have those fields.

export interface ClearackCategory {
  id: number;
  categoryName: string;
  description?: string;
}

// costPrice/isFeatured only appear in the merchant-owned response (the
// create/update examples in §3.1) — the anonymous public catalog endpoint
// (GET /products/merchant/{id}) omits both, hence optional here rather
// than a separate near-duplicate type.
export interface ClearackProduct {
  id: number;
  productName: string;
  description?: string;
  price: number;
  costPrice?: number;
  stockQuantity: number;
  mainImageUrl: string | null;
  isVisible: boolean;
  isFeatured?: boolean;
  categoryId?: number;
}

export interface CreateClearackProductInput {
  productName: string;
  description?: string;
  price: number;
  costPrice?: number;
  stockQuantity: number;
  categoryId: number;
}

export interface UpdateClearackProductInput {
  productName?: string;
  description?: string;
  price?: number;
  costPrice?: number;
  categoryId?: number;
  isVisible?: boolean;
  isFeatured?: boolean;
}

// POST /api/clearack/products/{id}/adjust-stock — the request DTO
// (AdjustStockDto) is confirmed via the OpenAPI appendix; no response
// example is documented anywhere for this endpoint.
export interface AdjustClearackStockInput {
  quantity: number;
  transactionType?: string;
  notes?: string;
}

// GET /api/clearack/products/inventory — "includes hidden items, cost
// price, units sold, revenue" per the doc's own prose; no response example
// given. Shape inferred as ClearackProduct plus the two figures the prose
// calls out — not confirmed via a live probe.
export interface ClearackInventoryItem extends ClearackProduct {
  unitsSold: number;
  revenue: number;
}

export interface CreateClearackCategoryInput {
  categoryName: string;
  description?: string;
}

export interface DeliveryTown {
  id: number;
  townName: string;
  county: string;
  deliveryCost: number;
}

export interface CheckoutItemInput {
  productId: number;
  quantity: number;
}

export interface CheckoutRequestInput {
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  shippingAddress: string;
  deliveryTownId: number;
  items: CheckoutItemInput[];
  couponCode?: string | null;
}

export interface CheckoutRequestResult {
  orderId: number;
}

export interface MerchantMpesaSettings {
  id: number;
  consumerKey: string;
  shortcode: string;
  partyB: string;
  callbackUrl: string;
  transactionType: string;
  isEnabled: boolean;
  isVerified: boolean;
  hasSecrets: boolean;
}

export interface MpesaSettingsInput {
  consumerKey: string;
  consumerSecret: string;
  shortcode: string;
  passkey: string;
  partyB: string;
  transactionType: string;
}

export interface CheckoutInitiateResult {
  orderId: number;
  checkoutRequestId: string;
}

export interface CheckoutStatusResult {
  orderId: number;
  paymentStatus: string;
  orderStatus: string;
}

export interface ClearackOrderItem {
  productId: number;
  productName: string;
  quantity: number;
  price: number;
}

// GET /api/clearack/orders/merchant/{merchantId} and GET .../orders/{id} —
// the documented response example (from the POST /orders create call, §3.4)
// doesn't show customerEmail/customerPhone/shippingAddress even though the
// create request body has them — marked optional here since that's not
// confirmed against a live GET response.
export interface ClearackOrder {
  id: number;
  merchantId: number;
  customerName: string;
  customerEmail?: string | null;
  customerPhone?: string | null;
  shippingAddress?: string | null;
  totalAmount: number;
  status: string;
  paymentStatus: string;
  items: ClearackOrderItem[];
}
