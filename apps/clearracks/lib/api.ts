// apps/admin-portal/lib/api.ts
import { createApiClient } from "@repo/api-client";

export const clearracksApi = createApiClient(process.env.NEXT_PUBLIC_API_URL!);
