// apps/pos/lib/api.ts
import { createApiClient, clearAuthToken } from "@repo/api-client";

export const posApi = createApiClient(process.env.NEXT_PUBLIC_API_URL!);

// POS is a long-running cashier shift (unlike a short admin session or
// apps/clearack's anonymous flow), so a token that expires mid-shift should
// bounce the cashier back to /login instead of every subsequent call
// just failing silently. This has to see the raw 401 status, but
// createApiClient's own interceptor (registered first) already replaces
// AxiosError with a plain Error(message) for any enveloped failure —
// discarding `.response.status` before a normally-registered interceptor
// would ever see it. Registering another interceptor and moving it to
// the front of the handler chain is the only way to run before that
// transformation without editing the shared package.
posApi.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error?.response?.status === 401) {
      clearAuthToken();
      if (typeof window !== "undefined") {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  },
);
const responseHandlers = (
  posApi.interceptors.response as unknown as { handlers: unknown[] }
).handlers;
responseHandlers.unshift(responseHandlers.pop());
