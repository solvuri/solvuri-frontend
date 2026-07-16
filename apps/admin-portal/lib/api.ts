// apps/admin-portal/lib/api.ts
import { createApiClient } from "@repo/api-client";

export const adminApi = createApiClient(process.env.NEXT_PUBLIC_API_URL!);
