"use client";

import { Fragment, useState } from "react";
import { getMerchantId } from "@/lib/auth";
import { useMerchantCategories, useMerchantProducts } from "@/lib/clearackApi";
import {
  adjustStock,
  createCategory,
  createProduct,
  deleteProduct,
  updateProduct,
  useInventory,
} from "@/lib/merchantApi";

const EMPTY_PRODUCT_FORM = {
  productName: "",
  description: "",
  price: "",
  costPrice: "",
  stockQuantity: "",
  categoryId: "",
};

export default function ProductsPage() {
  const merchantId = getMerchantId();
  const {
    data: products,
    isLoading,
    refetch: refetchProducts,
  } = useMerchantProducts(merchantId);
  const { data: categories, refetch: refetchCategories } =
    useMerchantCategories(merchantId);
  const { data: inventory } = useInventory();

  const [form, setForm] = useState(EMPTY_PRODUCT_FORM);
  const [formError, setFormError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const [showNewCategory, setShowNewCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [categoryError, setCategoryError] = useState("");
  const [categorySubmitting, setCategorySubmitting] = useState(false);

  const [editId, setEditId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState(EMPTY_PRODUCT_FORM);
  const [editVisible, setEditVisible] = useState(true);
  const [editFeatured, setEditFeatured] = useState(false);
  const [editError, setEditError] = useState("");
  const [editSubmitting, setEditSubmitting] = useState(false);

  const [adjustId, setAdjustId] = useState<number | null>(null);
  const [adjustQuantity, setAdjustQuantity] = useState("");
  const [adjustType, setAdjustType] = useState("");
  const [adjustNotes, setAdjustNotes] = useState("");
  const [adjustError, setAdjustError] = useState("");
  const [adjustSubmitting, setAdjustSubmitting] = useState(false);

  const categoryName = (categoryId?: number) =>
    categories?.find((c) => c.id === categoryId)?.categoryName ?? "—";

  const handleCreateCategory = async () => {
    if (!newCategoryName) return;
    setCategoryError("");
    setCategorySubmitting(true);
    try {
      await createCategory({ categoryName: newCategoryName });
      setNewCategoryName("");
      setShowNewCategory(false);
      await refetchCategories();
    } catch (err) {
      setCategoryError(
        err instanceof Error ? err.message : "Couldn't create that category.",
      );
    } finally {
      setCategorySubmitting(false);
    }
  };

  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.productName || !form.price || !form.categoryId) return;
    setFormError("");
    setSubmitting(true);
    try {
      await createProduct({
        productName: form.productName,
        ...(form.description && { description: form.description }),
        price: Number(form.price),
        ...(form.costPrice && { costPrice: Number(form.costPrice) }),
        stockQuantity: Number(form.stockQuantity) || 0,
        categoryId: Number(form.categoryId),
      });
      setForm(EMPTY_PRODUCT_FORM);
      await refetchProducts();
    } catch (err) {
      setFormError(
        err instanceof Error ? err.message : "Couldn't create this product.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  const startEdit = (product: NonNullable<typeof products>[number]) => {
    setEditId(product.id);
    setEditForm({
      productName: product.productName,
      description: product.description ?? "",
      price: String(product.price),
      costPrice: product.costPrice ? String(product.costPrice) : "",
      stockQuantity: "",
      categoryId: product.categoryId ? String(product.categoryId) : "",
    });
    setEditVisible(product.isVisible);
    setEditFeatured(product.isFeatured ?? false);
    setEditError("");
  };

  const handleSaveEdit = async () => {
    if (editId === null) return;
    setEditError("");
    setEditSubmitting(true);
    try {
      await updateProduct(editId, {
        ...(editForm.productName && { productName: editForm.productName }),
        ...(editForm.description && { description: editForm.description }),
        ...(editForm.price && { price: Number(editForm.price) }),
        ...(editForm.costPrice && { costPrice: Number(editForm.costPrice) }),
        ...(editForm.categoryId && {
          categoryId: Number(editForm.categoryId),
        }),
        isVisible: editVisible,
        isFeatured: editFeatured,
      });
      setEditId(null);
      await refetchProducts();
    } catch (err) {
      setEditError(
        err instanceof Error ? err.message : "Couldn't update this product.",
      );
    } finally {
      setEditSubmitting(false);
    }
  };

  const handleDelete = async (productId: number) => {
    try {
      await deleteProduct(productId);
      await refetchProducts();
    } catch {
      // Surfaced via the row staying in place; no dedicated error state for
      // this one-click action.
    }
  };

  const startAdjust = (productId: number) => {
    setAdjustId(productId);
    setAdjustQuantity("");
    setAdjustType("");
    setAdjustNotes("");
    setAdjustError("");
  };

  const handleAdjust = async () => {
    if (adjustId === null || !adjustQuantity) return;
    setAdjustError("");
    setAdjustSubmitting(true);
    try {
      await adjustStock(adjustId, {
        quantity: Number(adjustQuantity),
        ...(adjustType && { transactionType: adjustType }),
        ...(adjustNotes && { notes: adjustNotes }),
      });
      setAdjustId(null);
      await refetchProducts();
    } catch (err) {
      setAdjustError(
        err instanceof Error ? err.message : "Couldn't adjust stock.",
      );
    } finally {
      setAdjustSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl space-y-6">
      <h2 className="text-xl font-black text-zinc-900 mb-1">Products</h2>
      <p className="text-sm text-zinc-500">
        Manage your storefront catalog — visible products show up on your
        public store, hidden ones don&apos;t.
      </p>

      <div className="bg-white border rounded-2xl p-6">
        <h3 className="font-bold text-sm text-zinc-900 mb-4">
          Your Products
        </h3>
        {isLoading && <p className="text-sm text-zinc-500">Loading...</p>}
        {!isLoading && (!products || products.length === 0) && (
          <p className="text-sm text-zinc-500">
            No products yet — add one below.
          </p>
        )}
        {!isLoading && products && products.length > 0 && (
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-zinc-400 uppercase text-xs tracking-widest border-b">
                <th className="pb-2 font-medium">Name</th>
                <th className="pb-2 font-medium">Category</th>
                <th className="pb-2 font-medium text-right">Price</th>
                <th className="pb-2 font-medium text-right">Stock</th>
                <th className="pb-2 font-medium">Status</th>
                <th className="pb-2 font-medium" />
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <Fragment key={product.id}>
                  <tr className="border-b last:border-0">
                    <td className="py-3 text-zinc-900">
                      {product.productName}
                    </td>
                    <td className="py-3 text-zinc-500">
                      {categoryName(product.categoryId)}
                    </td>
                    <td className="py-3 text-zinc-900 text-right">
                      KES {product.price.toLocaleString()}
                    </td>
                    <td className="py-3 text-zinc-500 text-right">
                      {product.stockQuantity}
                    </td>
                    <td className="py-3 text-zinc-500">
                      {product.isVisible ? "Visible" : "Hidden"}
                      {product.isFeatured ? " · Featured" : ""}
                    </td>
                    <td className="py-3 text-right space-x-3 whitespace-nowrap">
                      <button
                        type="button"
                        onClick={() => startEdit(product)}
                        className="text-blue-700 text-xs font-bold underline"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => startAdjust(product.id)}
                        className="text-blue-700 text-xs font-bold underline"
                      >
                        Adjust Stock
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(product.id)}
                        className="text-red-600 text-xs font-bold underline"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>

                  {editId === product.id && (
                    <tr key={`${product.id}-edit`} className="border-b">
                      <td colSpan={6} className="py-4 bg-zinc-50">
                        <div className="grid grid-cols-2 gap-3 max-w-2xl">
                          <input
                            type="text"
                            value={editForm.productName}
                            onChange={(e) =>
                              setEditForm({
                                ...editForm,
                                productName: e.target.value,
                              })
                            }
                            placeholder="Name"
                            className="border rounded-lg p-2 text-sm bg-white"
                          />
                          <select
                            value={editForm.categoryId}
                            onChange={(e) =>
                              setEditForm({
                                ...editForm,
                                categoryId: e.target.value,
                              })
                            }
                            className="border rounded-lg p-2 text-sm bg-white"
                          >
                            <option value="">Category...</option>
                            {(categories ?? []).map((c) => (
                              <option key={c.id} value={c.id}>
                                {c.categoryName}
                              </option>
                            ))}
                          </select>
                          <input
                            type="number"
                            value={editForm.price}
                            onChange={(e) =>
                              setEditForm({
                                ...editForm,
                                price: e.target.value,
                              })
                            }
                            placeholder="Price"
                            className="border rounded-lg p-2 text-sm bg-white"
                          />
                          <input
                            type="number"
                            value={editForm.costPrice}
                            onChange={(e) =>
                              setEditForm({
                                ...editForm,
                                costPrice: e.target.value,
                              })
                            }
                            placeholder="Cost Price"
                            className="border rounded-lg p-2 text-sm bg-white"
                          />
                          <input
                            type="text"
                            value={editForm.description}
                            onChange={(e) =>
                              setEditForm({
                                ...editForm,
                                description: e.target.value,
                              })
                            }
                            placeholder="Description"
                            className="border rounded-lg p-2 text-sm bg-white col-span-2"
                          />
                          <label className="flex items-center gap-2 text-sm text-zinc-700">
                            <input
                              type="checkbox"
                              checked={editVisible}
                              onChange={(e) =>
                                setEditVisible(e.target.checked)
                              }
                            />
                            Visible on storefront
                          </label>
                          <label className="flex items-center gap-2 text-sm text-zinc-700">
                            <input
                              type="checkbox"
                              checked={editFeatured}
                              onChange={(e) =>
                                setEditFeatured(e.target.checked)
                              }
                            />
                            Featured
                          </label>
                        </div>
                        {editError && (
                          <p className="text-sm text-red-600 mt-2">
                            {editError}
                          </p>
                        )}
                        <div className="flex gap-2 mt-3">
                          <button
                            type="button"
                            onClick={() => setEditId(null)}
                            className="px-4 py-2 rounded-lg text-sm font-bold bg-zinc-100 text-zinc-700"
                          >
                            Cancel
                          </button>
                          <button
                            type="button"
                            disabled={editSubmitting}
                            onClick={handleSaveEdit}
                            className="px-4 py-2 rounded-lg text-sm font-bold bg-blue-700 text-white disabled:opacity-50"
                          >
                            {editSubmitting ? "Saving..." : "Save"}
                          </button>
                        </div>
                      </td>
                    </tr>
                  )}

                  {adjustId === product.id && (
                    <tr key={`${product.id}-adjust`} className="border-b">
                      <td colSpan={6} className="py-4 bg-zinc-50">
                        <div className="flex gap-2 items-center max-w-2xl">
                          <input
                            type="number"
                            value={adjustQuantity}
                            onChange={(e) => setAdjustQuantity(e.target.value)}
                            placeholder="Quantity (negative to remove)"
                            className="border rounded-lg p-2 text-sm bg-white w-56"
                          />
                          <input
                            type="text"
                            value={adjustType}
                            onChange={(e) => setAdjustType(e.target.value)}
                            placeholder="Reason (e.g. Damaged)"
                            className="border rounded-lg p-2 text-sm bg-white flex-1"
                          />
                          <input
                            type="text"
                            value={adjustNotes}
                            onChange={(e) => setAdjustNotes(e.target.value)}
                            placeholder="Notes (optional)"
                            className="border rounded-lg p-2 text-sm bg-white flex-1"
                          />
                        </div>
                        {adjustError && (
                          <p className="text-sm text-red-600 mt-2">
                            {adjustError}
                          </p>
                        )}
                        <div className="flex gap-2 mt-3">
                          <button
                            type="button"
                            onClick={() => setAdjustId(null)}
                            className="px-4 py-2 rounded-lg text-sm font-bold bg-zinc-100 text-zinc-700"
                          >
                            Cancel
                          </button>
                          <button
                            type="button"
                            disabled={adjustSubmitting || !adjustQuantity}
                            onClick={handleAdjust}
                            className="px-4 py-2 rounded-lg text-sm font-bold bg-blue-700 text-white disabled:opacity-50"
                          >
                            {adjustSubmitting ? "Saving..." : "Apply"}
                          </button>
                        </div>
                      </td>
                    </tr>
                  )}
                </Fragment>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <form
        onSubmit={handleCreateProduct}
        className="bg-white border rounded-2xl p-6 space-y-3"
      >
        <h3 className="font-bold text-sm text-zinc-900 mb-2">Add Product</h3>
        <input
          type="text"
          value={form.productName}
          onChange={(e) => setForm({ ...form, productName: e.target.value })}
          placeholder="Name"
          className="w-full border rounded-lg p-3 text-sm bg-zinc-50"
        />
        <input
          type="text"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          placeholder="Description (optional)"
          className="w-full border rounded-lg p-3 text-sm bg-zinc-50"
        />
        <div className="grid grid-cols-2 gap-3">
          <input
            type="number"
            value={form.price}
            onChange={(e) => setForm({ ...form, price: e.target.value })}
            placeholder="Price"
            className="border rounded-lg p-3 text-sm bg-zinc-50"
          />
          <input
            type="number"
            value={form.costPrice}
            onChange={(e) => setForm({ ...form, costPrice: e.target.value })}
            placeholder="Cost Price (optional)"
            className="border rounded-lg p-3 text-sm bg-zinc-50"
          />
          <input
            type="number"
            value={form.stockQuantity}
            onChange={(e) =>
              setForm({ ...form, stockQuantity: e.target.value })
            }
            placeholder="Starting Stock"
            className="border rounded-lg p-3 text-sm bg-zinc-50"
          />
          <select
            value={form.categoryId}
            onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
            className="border rounded-lg p-3 text-sm bg-zinc-50"
          >
            <option value="">Category...</option>
            {(categories ?? []).map((c) => (
              <option key={c.id} value={c.id}>
                {c.categoryName}
              </option>
            ))}
          </select>
        </div>

        {!showNewCategory ? (
          <button
            type="button"
            onClick={() => setShowNewCategory(true)}
            className="text-blue-700 text-xs font-bold underline"
          >
            + New Category
          </button>
        ) : (
          <div className="flex gap-2 items-center">
            <input
              type="text"
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              placeholder="Category name"
              className="border rounded-lg p-2 text-sm bg-zinc-50 flex-1"
            />
            <button
              type="button"
              disabled={categorySubmitting || !newCategoryName}
              onClick={handleCreateCategory}
              className="px-3 py-2 rounded-lg text-xs font-bold bg-zinc-100 text-zinc-700 disabled:opacity-50"
            >
              {categorySubmitting ? "Adding..." : "Add"}
            </button>
          </div>
        )}
        {categoryError && (
          <p className="text-sm text-red-600">{categoryError}</p>
        )}

        {formError && <p className="text-sm text-red-600">{formError}</p>}

        <button
          type="submit"
          disabled={
            submitting || !form.productName || !form.price || !form.categoryId
          }
          className="w-full bg-blue-700 text-white py-3 rounded-lg font-bold cursor-pointer hover:bg-blue-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {submitting ? "Adding..." : "Add Product"}
        </button>
      </form>

      <div className="bg-white border rounded-2xl p-6">
        <h3 className="font-bold text-sm text-zinc-900 mb-4">
          Inventory Overview
        </h3>
        <p className="text-xs text-zinc-500 mb-4">
          Includes hidden products, with cost price, units sold, and revenue
          — not shown on the public storefront.
        </p>
        {!inventory || inventory.length === 0 ? (
          <p className="text-sm text-zinc-500">No inventory data yet.</p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-zinc-400 uppercase text-xs tracking-widest border-b">
                <th className="pb-2 font-medium">Name</th>
                <th className="pb-2 font-medium text-right">Cost Price</th>
                <th className="pb-2 font-medium text-right">Units Sold</th>
                <th className="pb-2 font-medium text-right">Revenue</th>
              </tr>
            </thead>
            <tbody>
              {inventory.map((item) => (
                <tr key={item.id} className="border-b last:border-0">
                  <td className="py-2 text-zinc-900">{item.productName}</td>
                  <td className="py-2 text-zinc-500 text-right">
                    {item.costPrice ? `KES ${item.costPrice.toLocaleString()}` : "—"}
                  </td>
                  <td className="py-2 text-zinc-500 text-right">
                    {item.unitsSold}
                  </td>
                  <td className="py-2 text-zinc-900 text-right">
                    KES {item.revenue.toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
