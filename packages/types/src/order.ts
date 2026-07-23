export interface OrderItem {
  name: string;
  quantity: number;
  price: number;
  image: string;
}

export interface Order {
  id: string;
  status: string;
  date: string;
  items: OrderItem[];
  shipping: number;
  tax: number;
  total: number;
  address: string;
}
