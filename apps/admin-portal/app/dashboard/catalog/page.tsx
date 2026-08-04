"use client";

import { useEffect, useState } from "react";
import {
  createFeature,
  createSystemCategory,
  deleteFeature,
  deleteSystemCategory,
  listFeatures,
  listSystemCategories,
  updateFeature,
  updateSystemCategory,
  type Feature,
  type SystemCategory,
} from "@repo/api-client";
import { Button, Input } from "@repo/ui";
import { adminApi } from "../../../lib/api";

const EMPTY_CATEGORY = { name: "", description: "" };
const EMPTY_FEATURE = {
  name: "",
  description: "",
  monthlyPrice: "",
  systemCategoryId: "",
};

export default function CatalogPage() {
  const [categories, setCategories] = useState<SystemCategory[] | null>(null);
  const [features, setFeatures] = useState<Feature[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const [newCategory, setNewCategory] = useState(EMPTY_CATEGORY);
  const [editingCategoryId, setEditingCategoryId] = useState<number | null>(
    null,
  );
  const [editCategory, setEditCategory] = useState(EMPTY_CATEGORY);
  const [categoryError, setCategoryError] = useState("");
  const [categorySubmitting, setCategorySubmitting] = useState(false);

  const [newFeature, setNewFeature] = useState(EMPTY_FEATURE);
  const [editingFeatureId, setEditingFeatureId] = useState<number | null>(
    null,
  );
  const [editFeature, setEditFeature] = useState(EMPTY_FEATURE);
  const [featureError, setFeatureError] = useState("");
  const [featureSubmitting, setFeatureSubmitting] = useState(false);

  const loadCatalog = async () => {
    const [categoriesResult, featuresResult] = await Promise.allSettled([
      listSystemCategories(adminApi),
      listFeatures(adminApi),
    ]);
    if (categoriesResult.status === "fulfilled") {
      setCategories(categoriesResult.value);
    }
    if (featuresResult.status === "fulfilled") {
      setFeatures(featuresResult.value);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    loadCatalog();
  }, []);

  const handleCreateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    setCategoryError("");
    setCategorySubmitting(true);
    try {
      await createSystemCategory(adminApi, newCategory);
      setNewCategory(EMPTY_CATEGORY);
      await loadCatalog();
    } catch (err) {
      setCategoryError(
        err instanceof Error ? err.message : "Couldn't create category.",
      );
    } finally {
      setCategorySubmitting(false);
    }
  };

  const startEditCategory = (category: SystemCategory) => {
    setEditingCategoryId(category.id);
    setEditCategory({ name: category.name, description: category.description });
    setCategoryError("");
  };

  const handleUpdateCategory = async (id: number) => {
    setCategoryError("");
    setCategorySubmitting(true);
    try {
      await updateSystemCategory(adminApi, id, editCategory);
      setEditingCategoryId(null);
      await loadCatalog();
    } catch (err) {
      setCategoryError(
        err instanceof Error ? err.message : "Couldn't update category.",
      );
    } finally {
      setCategorySubmitting(false);
    }
  };

  const handleDeleteCategory = async (id: number) => {
    setCategoryError("");
    setCategorySubmitting(true);
    try {
      await deleteSystemCategory(adminApi, id);
      await loadCatalog();
    } catch (err) {
      setCategoryError(
        err instanceof Error ? err.message : "Couldn't delete category.",
      );
    } finally {
      setCategorySubmitting(false);
    }
  };

  const handleCreateFeature = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFeature.systemCategoryId) {
      setFeatureError("Select a category.");
      return;
    }
    setFeatureError("");
    setFeatureSubmitting(true);
    try {
      await createFeature(adminApi, {
        name: newFeature.name,
        description: newFeature.description,
        monthlyPrice: Number(newFeature.monthlyPrice) || 0,
        systemCategoryId: Number(newFeature.systemCategoryId),
      });
      setNewFeature(EMPTY_FEATURE);
      await loadCatalog();
    } catch (err) {
      setFeatureError(
        err instanceof Error ? err.message : "Couldn't create feature.",
      );
    } finally {
      setFeatureSubmitting(false);
    }
  };

  const startEditFeature = (feature: Feature) => {
    setEditingFeatureId(feature.id);
    setEditFeature({
      name: feature.name,
      description: feature.description,
      monthlyPrice: String(feature.monthlyPrice),
      systemCategoryId: String(feature.systemCategoryId),
    });
    setFeatureError("");
  };

  const handleUpdateFeature = async (id: number) => {
    setFeatureError("");
    setFeatureSubmitting(true);
    try {
      await updateFeature(adminApi, id, {
        name: editFeature.name,
        description: editFeature.description,
        monthlyPrice: Number(editFeature.monthlyPrice) || 0,
        systemCategoryId: Number(editFeature.systemCategoryId),
      });
      setEditingFeatureId(null);
      await loadCatalog();
    } catch (err) {
      setFeatureError(
        err instanceof Error ? err.message : "Couldn't update feature.",
      );
    } finally {
      setFeatureSubmitting(false);
    }
  };

  const handleDeleteFeature = async (id: number) => {
    setFeatureError("");
    setFeatureSubmitting(true);
    try {
      await deleteFeature(adminApi, id);
      await loadCatalog();
    } catch (err) {
      setFeatureError(
        err instanceof Error ? err.message : "Couldn't delete feature.",
      );
    } finally {
      setFeatureSubmitting(false);
    }
  };

  const categoryName = (id: number) =>
    categories?.find((c) => c.id === id)?.name ?? `#${id}`;

  return (
    <div className="p-8 space-y-8">
      <h1 className="text-4xl font-bebas text-text">System Catalog</h1>
      <p className="text-muted text-sm -mt-4">
        The shared category/feature catalog every merchant picks from during
        onboarding. Per-merchant pricing is set separately on the Merchants
        page — the price here is only the catalog default/reference value.
      </p>

      {/* System Categories */}
      <section className="bg-surface rounded-2xl border border-primary/10 p-8">
        <h2 className="text-xl font-bebas text-text tracking-wide mb-6">
          System Categories
        </h2>

        {isLoading ? (
          <p className="text-muted text-sm">Loading...</p>
        ) : (
          <table className="w-full text-sm mb-6">
            <thead>
              <tr className="text-left text-muted uppercase text-xs tracking-widest border-b border-input-bg">
                <th className="pb-3 font-medium">Name</th>
                <th className="pb-3 font-medium">Description</th>
                <th className="pb-3 font-medium" />
              </tr>
            </thead>
            <tbody>
              {(categories ?? []).map((category) =>
                editingCategoryId === category.id ? (
                  <tr key={category.id} className="border-b border-input-bg">
                    <td className="py-3">
                      <input
                        className="bg-inputBg text-text rounded px-2 py-1 w-full"
                        value={editCategory.name}
                        onChange={(e) =>
                          setEditCategory({
                            ...editCategory,
                            name: e.target.value,
                          })
                        }
                      />
                    </td>
                    <td className="py-3">
                      <input
                        className="bg-inputBg text-text rounded px-2 py-1 w-full"
                        value={editCategory.description}
                        onChange={(e) =>
                          setEditCategory({
                            ...editCategory,
                            description: e.target.value,
                          })
                        }
                      />
                    </td>
                    <td className="py-3 text-right whitespace-nowrap">
                      <button
                        type="button"
                        disabled={categorySubmitting}
                        onClick={() => handleUpdateCategory(category.id)}
                        className="text-accent text-xs font-bold mr-3"
                      >
                        Save
                      </button>
                      <button
                        type="button"
                        onClick={() => setEditingCategoryId(null)}
                        className="text-muted text-xs font-bold"
                      >
                        Cancel
                      </button>
                    </td>
                  </tr>
                ) : (
                  <tr
                    key={category.id}
                    className="border-b border-input-bg last:border-0"
                  >
                    <td className="py-3 text-text">{category.name}</td>
                    <td className="py-3 text-muted">{category.description}</td>
                    <td className="py-3 text-right whitespace-nowrap">
                      <button
                        type="button"
                        onClick={() => startEditCategory(category)}
                        className="text-accent text-xs font-bold mr-3"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        disabled={categorySubmitting}
                        onClick={() => handleDeleteCategory(category.id)}
                        className="text-rose-400 text-xs font-bold"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ),
              )}
              {categories && categories.length === 0 && (
                <tr>
                  <td colSpan={3} className="py-3 text-muted text-sm">
                    No categories yet — add one below.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}

        <form
          onSubmit={handleCreateCategory}
          className="flex items-end gap-3 flex-wrap"
        >
          <Input
            label="Name"
            value={newCategory.name}
            onChange={(e) =>
              setNewCategory({ ...newCategory, name: e.target.value })
            }
          />
          <Input
            label="Description"
            value={newCategory.description}
            onChange={(e) =>
              setNewCategory({ ...newCategory, description: e.target.value })
            }
          />
          <Button type="submit" variant="accent" disabled={categorySubmitting}>
            Add Category
          </Button>
        </form>
        {categoryError && (
          <p className="text-sm text-rose-400 mt-3">{categoryError}</p>
        )}
      </section>

      {/* Features */}
      <section className="bg-surface rounded-2xl border border-primary/10 p-8">
        <h2 className="text-xl font-bebas text-text tracking-wide mb-6">
          Features
        </h2>

        {isLoading ? (
          <p className="text-muted text-sm">Loading...</p>
        ) : (
          <table className="w-full text-sm mb-6">
            <thead>
              <tr className="text-left text-muted uppercase text-xs tracking-widest border-b border-input-bg">
                <th className="pb-3 font-medium">Name</th>
                <th className="pb-3 font-medium">Category</th>
                <th className="pb-3 font-medium">Default Price</th>
                <th className="pb-3 font-medium" />
              </tr>
            </thead>
            <tbody>
              {(features ?? []).map((feature) =>
                editingFeatureId === feature.id ? (
                  <tr key={feature.id} className="border-b border-input-bg">
                    <td className="py-3">
                      <input
                        className="bg-inputBg text-text rounded px-2 py-1 w-full"
                        value={editFeature.name}
                        onChange={(e) =>
                          setEditFeature({
                            ...editFeature,
                            name: e.target.value,
                          })
                        }
                      />
                    </td>
                    <td className="py-3">
                      <select
                        className="bg-inputBg text-text rounded px-2 py-1"
                        value={editFeature.systemCategoryId}
                        onChange={(e) =>
                          setEditFeature({
                            ...editFeature,
                            systemCategoryId: e.target.value,
                          })
                        }
                      >
                        {(categories ?? []).map((c) => (
                          <option key={c.id} value={c.id}>
                            {c.name}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="py-3">
                      <input
                        type="number"
                        className="bg-inputBg text-text rounded px-2 py-1 w-24"
                        value={editFeature.monthlyPrice}
                        onChange={(e) =>
                          setEditFeature({
                            ...editFeature,
                            monthlyPrice: e.target.value,
                          })
                        }
                      />
                    </td>
                    <td className="py-3 text-right whitespace-nowrap">
                      <button
                        type="button"
                        disabled={featureSubmitting}
                        onClick={() => handleUpdateFeature(feature.id)}
                        className="text-accent text-xs font-bold mr-3"
                      >
                        Save
                      </button>
                      <button
                        type="button"
                        onClick={() => setEditingFeatureId(null)}
                        className="text-muted text-xs font-bold"
                      >
                        Cancel
                      </button>
                    </td>
                  </tr>
                ) : (
                  <tr
                    key={feature.id}
                    className="border-b border-input-bg last:border-0"
                  >
                    <td className="py-3 text-text">{feature.name}</td>
                    <td className="py-3 text-muted">
                      {categoryName(feature.systemCategoryId)}
                    </td>
                    <td className="py-3 text-muted">
                      KES {feature.monthlyPrice.toLocaleString()}
                    </td>
                    <td className="py-3 text-right whitespace-nowrap">
                      <button
                        type="button"
                        onClick={() => startEditFeature(feature)}
                        className="text-accent text-xs font-bold mr-3"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        disabled={featureSubmitting}
                        onClick={() => handleDeleteFeature(feature.id)}
                        className="text-rose-400 text-xs font-bold"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ),
              )}
              {features && features.length === 0 && (
                <tr>
                  <td colSpan={4} className="py-3 text-muted text-sm">
                    No features yet — add one below.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}

        <form
          onSubmit={handleCreateFeature}
          className="flex items-end gap-3 flex-wrap"
        >
          <Input
            label="Name"
            value={newFeature.name}
            onChange={(e) =>
              setNewFeature({ ...newFeature, name: e.target.value })
            }
          />
          <Input
            label="Description"
            value={newFeature.description}
            onChange={(e) =>
              setNewFeature({ ...newFeature, description: e.target.value })
            }
          />
          <div>
            <label className="block text-xs text-muted mb-1">Category</label>
            <select
              className="bg-inputBg text-text rounded px-3 py-2"
              value={newFeature.systemCategoryId}
              onChange={(e) =>
                setNewFeature({
                  ...newFeature,
                  systemCategoryId: e.target.value,
                })
              }
            >
              <option value="">Select...</option>
              {(categories ?? []).map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
          <Input
            label="Default Price (KES)"
            type="number"
            value={newFeature.monthlyPrice}
            onChange={(e) =>
              setNewFeature({ ...newFeature, monthlyPrice: e.target.value })
            }
          />
          <Button type="submit" variant="accent" disabled={featureSubmitting}>
            Add Feature
          </Button>
        </form>
        {featureError && (
          <p className="text-sm text-rose-400 mt-3">{featureError}</p>
        )}
      </section>
    </div>
  );
}
