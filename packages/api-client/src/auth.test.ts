import { describe, expect, it, vi } from "vitest";
import type { AxiosInstance } from "axios";
import { login, verifyOtp } from "./auth";

function mockClient(responseData: unknown): AxiosInstance {
  return {
    post: vi.fn().mockResolvedValue({ data: responseData }),
  } as unknown as AxiosInstance;
}

describe("login", () => {
  it("posts credentials and returns a direct token for Merchant/Agent accounts", async () => {
    const client = mockClient({ token: "abc.def.ghi" });

    const result = await login(client, "owner@acme.co.ke", "pw");

    expect(client.post).toHaveBeenCalledWith("/api/Auth/login", {
      email: "owner@acme.co.ke",
      password: "pw",
    });
    expect(result).toEqual({ token: "abc.def.ghi" });
  });

  it("returns requiresOtp for Admin/SuperAdmin accounts", async () => {
    const client = mockClient({ requiresOtp: true });

    const result = await login(client, "admin@solvuri.com", "pw");

    expect(result).toEqual({ requiresOtp: true });
  });
});

describe("verifyOtp", () => {
  it("posts the OTP and returns the token", async () => {
    const client = mockClient({ token: "xyz.123.456" });

    const result = await verifyOtp(client, "admin@solvuri.com", "482913");

    expect(client.post).toHaveBeenCalledWith("/api/Auth/login/verify-otp", {
      email: "admin@solvuri.com",
      otp: "482913",
    });
    expect(result).toEqual({ token: "xyz.123.456" });
  });
});
