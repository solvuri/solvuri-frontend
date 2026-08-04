import { beforeEach, describe, expect, it } from "vitest";
import { useRegister } from "./store";

beforeEach(() => {
  localStorage.clear();
  useRegister.setState({ cartId: null });
});

describe("useRegister register slice", () => {
  it("starts with no cart in progress", () => {
    expect(useRegister.getState().cartId).toBeNull();
  });

  it("remembers a cart id once set", () => {
    useRegister.getState().setCartId(42);
    expect(useRegister.getState().cartId).toBe(42);
  });

  it("clears the cart id", () => {
    useRegister.getState().setCartId(42);
    useRegister.getState().clearCartId();
    expect(useRegister.getState().cartId).toBeNull();
  });
});
