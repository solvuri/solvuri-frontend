// packages/types/index.ts

export interface Tenant {
  id: string;
  name: string;
  domain: string;
  settings: TenantSettings;
}

export interface TenantSettings {
  whatsappNumber: string;
  themeColor: string;
}

export interface Product {
  id: string;
  tenantId: string;
  name: string;
  price: number;
  category: string;
}

export interface Reservation {
  id: string;
  roomId: string;
  customerName: string;
  checkIn: Date;
  checkOut: Date;
}
