import { describe, expect, it, vi } from "vitest";
import type { AxiosInstance } from "axios";
import {
  deactivateAgent,
  listAgents,
  listFeatures,
  listSystemCategories,
  listTenants,
  reactivateAgent,
  registerAdmin,
  registerAgent,
  registerTenant,
  setMerchantCategories,
  setMerchantFeatures,
} from "./registration";

function mockClient(responseData: unknown): AxiosInstance {
  return {
    get: vi.fn().mockResolvedValue({ data: responseData }),
    post: vi.fn().mockResolvedValue({ data: responseData }),
    put: vi.fn().mockResolvedValue({ data: responseData }),
  } as unknown as AxiosInstance;
}

describe("registerTenant", () => {
  it("posts the merchant details and returns the onboarding result", async () => {
    const result = {
      message: "Tenant registered successfully (Inactive until subscription activation)",
      tenantId: 7,
      subscriptionId: 12,
      userUsername: "owner",
      status: "Inactive",
    };
    const client = mockClient(result);
    const input = {
      firstName: "Kiprono",
      lastName: "Karanja",
      brandName: "Onestop",
      businessDescription: "A test merchant.",
      email: "owner@onestop.co.ke",
      phoneNumber: "254712345678",
      password: "Test@123",
      domainName: "onestop.clearack.com",
    };

    const output = await registerTenant(client, input);

    expect(client.post).toHaveBeenCalledWith(
      "/api/tenants/register-tenant",
      input,
    );
    expect(output).toEqual(result);
  });
});

describe("listTenants", () => {
  it("fetches the merchant directory", async () => {
    const tenants = [
      { id: 7, brandName: "Onestop", domainName: "onestop.clearack.com" },
    ];
    const client = mockClient(tenants);

    const result = await listTenants(client);

    expect(client.get).toHaveBeenCalledWith("/api/tenants");
    expect(result).toEqual(tenants);
  });
});

describe("listSystemCategories / listFeatures", () => {
  it("fetches the shared category catalog", async () => {
    const categories = [{ id: 1, name: "Clearack", description: "..." }];
    const client = mockClient(categories);

    const result = await listSystemCategories(client);

    expect(client.get).toHaveBeenCalledWith("/api/system-categories");
    expect(result).toEqual(categories);
  });

  it("fetches the shared feature catalog", async () => {
    const features = [
      {
        id: 5,
        name: "Online Checkout",
        description: "...",
        monthlyPrice: 500,
        systemCategoryId: 1,
      },
    ];
    const client = mockClient(features);

    const result = await listFeatures(client);

    expect(client.get).toHaveBeenCalledWith("/api/features");
    expect(result).toEqual(features);
  });
});

describe("setMerchantCategories / setMerchantFeatures", () => {
  it("replaces the merchant's category selection", async () => {
    const summary = {
      categories: [{ systemCategoryId: 1, name: "Clearack" }],
      features: [],
      totalMonthlyCost: 0,
    };
    const client = mockClient(summary);

    const result = await setMerchantCategories(client, 7, [1]);

    expect(client.put).toHaveBeenCalledWith(
      "/api/tenants/7/subscription/categories",
      { systemCategoryIds: [1] },
    );
    expect(result).toEqual(summary);
  });

  it("replaces the merchant's feature selection with per-merchant prices", async () => {
    const summary = {
      categories: [{ systemCategoryId: 1, name: "Clearack" }],
      features: [
        {
          featureId: 5,
          featureName: "Online Checkout",
          systemCategoryId: 1,
          systemCategoryName: "Clearack",
          monthlyPrice: 500,
          isPaid: false,
          paidAt: null,
        },
      ],
      totalMonthlyCost: 500,
    };
    const client = mockClient(summary);

    const result = await setMerchantFeatures(client, 7, [
      { featureId: 5, monthlyPrice: 500 },
    ]);

    expect(client.put).toHaveBeenCalledWith(
      "/api/tenants/7/subscription/features",
      { features: [{ featureId: 5, monthlyPrice: 500 }] },
    );
    expect(result).toEqual(summary);
  });
});

describe("registerAgent", () => {
  it("posts the new agent's details", async () => {
    const result = {
      id: 4,
      userId: 57,
      username: "jkamau",
      email: "jkamau@example-shop.co.ke",
      phoneNumber: "254712345678",
      agentCode: "AGT-004",
      isActive: true,
      createdAt: "2026-07-29T09:12:44Z",
    };
    const client = mockClient(result);
    const input = {
      username: "jkamau",
      email: "jkamau@example-shop.co.ke",
      phoneNumber: "254712345678",
      password: "S3cureP@ss",
      agentCode: "AGT-004",
    };

    const output = await registerAgent(client, input);

    expect(client.post).toHaveBeenCalledWith("/api/merchants/agents", input);
    expect(output).toEqual(result);
  });
});

describe("listAgents", () => {
  it("fetches the caller's own agents", async () => {
    const agents = [
      {
        id: 4,
        userId: 57,
        username: "jkamau",
        email: "jkamau@example-shop.co.ke",
        phoneNumber: "254712345678",
        agentCode: "AGT-004",
        isActive: true,
        createdAt: "2026-07-29T09:12:44Z",
      },
    ];
    const client = mockClient(agents);

    const result = await listAgents(client);

    expect(client.get).toHaveBeenCalledWith("/api/merchants/agents");
    expect(result).toEqual(agents);
  });
});

describe("deactivateAgent / reactivateAgent", () => {
  it("deactivates an agent by id", async () => {
    const client = mockClient(null);

    await deactivateAgent(client, 4);

    expect(client.put).toHaveBeenCalledWith(
      "/api/merchants/agents/4/deactivate",
    );
  });

  it("reactivates an agent by id", async () => {
    const client = mockClient(null);

    await reactivateAgent(client, 4);

    expect(client.put).toHaveBeenCalledWith(
      "/api/merchants/agents/4/reactivate",
    );
  });
});

describe("registerAdmin", () => {
  it("posts the new admin account details", async () => {
    const client = mockClient(null);
    const input = {
      username: "jane.admin",
      password: "StrongPassw0rd!",
      email: "jane.admin@solvuri.com",
      phoneNumber: "254712345678",
      isSuperAdmin: false,
    };

    await registerAdmin(client, input);

    expect(client.post).toHaveBeenCalledWith("/api/Auth/register", input);
  });
});
