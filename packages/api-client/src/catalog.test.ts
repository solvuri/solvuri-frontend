import { describe, expect, it, vi } from "vitest";
import type { AxiosInstance } from "axios";
import {
  createFeature,
  createSystemCategory,
  deleteFeature,
  deleteSystemCategory,
  updateFeature,
  updateSystemCategory,
} from "./catalog";

function mockClient(responseData: unknown): AxiosInstance {
  return {
    post: vi.fn().mockResolvedValue({ data: responseData }),
    put: vi.fn().mockResolvedValue({ data: responseData }),
    delete: vi.fn().mockResolvedValue({ data: responseData }),
  } as unknown as AxiosInstance;
}

describe("createSystemCategory / updateSystemCategory / deleteSystemCategory", () => {
  it("creates a system category", async () => {
    const category = {
      id: 3,
      name: "Point of Sale",
      description: "POS terminal, cart, payments and receipts.",
    };
    const client = mockClient(category);
    const input = { name: "Point of Sale", description: category.description };

    const result = await createSystemCategory(client, input);

    expect(client.post).toHaveBeenCalledWith("/api/system-categories", input);
    expect(result).toEqual(category);
  });

  it("updates a system category by id", async () => {
    const category = { id: 3, name: "POS", description: "Updated." };
    const client = mockClient(category);
    const input = { name: "POS", description: "Updated." };

    const result = await updateSystemCategory(client, 3, input);

    expect(client.put).toHaveBeenCalledWith(
      "/api/system-categories/3",
      input,
    );
    expect(result).toEqual(category);
  });

  it("deletes a system category by id", async () => {
    const client = mockClient(null);

    await deleteSystemCategory(client, 3);

    expect(client.delete).toHaveBeenCalledWith("/api/system-categories/3");
  });
});

describe("createFeature / updateFeature / deleteFeature", () => {
  it("creates a feature under a category", async () => {
    const feature = {
      id: 12,
      name: "Advanced Reporting",
      description: "Unlocks sales trend reports and CSV export.",
      monthlyPrice: 1500,
      systemCategoryId: 3,
    };
    const client = mockClient(feature);
    const input = {
      name: "Advanced Reporting",
      description: feature.description,
      monthlyPrice: 1500,
      systemCategoryId: 3,
    };

    const result = await createFeature(client, input);

    expect(client.post).toHaveBeenCalledWith("/api/features", input);
    expect(result).toEqual(feature);
  });

  it("updates a feature by id", async () => {
    const feature = {
      id: 12,
      name: "Advanced Reporting",
      description: "Updated.",
      monthlyPrice: 2000,
      systemCategoryId: 3,
    };
    const client = mockClient(feature);
    const input = {
      name: "Advanced Reporting",
      description: "Updated.",
      monthlyPrice: 2000,
      systemCategoryId: 3,
    };

    const result = await updateFeature(client, 12, input);

    expect(client.put).toHaveBeenCalledWith("/api/features/12", input);
    expect(result).toEqual(feature);
  });

  it("deletes a feature by id", async () => {
    const client = mockClient(null);

    await deleteFeature(client, 12);

    expect(client.delete).toHaveBeenCalledWith("/api/features/12");
  });
});
