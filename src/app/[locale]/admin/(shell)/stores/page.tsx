"use client";

import { useEffect, useState } from "react";
import { Plus, Edit2, Trash2, X } from "lucide-react";
import styles from "./AdminStoresPage.module.css";

type Store = {
  _id?: string;
  name: string;
  address: string;
  postalCode: string;
  city: string;
  lat: number;
  lng: number;
  visible: boolean;
};

type Message = {
  type: "success" | "error";
  text: string;
} | null;

const emptyStore: Store = {
  name: "",
  address: "",
  postalCode: "",
  city: "",
  lat: 50.8503,
  lng: 4.3517,
  visible: true,
};

export default function AdminStoresPage() {
  const [stores, setStores] = useState<Store[]>([]);
  const [editing, setEditing] = useState<Store | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<Message>(null);

  function showMessage(type: "success" | "error", text: string) {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 2600);
  }

  async function load() {
    try {
      setLoading(true);
      const res = await fetch("/api/stores");
      if (!res.ok) throw new Error("Failed to load stores");
      const data: Store[] = await res.json();
      setStores(data);
    } catch (err) {
      console.error(err);
      showMessage("error", "Error loading stores.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function handleSave(store: Store) {
    try {
      setLoading(true);
      const payload = {
        name: store.name,
        address: store.address,
        postalCode: store.postalCode,
        city: store.city,
        lat: store.lat,
        lng: store.lng,
        visible: store.visible,
      };

      let res: Response;
      if (store._id) {
        res = await fetch(`/api/stores/${store._id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      } else {
        res = await fetch(`/api/stores`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      }

      if (!res.ok) throw new Error("Failed to save store");

      showMessage(
        "success",
        store._id ? "Store updated successfully." : "Store created successfully."
      );
      setEditing(null);
      await load();
    } catch (err) {
      console.error(err);
      showMessage("error", "Error saving store.");
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id?: string) {
    if (!id) return;
    const ok = window.confirm("Delete this store?");
    if (!ok) return;

    try {
      setLoading(true);
      const res = await fetch(`/api/stores/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete store");
      showMessage("success", "Store deleted.");
      await load();
    } catch (err) {
      console.error(err);
      showMessage("error", "Error deleting store.");
    } finally {
      setLoading(false);
    }
  }

  async function toggleVisible(store: Store) {
    if (!store._id) return;

    try {
      const res = await fetch(`/api/stores/${store._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ visible: !store.visible }),
      });
      if (!res.ok) throw new Error("Failed to update visibility");
      showMessage(
        "success",
        !store.visible
          ? "Store is now visible on map."
          : "Store hidden from map."
      );
      await load();
    } catch (err) {
      console.error(err);
      showMessage("error", "Error updating visibility.");
    }
  }

  return (
    <div className={styles.storesRoot}>
      {/* Header */}
      <div className={styles.storesHeaderRow}>
        <div className={styles.storesHeaderText}>
          <p className={styles.storesKicker}>Map</p>
          <h1 className={styles.storesTitle}>Stores shown in the INNO map</h1>
          <p className={styles.storesSubtitle}>
            Manage physical locations that appear in the “Find Taramar at INNO”
            map. Toggle visibility to show or hide a store.
          </p>
        </div>
        <div className={styles.storesHeaderActions}>
          {loading && (
            <span className={styles.syncIndicator}>
              <span className={styles.syncDot} />
              Syncing…
            </span>
          )}
          <button
            type="button"
            className={styles.primaryPill}
            onClick={() => setEditing({ ...emptyStore })}
          >
            <Plus size={15} strokeWidth={2.1} />
            <span>New store</span>
          </button>
        </div>
      </div>

      {/* Message */}
      {message && (
        <div
          className={`${styles.messageBanner} ${
            message.type === "success"
              ? styles.messageBannerSuccess
              : styles.messageBannerError
          }`}
        >
          {message.text}
        </div>
      )}

      {/* Table card */}
      <div className={styles.tableCard}>
        {loading && stores.length === 0 ? (
          <div className={styles.tableLoading}>Loading stores…</div>
        ) : (
          <div className={styles.tableWrapper}>
            <table className={styles.storesTable}>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Address</th>
                  <th>City</th>
                  <th>Postal code</th>
                  <th>Visible</th>
                  <th className={styles.colActions}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {stores.map((s) => (
                  <tr key={s._id} className={styles.tableRow}>
                    <td className={styles.cellName}>
                      <span className={styles.cellNameText}>{s.name}</span>
                    </td>
                    <td className={styles.cellAddress}>
                      <span className={styles.cellAddressText}>{s.address}</span>
                    </td>
                    <td className={styles.cellCity}>
                      <span>{s.city}</span>
                    </td>
                    <td className={styles.cellPostal}>
                      <span>{s.postalCode}</span>
                    </td>
                    <td className={styles.cellVisible}>
                      <button
                        type="button"
                        className={`${styles.visibilityPill} ${
                          s.visible
                            ? styles.visibilityPillOn
                            : styles.visibilityPillOff
                        }`}
                        onClick={() => toggleVisible(s)}
                      >
                        <span className={styles.visibilityDot} />
                        <span>{s.visible ? "Shown" : "Hidden"}</span>
                      </button>
                    </td>
                    <td className={styles.cellActions}>
                      <button
                        type="button"
                        className={`${styles.iconButton} ${styles.iconButtonEdit}`}
                        onClick={() => setEditing(s)}
                        aria-label="Edit store"
                      >
                        <Edit2 size={16} strokeWidth={2} />
                      </button>
                      <button
                        type="button"
                        className={`${styles.iconButton} ${styles.iconButtonDelete}`}
                        onClick={() => handleDelete(s._id)}
                        aria-label="Delete store"
                      >
                        <Trash2 size={16} strokeWidth={2} />
                      </button>
                    </td>
                  </tr>
                ))}
                {stores.length === 0 && !loading && (
                  <tr>
                    <td className={styles.emptyState} colSpan={6}>
                      No stores yet. Use{" "}
                      <span className={styles.emptyStateAccent}>
                        “New store”
                      </span>{" "}
                      to add your first location.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal */}
      {editing && (
        <div
          className={styles.modalOverlay}
          onClick={() => setEditing(null)}
        >
          <div
            className={styles.modalCard}
            onClick={(e) => e.stopPropagation()}
          >
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
              {editing._id ? "Edit store" : "New store"}
            </h2>
            <p className={styles.modalSubtitle}>
              Set the details that appear on the INNO store map and card.
            </p>

            <div className={styles.modalBody}>
              <div className={styles.modalField}>
                <label className={styles.modalLabel}>Name</label>
                <input
                  className={styles.modalInput}
                  value={editing.name}
                  onChange={(e) =>
                    setEditing({ ...editing, name: e.target.value })
                  }
                />
              </div>

              <div className={styles.modalField}>
                <label className={styles.modalLabel}>Address</label>
                <input
                  className={styles.modalInput}
                  value={editing.address}
                  onChange={(e) =>
                    setEditing({ ...editing, address: e.target.value })
                  }
                />
              </div>

              <div className={styles.modalRow}>
                <div className={styles.modalField}>
                  <label className={styles.modalLabel}>City</label>
                  <input
                    className={styles.modalInput}
                    value={editing.city}
                    onChange={(e) =>
                      setEditing({ ...editing, city: e.target.value })
                    }
                  />
                </div>
                <div className={styles.modalField}>
                  <label className={styles.modalLabel}>Postal code</label>
                  <input
                    className={styles.modalInput}
                    value={editing.postalCode}
                    onChange={(e) =>
                      setEditing({
                        ...editing,
                        postalCode: e.target.value,
                      })
                    }
                  />
                </div>
              </div>

              <div className={styles.modalRow}>
                <div className={styles.modalField}>
                  <label className={styles.modalLabel}>Latitude</label>
                  <input
                    type="number"
                    step="0.000001"
                    className={styles.modalInput}
                    value={editing.lat}
                    onChange={(e) =>
                      setEditing({
                        ...editing,
                        lat: Number(e.target.value),
                      })
                    }
                  />
                </div>
                <div className={styles.modalField}>
                  <label className={styles.modalLabel}>Longitude</label>
                  <input
                    type="number"
                    step="0.000001"
                    className={styles.modalInput}
                    value={editing.lng}
                    onChange={(e) =>
                      setEditing({
                        ...editing,
                        lng: Number(e.target.value),
                      })
                    }
                  />
                </div>
              </div>

              <div className={styles.modalVisibleRow}>
                <button
                  type="button"
                  className={`${styles.visibilityToggle} ${
                    editing.visible
                      ? styles.visibilityToggleOn
                      : styles.visibilityToggleOff
                  }`}
                  onClick={() =>
                    setEditing({ ...editing, visible: !editing.visible })
                  }
                >
                  <span className={styles.visibilityToggleHandle} />
                </button>
                <span className={styles.modalVisibleLabel}>
                  {editing.visible ? "Visible on map" : "Hidden from map"}
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
                disabled={
                  !editing.name.trim() ||
                  !editing.address.trim() ||
                  !editing.city.trim() ||
                  !editing.postalCode.trim()
                }
              >
                Save store
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
