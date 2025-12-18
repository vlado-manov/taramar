"use client";

import { useEffect, useMemo, useState } from "react";
import { Plus, Edit2, Trash2, X } from "lucide-react";
import styles from "./AdminProductsPage.module.css";

type Product = {
  _id?: string;

  pid: string;

  // Ordering
  position?: number;

  // Core
  name: string;
  nameFr?: string;
  nameNl?: string;

  // Optional punchline
  headline?: string;
  headlineFr?: string;
  headlineNl?: string;

  // Card text
  summary?: string;
  summaryFr?: string;
  summaryNl?: string;

  // Long text
  description?: string;
  descriptionFr?: string;
  descriptionNl?: string;

  bulletPoints: string[];
  images: string[];

  visible: boolean;
};

type Message =
  | {
      type: "success" | "error";
      text: string;
    }
  | null;

const emptyProduct: Product = {
  pid: "",
  position: undefined,

  name: "",
  nameFr: "",
  nameNl: "",

  headline: "",
  headlineFr: "",
  headlineNl: "",

  summary: "",
  summaryFr: "",
  summaryNl: "",

  description: "",
  descriptionFr: "",
  descriptionNl: "",

  bulletPoints: [],
  images: [],

  visible: true,
};

function normalizePosition(value: string): number | undefined {
  const trimmed = value.trim();
  if (!trimmed) return undefined;

  const num = Number(trimmed);
  if (Number.isNaN(num)) return undefined;

  return num;
}

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [editing, setEditing] = useState<Product | null>(null);
  const [availableImages, setAvailableImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<Message>(null);

  function showMessage(type: "success" | "error", text: string) {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 2600);
  }

  async function load() {
    try {
      setLoading(true);
      const res = await fetch("/api/products");
      if (!res.ok) throw new Error("Failed to load products");
      const data: Product[] = await res.json();
      setProducts(data);
    } catch (err) {
      console.error(err);
      showMessage("error", "Error loading products.");
    } finally {
      setLoading(false);
    }
  }

  async function loadImages() {
    try {
      const res = await fetch("/api/product-images");
      if (!res.ok) throw new Error("Failed to load product images");
      const data: string[] = await res.json();
      setAvailableImages(data);
    } catch (err) {
      console.error(err);
    }
  }

  useEffect(() => {
    load();
    loadImages();
  }, []);

  const sortedProducts = useMemo(() => {
    const copy = [...products];

    copy.sort((a, b) => {
      const ap = a.position ?? Number.POSITIVE_INFINITY;
      const bp = b.position ?? Number.POSITIVE_INFINITY;

      if (ap !== bp) return ap - bp;

      return (a.name ?? "").localeCompare(b.name ?? "");
    });

    return copy;
  }, [products]);

  async function handleSave(product: Product) {
    try {
      setLoading(true);

      const payload = {
        pid: product.pid,
        position: product.position,

        name: product.name,
        nameFr: product.nameFr,
        nameNl: product.nameNl,

        headline: product.headline,
        headlineFr: product.headlineFr,
        headlineNl: product.headlineNl,

        summary: product.summary,
        summaryFr: product.summaryFr,
        summaryNl: product.summaryNl,

        description: product.description,
        descriptionFr: product.descriptionFr,
        descriptionNl: product.descriptionNl,

        bulletPoints: product.bulletPoints,
        images: product.images,

        visible: product.visible,
      };

      let res: Response;
      if (product._id) {
        res = await fetch(`/api/products/${product._id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      } else {
        res = await fetch(`/api/products`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      }

      if (!res.ok) throw new Error("Failed to save product");

      showMessage(
        "success",
        product._id ? "Product updated successfully." : "Product created successfully."
      );
      setEditing(null);
      await load();
    } catch (err) {
      console.error(err);
      showMessage("error", "Error saving product.");
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id?: string) {
    if (!id) return;
    const ok = window.confirm("Delete this product?");
    if (!ok) return;

    try {
      setLoading(true);
      const res = await fetch(`/api/products/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete product");
      showMessage("success", "Product deleted.");
      await load();
    } catch (err) {
      console.error(err);
      showMessage("error", "Error deleting product.");
    } finally {
      setLoading(false);
    }
  }

  async function toggleVisible(product: Product) {
    if (!product._id) return;

    try {
      const res = await fetch(`/api/products/${product._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ visible: !product.visible }),
      });
      if (!res.ok) throw new Error("Failed to update visibility");
      showMessage(
        "success",
        !product.visible ? "Product is now visible on site." : "Product hidden from site."
      );
      await load();
    } catch (err) {
      console.error(err);
      showMessage("error", "Error updating visibility.");
    }
  }

  return (
    <>
      <div className={styles.root}>
        <div className={styles.headerRow}>
          <div className={styles.headerText}>
            <p className={styles.kicker}>Catalog</p>
            <h1 className={styles.title}>Products on the landing page</h1>
            <p className={styles.subtitle}>
              Set a <strong>Position</strong> to control the order on the landing page (lower = earlier).
              Toggle visibility to show or hide products.
            </p>
          </div>

          <div className={styles.headerActions}>
            {loading && (
              <span className={styles.syncIndicator}>
                <span className={styles.syncDot} />
                Syncing…
              </span>
            )}

            <button
              type="button"
              className={styles.primaryPill}
              onClick={() => setEditing({ ...emptyProduct })}
            >
              <Plus size={15} strokeWidth={2.1} />
              <span>New product</span>
            </button>
          </div>
        </div>

        {message && (
          <div
            className={[
              styles.messageBanner,
              message.type === "success"
                ? styles.messageBannerSuccess
                : styles.messageBannerError,
            ].join(" ")}
          >
            {message.text}
          </div>
        )}

        <div className={styles.tableCard}>
          {loading && products.length === 0 ? (
            <div className={styles.tableLoading}>Loading products…</div>
          ) : (
            <div className={styles.tableWrapper}>
              <table className={styles.productsTable}>
                <thead>
                  <tr>
                    <th className={styles.colName}>Name</th>
                    <th className={styles.colDescription}>Summary</th>
                    <th style={{ width: 120 }}>Position</th>
                    <th className={styles.colVisible}>Visible</th>
                    <th className={styles.colActions}>Actions</th>
                  </tr>
                </thead>

                <tbody className={styles.tbody}>
                  {sortedProducts.map((p) => (
                    <tr key={p._id} className={styles.tableRow}>
                      <td className={styles.cellName}>
                        <span className={styles.cellNameText}>{p.name}</span>
                        <div style={{ fontSize: 10, opacity: 0.7, marginTop: 2 }}>
                          pid: {p.pid}
                        </div>
                      </td>

                      <td className={styles.cellDescription}>
                        <p className={styles.cellDescriptionText}>
                          {p.summary ?? p.description ?? "—"}
                        </p>
                      </td>

                      <td style={{ fontSize: 12, color: "#111827" }}>
                        {typeof p.position === "number" ? p.position : "—"}
                      </td>

                      <td className={styles.cellVisible}>
                        <button
                          type="button"
                          className={[
                            styles.visibilityPill,
                            p.visible ? styles.visibilityPillOn : styles.visibilityPillOff,
                          ].join(" ")}
                          onClick={() => toggleVisible(p)}
                        >
                          <span className={styles.visibilityDot} />
                          <span>{p.visible ? "Shown" : "Hidden"}</span>
                        </button>
                      </td>

                      <td className={styles.cellActions}>
                        <button
                          type="button"
                          className={[styles.iconButton, styles.iconButtonEdit].join(" ")}
                          onClick={() => setEditing(p)}
                          aria-label="Edit product"
                        >
                          <Edit2 size={16} strokeWidth={2} />
                        </button>

                        <button
                          type="button"
                          className={[styles.iconButton, styles.iconButtonDelete].join(" ")}
                          onClick={() => handleDelete(p._id)}
                          aria-label="Delete product"
                        >
                          <Trash2 size={16} strokeWidth={2} />
                        </button>
                      </td>
                    </tr>
                  ))}

                  {products.length === 0 && !loading && (
                    <tr>
                      <td className={styles.emptyState} colSpan={5}>
                        No products yet. Use{" "}
                        <span className={styles.emptyStateAccent}>“New product”</span>{" "}
                        to create your first item.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {editing && (
          <div className={styles.modalOverlay} onClick={() => setEditing(null)}>
            <div className={styles.modalCard} onClick={(e) => e.stopPropagation()}>
              <button
                type="button"
                className={styles.modalClose}
                onClick={() => setEditing(null)}
                aria-label="Close"
              >
                <X size={18} strokeWidth={2.2} />
              </button>

              <div className={styles.modalAccent} />

              <h2 className={styles.modalTitle}>
                {editing._id ? "Edit product" : "New product"}
              </h2>

              <p className={styles.modalSubtitle}>
                Set position to control order (lower shows first). Manage EN/FR/NL copy + images.
              </p>

              <div className={styles.modalBody}>
                <div className={styles.modalGrid}>
                  {/* pid + position */}
                  <div className={styles.modalField}>
                    <label className={styles.modalLabel}>Product ID (pid)</label>
                    <input
                      className={styles.modalInput}
                      value={editing.pid}
                      onChange={(e) => setEditing({ ...editing, pid: e.target.value })}
                      placeholder="day-treatment"
                    />
                  </div>

                  <div className={styles.modalField}>
                    <label className={styles.modalLabel}>
                      Position (optional)
                      <span style={{ marginLeft: 6, fontSize: 10, opacity: 0.7 }}>
                        lower = earlier
                      </span>
                    </label>
                    <input
                      className={styles.modalInput}
                      inputMode="numeric"
                      type="number"
                      step={1}
                      min={0}
                      value={typeof editing.position === "number" ? String(editing.position) : ""}
                      onChange={(e) =>
                        setEditing({
                          ...editing,
                          position: normalizePosition(e.target.value),
                        })
                      }
                      placeholder="1"
                    />
                  </div>

                  {/* Headlines */}
                  <div className={styles.modalField}>
                    <label className={styles.modalLabel}>Headline (EN, optional)</label>
                    <input
                      className={styles.modalInput}
                      value={editing.headline ?? ""}
                      onChange={(e) => setEditing({ ...editing, headline: e.target.value })}
                    />
                  </div>

                  <div className={styles.modalField}>
                    <label className={styles.modalLabel}>Headline (FR, optional)</label>
                    <input
                      className={styles.modalInput}
                      value={editing.headlineFr ?? ""}
                      onChange={(e) => setEditing({ ...editing, headlineFr: e.target.value })}
                    />
                  </div>

                  <div className={styles.modalField}>
                    <label className={styles.modalLabel}>Headline (NL, optional)</label>
                    <input
                      className={styles.modalInput}
                      value={editing.headlineNl ?? ""}
                      onChange={(e) => setEditing({ ...editing, headlineNl: e.target.value })}
                    />
                  </div>

                  {/* Names */}
                  <div className={styles.modalField}>
                    <label className={styles.modalLabel}>Name (EN)</label>
                    <input
                      className={styles.modalInput}
                      value={editing.name}
                      onChange={(e) => setEditing({ ...editing, name: e.target.value })}
                    />
                  </div>

                  <div className={styles.modalField}>
                    <label className={styles.modalLabel}>Name (FR)</label>
                    <input
                      className={styles.modalInput}
                      value={editing.nameFr ?? ""}
                      onChange={(e) => setEditing({ ...editing, nameFr: e.target.value })}
                    />
                  </div>

                  <div className={styles.modalField}>
                    <label className={styles.modalLabel}>Name (NL)</label>
                    <input
                      className={styles.modalInput}
                      value={editing.nameNl ?? ""}
                      onChange={(e) => setEditing({ ...editing, nameNl: e.target.value })}
                    />
                  </div>

                  {/* Summary */}
                  <div className={[styles.modalField, styles.spanAll].join(" ")}>
                    <label className={styles.modalLabel}>Summary (EN)</label>
                    <textarea
                      className={styles.modalTextarea}
                      value={editing.summary ?? ""}
                      onChange={(e) => setEditing({ ...editing, summary: e.target.value })}
                    />
                  </div>

                  <div className={[styles.modalField, styles.spanAll].join(" ")}>
                    <label className={styles.modalLabel}>Summary (FR)</label>
                    <textarea
                      className={styles.modalTextarea}
                      value={editing.summaryFr ?? ""}
                      onChange={(e) =>
                        setEditing({ ...editing, summaryFr: e.target.value })
                      }
                    />
                  </div>

                  <div className={[styles.modalField, styles.spanAll].join(" ")}>
                    <label className={styles.modalLabel}>Summary (NL)</label>
                    <textarea
                      className={styles.modalTextarea}
                      value={editing.summaryNl ?? ""}
                      onChange={(e) =>
                        setEditing({ ...editing, summaryNl: e.target.value })
                      }
                    />
                  </div>

                  {/* Description */}
                  <div className={[styles.modalField, styles.spanAll].join(" ")}>
                    <label className={styles.modalLabel}>Description (EN)</label>
                    <textarea
                      className={styles.modalTextarea}
                      value={editing.description ?? ""}
                      onChange={(e) =>
                        setEditing({ ...editing, description: e.target.value })
                      }
                    />
                  </div>

                  <div className={[styles.modalField, styles.spanAll].join(" ")}>
                    <label className={styles.modalLabel}>Description (FR)</label>
                    <textarea
                      className={styles.modalTextarea}
                      value={editing.descriptionFr ?? ""}
                      onChange={(e) =>
                        setEditing({ ...editing, descriptionFr: e.target.value })
                      }
                    />
                  </div>

                  <div className={[styles.modalField, styles.spanAll].join(" ")}>
                    <label className={styles.modalLabel}>Description (NL)</label>
                    <textarea
                      className={styles.modalTextarea}
                      value={editing.descriptionNl ?? ""}
                      onChange={(e) =>
                        setEditing({ ...editing, descriptionNl: e.target.value })
                      }
                    />
                  </div>

                  {/* Bullet points */}
                  <div className={[styles.modalField, styles.spanAll].join(" ")}>
                    <label className={styles.modalLabel}>Bullet points (one per line)</label>
                    <textarea
                      className={styles.modalTextarea}
                      value={(editing.bulletPoints ?? []).join("\n")}
                      onChange={(e) =>
                        setEditing({
                          ...editing,
                          bulletPoints: e.target.value
                            .split("\n")
                            .map((s) => s.trim())
                            .filter(Boolean),
                        })
                      }
                    />
                  </div>

                  {/* Images */}
                  <div className={[styles.modalField, styles.spanAll].join(" ")}>
                    <label className={styles.modalLabel}>Images</label>

                    <div className={styles.imagesGrid}>
                      {availableImages.map((img) => {
                        const selected = editing.images.includes(img);

                        return (
                          <button
                            key={img}
                            type="button"
                            onClick={() => {
                              const next = selected
                                ? editing.images.filter((x) => x !== img)
                                : [...editing.images, img];
                              setEditing({ ...editing, images: next });
                            }}
                            className={[
                              styles.imageTile,
                              selected ? styles.imageTileSelected : "",
                            ].join(" ")}
                          >
                            <img className={styles.imageTileImg} src={img} alt="" />
                            <div className={styles.imageTileName}>
                              {img.split("/").pop()}
                            </div>
                          </button>
                        );
                      })}
                    </div>

                    <div className={styles.imagesMeta}>
                      Selected: {editing.images.length}
                    </div>
                  </div>
                </div>

                <div className={styles.modalVisibleRow}>
                  <button
                    type="button"
                    className={[
                      styles.visibilityToggle,
                      editing.visible ? styles.visibilityToggleOn : styles.visibilityToggleOff,
                    ].join(" ")}
                    onClick={() => setEditing({ ...editing, visible: !editing.visible })}
                  >
                    <span className={styles.visibilityToggleHandle} />
                  </button>
                  <span className={styles.modalVisibleLabel}>
                    {editing.visible ? "Visible on site" : "Hidden from site"}
                  </span>
                </div>
              </div>

              <div className={styles.modalFooter}>
                <button
                  type="button"
                  className={styles.secondaryTextButton}
                  onClick={() => setEditing(null)}
                >
                  Cancel
                </button>

                <button
                  type="button"
                  className={styles.primaryPill}
                  onClick={() => handleSave(editing)}
                  disabled={!editing.name.trim() || !editing.pid.trim()}
                >
                  Save changes
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
