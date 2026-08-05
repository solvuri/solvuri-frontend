// # Tenant and Settings interfaces

export interface Tenant {
  id: string;
  name: string;
  domain: string;
  module: "clearrack" | "pos";
  plan: "starter" | "growth" | "enterprise";
  status: "active" | "trial" | "suspended";
  monthlyRevenue: number;
  createdAt: string;
  settings: TenantSettings;
}

export interface TenantSettings {
  whatsappNumber: string;
  themeColor: string;
}
