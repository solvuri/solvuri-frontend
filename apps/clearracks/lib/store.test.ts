import { beforeEach, describe, expect, it } from "vitest";
import { useStore } from "./store";

const item = { id: "prod-1", name: "Safari Linen Shirt", price: 2850, image: "img.jpg" };
const item2 = { id: "prod-2", name: "Leather Safari Bag", price: 8500, image: "img2.jpg" };

beforeEach(() => {
  localStorage.clear();
  useStore.setState({ cart: [] });
});

describe("useStore cart slice", () => {
  it("adds a new item with quantity 1", () => {
    useStore.getState().addToCart(item);
    expect(useStore.getState().cart).toEqual([{ ...item, quantity: 1 }]);
  });

  it("increments quantity when adding an existing item again", () => {
    useStore.getState().addToCart(item);
    useStore.getState().addToCart(item);
    expect(useStore.getState().cart).toEqual([{ ...item, quantity: 2 }]);
  });

  it("removes an item by id", () => {
    useStore.getState().addToCart(item);
    useStore.getState().addToCart(item2);
    useStore.getState().removeFromCart(item.id);
    expect(useStore.getState().cart.map((i) => i.id)).toEqual([item2.id]);
  });

  it("increments quantity for a specific item", () => {
    useStore.getState().addToCart(item);
    useStore.getState().increment(item.id);
    expect(useStore.getState().cart[0]?.quantity).toBe(2);
  });

  it("decrements quantity but never below 1", () => {
    useStore.getState().addToCart(item);
    useStore.getState().decrement(item.id);
    expect(useStore.getState().cart[0]?.quantity).toBe(1);

    useStore.getState().decrement(item.id);
    expect(useStore.getState().cart[0]?.quantity).toBe(1);
  });
});
