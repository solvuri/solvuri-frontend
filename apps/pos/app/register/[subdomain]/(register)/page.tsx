"use client";

import { useCatalogProducts } from "@/lib/posApi";
import { getMerchantId } from "@/lib/auth";
import ProductGrid from "@/components/register/ProductGrid";
import SaleTicket from "@/components/register/SaleTicket";

export default function RegisterPage() {
  const merchantId = getMerchantId();
  const { data: products, isLoading, error } = useCatalogProducts(merchantId);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2">
        <h2 className="text-2xl font-bebas text-text mb-4">Catalog</h2>
        {isLoading && <p className="text-muted text-sm">Loading catalog...</p>}
        {error && (
          <p className="text-sm text-rose-400">Couldn&apos;t load the catalog.</p>
        )}
        {products && <ProductGrid products={products} />}
      </div>

      <div>
        <SaleTicket />
      </div>
    </div>
  );
}
