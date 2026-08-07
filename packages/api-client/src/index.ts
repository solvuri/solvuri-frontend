// packages/api-client/src/index.ts
import axios from "axios";
import { getAuthToken } from "./token";

export const createApiClient = (baseURL: string) => {
  const client = axios.create({
    baseURL,
    headers: { "Content-Type": "application/json" },
  });

  client.interceptors.request.use((config) => {
    const token = getAuthToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  client.interceptors.response.use(
    (response) => {
      // Every endpoint wraps its payload in { success, message, data } —
      // unwrap it here so callers work with the real payload directly
      // instead of reaching into `.data.data` everywhere.
      if (
        response.data &&
        typeof response.data === "object" &&
        "success" in response.data
      ) {
        response.data = response.data.data;
      }
      return response;
    },
    (error) => {
      // Business/validation failures still return the envelope shape
      // alongside a non-2xx status — surface its `message` as a plain
      // Error so callers can just do `catch (err) { setError(err.message) }`.
      const envelope = error?.response?.data;
      if (envelope && typeof envelope === "object" && "message" in envelope) {
        return Promise.reject(new Error(envelope.message));
      }
      return Promise.reject(error);
    },
  );

  return client;
};

export * from "./types";
export * from "./token";
export * from "./auth";
export * from "./registration";
export * from "./mpesaSettings";
export * from "./payments";
export * from "./catalog";
export * from "./orders";
export * from "./products";
