// apps/pos/lib/api.ts
import { createApiClient } from "@repo/api-client";

export const posApi = createApiClient(process.env.NEXT_PUBLIC_API_URL!);
