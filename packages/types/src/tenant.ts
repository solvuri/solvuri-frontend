// # Tenant and Settings interfaces

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
