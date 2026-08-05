// apps/clearack/lib/api.ts
import { createApiClient, clearAuthToken, getAuthToken } from "@repo/api-client";

export const clearackApi = createApiClient(process.env.NEXT_PUBLIC_API_URL!);

// The storefront itself is anonymous and never hits a 401, but the
// merchant portal (app/merchant/**) shares this same client instance and
// can have a session expire mid-use — bounce back to /merchant/login
// instead of every subsequent call just failing silently. Only redirect
// when a merchant token actually exists (i.e. we're in the merchant
// portal, not an anonymous storefront visitor) and when already on a
// /merchant path — the storefront is subdomain-scoped, so a bare
// "/merchant/login" redirect from a storefront page would resolve to a
// nonexistent route under that subdomain instead of the real login page.
//
// This has to see the raw 401 status, but createApiClient's own
// interceptor (registered first) already replaces AxiosError with a
// plain Error(message) for any enveloped failure — discarding
// `.response.status` before a normally-registered interceptor would
// ever see it. Registering another interceptor and moving it to the
// front of the handler chain is the only way to run before that
// transformation without editing the shared package (same approach as
// apps/pos/lib/api.ts).
clearackApi.interceptors.response.use(
  (response) => response,
  (error) => {
    if (
      error?.response?.status === 401 &&
      typeof window !== "undefined" &&
      getAuthToken() &&
      window.location.pathname.startsWith("/merchant")
    ) {
      clearAuthToken();
      window.location.href = "/merchant/login";
    }
    return Promise.reject(error);
  },
);
const responseHandlers = (
  clearackApi.interceptors.response as unknown as { handlers: unknown[] }
).handlers;
responseHandlers.unshift(responseHandlers.pop());
