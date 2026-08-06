// # Real Clearack API shapes (distinct from the mock Product/Order used
// elsewhere) — see API_DOCUMENTATION.md §3. No rating/colors/sizes/
// highlights here: the real backend doesn't have those fields.

export interface ClearackCategory {
  id: number;
  categoryName: string;
  description?: string;
}

export interface ClearackProduct {
  id: number;
  productName: string;
  description?: string;
  price: number;
  stockQuantity: number;
  mainImageUrl: string | null;
  isVisible: boolean;
  categoryId?: number;
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
