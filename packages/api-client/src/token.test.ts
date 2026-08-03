import { describe, expect, it } from "vitest";
import { decodeToken } from "./token";

function makeToken(claims: Record<string, unknown>): string {
  const encode = (obj: unknown) =>
    btoa(JSON.stringify(obj))
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
      .replace(/=+$/, "");
  return `${encode({ alg: "HS256", typ: "JWT" })}.${encode(claims)}.fakesignature`;
}

describe("decodeToken", () => {
  it("decodes short-form claim names", () => {
    const token = makeToken({
      nameidentifier: "42",
      MerchantId: "7",
      name: "jane.admin",
      role: "Admin",
      AppRole: "Admin",
    });

    expect(decodeToken(token)).toEqual({
      userId: "42",
      merchantId: "7",
      username: "jane.admin",
      role: "Admin",
      appRole: "Admin",
    });
  });

  it("decodes ASP.NET's long-form URI claim names", () => {
    const token = makeToken({
      "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier":
        "42",
      "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name": "owner",
      "http://schemas.microsoft.com/ws/2008/06/identity/claims/role":
        "Merchant",
      MerchantId: "7",
      AppRole: "Merchant",
    });

    const result = decodeToken(token);
    expect(result?.userId).toBe("42");
    expect(result?.username).toBe("owner");
    expect(result?.role).toBe("Merchant");
    expect(result?.appRole).toBe("Merchant");
  });

  it("defaults merchantId to '0' when missing (platform admin accounts)", () => {
    const token = makeToken({ nameidentifier: "1", AppRole: "SuperAdmin" });
    expect(decodeToken(token)?.merchantId).toBe("0");
  });

  it("returns null for a malformed token", () => {
    expect(decodeToken("not-a-jwt")).toBeNull();
  });

  it("returns null when required claims (id or AppRole) are missing", () => {
    const token = makeToken({ name: "no-id-or-role" });
    expect(decodeToken(token)).toBeNull();
  });
});
