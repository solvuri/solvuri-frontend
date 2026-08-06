// apps/clearack/lib/merchantApi.ts
import { useQuery } from "@tanstack/react-query";
import {
  deactivateAgent as deactivateAgentRequest,
  getMpesaSettings,
  getOrder,
  listAgents,
  listMerchantOrders,
  reactivateAgent as reactivateAgentRequest,
  registerAgent as registerAgentRequest,
  submitMpesaSettings as submitMpesaSettingsRequest,
  type RegisterAgentInput,
  type RegisterAgentResult,
} from "@repo/api-client";
import type { MerchantMpesaSettings, MpesaSettingsInput } from "@repo/types";
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
