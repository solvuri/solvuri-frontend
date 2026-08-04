import { beforeEach, describe, expect, it } from "vitest";
import { useRegister } from "./store";

const item = {
  productId: 1,
  name: "Safari Linen Shirt",
  price: 2850,
  image: "img.jpg",
};
const item2 = {
  productId: 2,
  name: "Leather Safari Bag",
  price: 8500,
  image: "img2.jpg",
};

beforeEach(() => {
  localStorage.clear();
  useRegister.setState({ items: [] });
});

describe("useRegister register slice", () => {
  it("adds a new item with quantity 1", () => {
    useRegister.getState().addItem(item);
    expect(useRegister.getState().items).toEqual([{ ...item, quantity: 1 }]);
  });

  it("increments quantity when adding an existing item again", () => {
    useRegister.getState().addItem(item);
    useRegister.getState().addItem(item);
    expect(useRegister.getState().items).toEqual([{ ...item, quantity: 2 }]);
  });

  it("removes an item by productId", () => {
    useRegister.getState().addItem(item);
    useRegister.getState().addItem(item2);
    useRegister.getState().removeItem(item.productId);
    expect(useRegister.getState().items.map((i) => i.productId)).toEqual([
      item2.productId,
    ]);
  });

  it("increments quantity for a specific item", () => {
    useRegister.getState().addItem(item);
    useRegister.getState().incrementQty(item.productId);
    expect(useRegister.getState().items[0]?.quantity).toBe(2);
  });

  it("decrements quantity but never below 1", () => {
    useRegister.getState().addItem(item);
    useRegister.getState().decrementQty(item.productId);
    expect(useRegister.getState().items[0]?.quantity).toBe(1);

    useRegister.getState().decrementQty(item.productId);
    expect(useRegister.getState().items[0]?.quantity).toBe(1);
  });

  it("clears the whole cart", () => {
    useRegister.getState().addItem(item);
    useRegister.getState().addItem(item2);
    useRegister.getState().clearItems();
    expect(useRegister.getState().items).toEqual([]);
  });
});
