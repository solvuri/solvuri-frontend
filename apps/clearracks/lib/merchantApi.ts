// apps/clearracks/lib/merchantApi.ts
import { useQuery } from "@tanstack/react-query";
import {
  getMpesaSettings,
  submitMpesaSettings as submitMpesaSettingsRequest,
} from "@repo/api-client";
import type { MerchantMpesaSettings, MpesaSettingsInput } from "@repo/types";
import { clearracksApi } from "./api";

export function useMpesaSettings() {
  return useQuery({
    queryKey: ["merchant-mpesa-settings"],
    queryFn: () => getMpesaSettings(clearracksApi),
    retry: false,
  });
}

export function submitMpesaSettings(
  input: MpesaSettingsInput,
): Promise<MerchantMpesaSettings> {
  return submitMpesaSettingsRequest(clearracksApi, input);
}
