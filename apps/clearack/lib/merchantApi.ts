// apps/clearack/lib/merchantApi.ts
import { useQuery } from "@tanstack/react-query";
import {
  adjustProductStock as adjustProductStockRequest,
  createCategory as createCategoryRequest,
  createProduct as createProductRequest,
  deactivateAgent as deactivateAgentRequest,
  deleteProduct as deleteProductRequest,
  getMpesaSettings,
  getOrder,
  listAgents,
  listMerchantInventory,
  listMerchantOrders,
  reactivateAgent as reactivateAgentRequest,
  registerAgent as registerAgentRequest,
  submitMpesaSettings as submitMpesaSettingsRequest,
  updateProduct as updateProductRequest,
  type RegisterAgentInput,
  type RegisterAgentResult,
} from "@repo/api-client";
import type {
  AdjustClearackStockInput,
  ClearackCategory,
  ClearackProduct,
  CreateClearackCategoryInput,
  CreateClearackProductInput,
  MerchantMpesaSettings,
  MpesaSettingsInput,
  UpdateClearackProductInput,
} from "@repo/types";
import { clearackApi } from "./api";
import { getMerchantId } from "./auth";

export function useMpesaSettings() {
  return useQuery({
    queryKey: ["merchant-mpesa-settings"],
    queryFn: () => getMpesaSettings(clearackApi),
    retry: false,
  });
}

export function submitMpesaSettings(
  input: MpesaSettingsInput,
): Promise<MerchantMpesaSettings> {
  return submitMpesaSettingsRequest(clearackApi, input);
}

export function useAgents() {
  return useQuery({
    queryKey: ["merchant-agents"],
    queryFn: () => listAgents(clearackApi),
  });
}

export function registerAgent(
  input: RegisterAgentInput,
): Promise<RegisterAgentResult> {
  return registerAgentRequest(clearackApi, input);
}

export function deactivateAgent(agentId: number): Promise<void> {
  return deactivateAgentRequest(clearackApi, agentId);
}

export function reactivateAgent(agentId: number): Promise<void> {
  return reactivateAgentRequest(clearackApi, agentId);
}

export function useOrders() {
  const merchantId = getMerchantId();
  return useQuery({
    queryKey: ["merchant-orders", merchantId],
    queryFn: () => listMerchantOrders(clearackApi, merchantId as number),
    enabled: merchantId !== null,
  });
}

export function useOrder(orderId: number | null) {
  return useQuery({
    queryKey: ["merchant-order", orderId],
    queryFn: () => getOrder(clearackApi, orderId as number),
    enabled: orderId !== null,
  });
}

export function createProduct(
  input: CreateClearackProductInput,
): Promise<ClearackProduct> {
  const merchantId = getMerchantId();
  return createProductRequest(clearackApi, merchantId as number, input);
}

export function updateProduct(
  productId: number,
  input: UpdateClearackProductInput,
): Promise<ClearackProduct> {
  const merchantId = getMerchantId();
  return updateProductRequest(
    clearackApi,
    productId,
    merchantId as number,
    input,
  );
}

export function deleteProduct(productId: number): Promise<void> {
  const merchantId = getMerchantId();
  return deleteProductRequest(clearackApi, productId, merchantId as number);
}

export function adjustStock(
  productId: number,
  input: AdjustClearackStockInput,
): Promise<ClearackProduct> {
  const merchantId = getMerchantId();
  return adjustProductStockRequest(
    clearackApi,
    productId,
    merchantId as number,
    input,
  );
}

export function useInventory() {
  return useQuery({
    queryKey: ["merchant-inventory"],
    queryFn: () => listMerchantInventory(clearackApi),
  });
}

export function createCategory(
  input: CreateClearackCategoryInput,
): Promise<ClearackCategory> {
  const merchantId = getMerchantId();
  return createCategoryRequest(clearackApi, merchantId as number, input);
}
