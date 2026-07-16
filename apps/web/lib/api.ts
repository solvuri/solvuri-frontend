// apps/web/lib/api.ts
import { createApiClient } from "@repo/api-client";

export const webApi = createApiClient(process.env.NEXT_PUBLIC_API_URL!);
