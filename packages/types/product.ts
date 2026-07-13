// # Product and Category interfaces

export interface Product {
  id: string;
  tenantId: string;
  name: string;
  price: number;
  category: string;
}

export interface Category {
  id: string;
  name: string;
}
