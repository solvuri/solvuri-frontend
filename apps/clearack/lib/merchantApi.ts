// apps/clearack/lib/merchantApi.ts
import { useQuery } from "@tanstack/react-query";
import {
  deactivateAgent as deactivateAgentRequest,
  getMpesaSettings,
  listAgents,
  reactivateAgent as reactivateAgentRequest,
  registerAgent as registerAgentRequest,
  submitMpesaSettings as submitMpesaSettingsRequest,
  type RegisterAgentInput,
  type RegisterAgentResult,
} from "@repo/api-client";
import type { MerchantMpesaSettings, MpesaSettingsInput } from "@repo/types";
import { clearackApi } from "./api";

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
