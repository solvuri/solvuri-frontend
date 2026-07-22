// # Product and Category interfaces

export interface Category {
  id?: string;
  name: string;
}

export interface Product {
  id: string;
  tenantId?: string;
  name: string;
  price: number;
  images: string[];
  category?: Category;
  size?: string;
  isSold?: boolean;
  description?: string;
  highlights?: string[];
  colors?: string[];
  sizes?: string[];
  rating?: number;
  reviews?: number;
}
