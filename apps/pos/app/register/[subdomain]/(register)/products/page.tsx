"use client";

import { Fragment, useState } from "react";
import { getMerchantId } from "@/lib/auth";
import {
  createPosCategory,
  createPosProduct,
  deletePosProduct,
  updatePosProduct,
  useCatalogProducts,
  useCategories,
} from "@/lib/posApi";

const FIELD_CLASS =
  "w-full bg-inputBg border border-primary/10 rounded-lg p-2 text-sm text-text";

const EMPTY_FORM = {
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
  } = useCatalogProducts(merchantId);
  const { data: categories, refetch: refetchCategories } =
    useCategories(merchantId);

  const [form, setForm] = useState(EMPTY_FORM);
  const [formError, setFormError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const [showNewCategory, setShowNewCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [categoryError, setCategoryError] = useState("");
  const [categorySubmitting, setCategorySubmitting] = useState(false);

  const [editId, setEditId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState(EMPTY_FORM);
  const [editVisible, setEditVisible] = useState(true);
  const [editError, setEditError] = useState("");
  const [editSubmitting, setEditSubmitting] = useState(false);

  const categoryName = (categoryId?: number) =>
    categories?.find((c) => c.id === categoryId)?.categoryName ?? "—";

  const handleCreateCategory = async () => {
    if (!merchantId || !newCategoryName) return;
    setCategoryError("");
    setCategorySubmitting(true);
    try {
      await createPosCategory(merchantId, { categoryName: newCategoryName });
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
    if (!merchantId || !form.productName || !form.price || !form.categoryId)
      return;
    setFormError("");
    setSubmitting(true);
    try {
      await createPosProduct(merchantId, {
        productName: form.productName,
        ...(form.description && { description: form.description }),
        price: Number(form.price),
        ...(form.costPrice && { costPrice: Number(form.costPrice) }),
        stockQuantity: Number(form.stockQuantity) || 0,
        categoryId: Number(form.categoryId),
      });
      setForm(EMPTY_FORM);
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
    setEditError("");
  };

  const handleSaveEdit = async () => {
    if (!merchantId || editId === null) return;
    setEditError("");
    setEditSubmitting(true);
    try {
      await updatePosProduct(merchantId, editId, {
        ...(editForm.productName && { productName: editForm.productName }),
        ...(editForm.description && { description: editForm.description }),
        ...(editForm.price && { price: Number(editForm.price) }),
        ...(editForm.costPrice && { costPrice: Number(editForm.costPrice) }),
        ...(editForm.categoryId && {
          categoryId: Number(editForm.categoryId),
        }),
        isVisible: editVisible,
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
    if (!merchantId) return;
    try {
      await deletePosProduct(merchantId, productId);
      await refetchProducts();
    } catch {
      // Surfaced via the row staying in place; no dedicated error state for
      // this one-click action, matching apps/clearack's equivalent page.
    }
  };

  return (
    <div className="max-w-4xl space-y-6">
      <h2 className="text-2xl font-bebas text-text">Products</h2>
      <p className="text-sm text-muted">
        Manage the products sold from this register — the same catalog your
        storefront (if you have one) draws from.
      </p>

      <div className="bg-surface rounded-2xl border border-primary/10 p-6">
        <h3 className="text-sm font-bold text-text mb-4">All Products</h3>
        {isLoading && <p className="text-muted text-sm">Loading...</p>}
        {!isLoading && (!products || products.length === 0) && (
          <p className="text-muted text-sm">
            No products yet — add one below.
          </p>
        )}
        {!isLoading && products && products.length > 0 && (
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-muted uppercase text-xs tracking-widest border-b border-input-bg">
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
                  <tr className="border-b border-input-bg last:border-0">
                    <td className="py-3 text-text">{product.productName}</td>
                    <td className="py-3 text-muted">
                      {categoryName(product.categoryId)}
                    </td>
                    <td className="py-3 text-text text-right">
                      KES {product.price.toLocaleString()}
                    </td>
                    <td className="py-3 text-muted text-right">
                      {product.stockQuantity}
                    </td>
                    <td className="py-3 text-muted">
                      {product.isVisible ? "Visible" : "Hidden"}
                    </td>
                    <td className="py-3 text-right space-x-3 whitespace-nowrap">
                      <button
                        type="button"
                        onClick={() => startEdit(product)}
                        className="text-primary text-xs font-bold underline"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(product.id)}
                        className="text-rose-400 text-xs font-bold underline"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>

                  {editId === product.id && (
                    <tr className="border-b border-input-bg">
                      <td colSpan={6} className="py-4">
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
                            className={FIELD_CLASS}
                          />
                          <select
                            value={editForm.categoryId}
                            onChange={(e) =>
                              setEditForm({
                                ...editForm,
                                categoryId: e.target.value,
                              })
                            }
                            className={FIELD_CLASS}
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
                            className={FIELD_CLASS}
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
                            className={FIELD_CLASS}
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
                            className={`${FIELD_CLASS} col-span-2`}
                          />
                          <label className="flex items-center gap-2 text-sm text-muted">
                            <input
                              type="checkbox"
                              checked={editVisible}
                              onChange={(e) => setEditVisible(e.target.checked)}
                            />
                            Visible on storefront
                          </label>
                        </div>
                        {editError && (
                          <p className="text-sm text-rose-400 mt-2">
                            {editError}
                          </p>
                        )}
                        <div className="flex gap-2 mt-3">
                          <button
                            type="button"
                            onClick={() => setEditId(null)}
                            className="px-4 py-2 rounded-lg text-sm font-medium bg-inputBg text-muted"
                          >
                            Cancel
                          </button>
                          <button
                            type="button"
                            disabled={editSubmitting}
                            onClick={handleSaveEdit}
                            className="px-4 py-2 rounded-lg text-sm font-medium bg-primary text-white disabled:opacity-50"
                          >
                            {editSubmitting ? "Saving..." : "Save"}
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
        className="bg-surface rounded-2xl border border-primary/10 p-6 space-y-3"
      >
        <h3 className="text-sm font-bold text-text mb-2">Add Product</h3>
        <input
          type="text"
          value={form.productName}
          onChange={(e) => setForm({ ...form, productName: e.target.value })}
          placeholder="Name"
          className={FIELD_CLASS}
        />
        <input
          type="text"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          placeholder="Description (optional)"
          className={FIELD_CLASS}
        />
        <div className="grid grid-cols-2 gap-3">
          <input
            type="number"
            value={form.price}
            onChange={(e) => setForm({ ...form, price: e.target.value })}
            placeholder="Price"
            className={FIELD_CLASS}
          />
          <input
            type="number"
            value={form.costPrice}
            onChange={(e) => setForm({ ...form, costPrice: e.target.value })}
            placeholder="Cost Price (optional)"
            className={FIELD_CLASS}
          />
          <input
            type="number"
            value={form.stockQuantity}
            onChange={(e) =>
              setForm({ ...form, stockQuantity: e.target.value })
            }
            placeholder="Starting Stock"
            className={FIELD_CLASS}
          />
          <select
            value={form.categoryId}
            onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
            className={FIELD_CLASS}
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
            className="text-primary text-xs font-bold underline"
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
              className={`${FIELD_CLASS} flex-1`}
            />
            <button
              type="button"
              disabled={categorySubmitting || !newCategoryName}
              onClick={handleCreateCategory}
              className="px-3 py-2 rounded-lg text-xs font-medium bg-inputBg text-text disabled:opacity-50"
            >
              {categorySubmitting ? "Adding..." : "Add"}
            </button>
          </div>
        )}
        {categoryError && (
          <p className="text-sm text-rose-400">{categoryError}</p>
        )}

        {formError && <p className="text-sm text-rose-400">{formError}</p>}

        <button
          type="submit"
          disabled={
            submitting || !form.productName || !form.price || !form.categoryId
          }
          className="w-full bg-primary text-white py-3 rounded-lg font-medium disabled:opacity-50"
        >
          {submitting ? "Adding..." : "Add Product"}
        </button>
      </form>
    </div>
  );
}
