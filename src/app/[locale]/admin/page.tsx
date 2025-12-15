"use client";

import { useEffect, useState } from "react";

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
    setTimeout(() => setMessage(null), 3000);
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
        !store.visible ? "Store is now visible on map." : "Store hidden from map."
      );
      await load();
    } catch (err) {
      console.error(err);
      showMessage("error", "Error updating visibility.");
    }
  }

  return (
    <div>
      <div className="flex justify-between mb-4 items-center">
        <h1 className="text-xl font-semibold">Stores</h1>
        <button
          className="rounded bg-black text-white text-sm px-4 py-2"
          onClick={() => setEditing({ ...emptyStore })}
        >
          + New store
        </button>
      </div>

      {message && (
        <div
          className={`mb-4 rounded px-3 py-2 text-sm ${
            message.type === "success"
              ? "bg-green-100 text-green-800 border border-green-300"
              : "bg-red-100 text-red-800 border border-red-300"
          }`}
        >
          {message.text}
        </div>
      )}

      {loading && stores.length === 0 ? (
        <div className="text-sm text-gray-500">Loading stores…</div>
      ) : (
        <table className="w-full text-sm border">
          <thead className="bg-slate-100">
            <tr>
              <th className="border px-2 py-1 text-left">Name</th>
              <th className="border px-2 py-1 text-left">Address</th>
              <th className="border px-2 py-1 text-left">City</th>
              <th className="border px-2 py-1 text-left">Postal code</th>
              <th className="border px-2 py-1 text-left">Visible</th>
              <th className="border px-2 py-1 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {stores.map((s) => (
              <tr key={s._id}>
                <td className="border px-2 py-1">{s.name}</td>
                <td className="border px-2 py-1">{s.address}</td>
                <td className="border px-2 py-1">{s.city}</td>
                <td className="border px-2 py-1">{s.postalCode}</td>
                <td className="border px-2 py-1">
                  <button
                    className={`px-2 py-1 rounded text-xs ${
                      s.visible ? "bg-green-100" : "bg-red-100"
                    }`}
                    onClick={() => toggleVisible(s)}
                  >
                    {s.visible ? "Shown" : "Hidden"}
                  </button>
                </td>
                <td className="border px-2 py-1 whitespace-nowrap">
                  <button
                    className="text-xs mr-2 underline"
                    onClick={() => setEditing(s)}
                  >
                    Edit
                  </button>
                  <button
                    className="text-xs text-red-600 underline"
                    onClick={() => handleDelete(s._id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {stores.length === 0 && !loading && (
              <tr>
                <td
                  colSpan={6}
                  className="border px-2 py-4 text-center text-gray-500"
                >
                  No stores yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}

      {editing && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded shadow max-w-md w-full p-4">
            <h2 className="text-lg font-semibold mb-3">
              {editing._id ? "Edit store" : "New store"}
            </h2>
            <div className="space-y-3 text-sm">
              <div>
                <label className="block mb-1">Name</label>
                <input
                  className="border rounded w-full px-2 py-1"
                  value={editing.name}
                  onChange={(e) =>
                    setEditing({ ...editing, name: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="block mb-1">Address</label>
                <input
                  className="border rounded w-full px-2 py-1"
                  value={editing.address}
                  onChange={(e) =>
                    setEditing({ ...editing, address: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="block mb-1">City</label>
                <input
                  className="border rounded w-full px-2 py-1"
                  value={editing.city}
                  onChange={(e) =>
                    setEditing({ ...editing, city: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="block mb-1">Postal code</label>
                <input
                  className="border rounded w-full px-2 py-1"
                  value={editing.postalCode}
                  onChange={(e) =>
                    setEditing({ ...editing, postalCode: e.target.value })
                  }
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block mb-1">Latitude</label>
                  <input
                    type="number"
                    step="0.000001"
                    className="border rounded w-full px-2 py-1"
                    value={editing.lat}
                    onChange={(e) =>
                      setEditing({
                        ...editing,
                        lat: Number(e.target.value),
                      })
                    }
                  />
                </div>
                <div>
                  <label className="block mb-1">Longitude</label>
                  <input
                    type="number"
                    step="0.000001"
                    className="border rounded w-full px-2 py-1"
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
              <div className="flex items-center gap-2">
                <input
                  id="visible-store"
                  type="checkbox"
                  checked={editing.visible}
                  onChange={(e) =>
                    setEditing({ ...editing, visible: e.target.checked })
                  }
                />
                <label htmlFor="visible-store">Visible on map</label>
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <button
                className="text-sm px-3 py-1"
                onClick={() => setEditing(null)}
              >
                Cancel
              </button>
              <button
                className="bg-black text-white text-sm px-4 py-1 rounded"
                onClick={() => handleSave(editing)}
                disabled={
                  !editing.name.trim() ||
                  !editing.address.trim() ||
                  !editing.city.trim() ||
                  !editing.postalCode.trim()
                }
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
