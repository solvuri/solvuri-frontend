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
