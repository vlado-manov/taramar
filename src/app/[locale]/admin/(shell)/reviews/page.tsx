"use client";

import { useEffect, useState } from "react";
import { Plus, Edit2, Trash2, X } from "lucide-react";
import styles from "./AdminReviewsPage.module.css";

type Review = {
  _id?: string;
  name: string;
  message: string;
  messageFr: string;
  messageNl: string;
};

type Message =
  | {
      type: "success" | "error";
      text: string;
    }
  | null;

const emptyReview: Review = {
  name: "",
  message: "",
  messageFr: "",
  messageNl: "",
};

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [editing, setEditing] = useState<Review | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<Message>(null);

  function showMessage(type: "success" | "error", text: string) {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 2600);
  }

  async function load() {
    try {
      setLoading(true);
      const res = await fetch("/api/reviews");
      if (!res.ok) throw new Error("Failed to load reviews");
      const data: Review[] = await res.json();
      setReviews(data);
    } catch (err) {
      console.error(err);
      showMessage("error", "Error loading reviews.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function handleSave(review: Review) {
    try {
      setLoading(true);

      const payload = {
        name: review.name,
        message: review.message,
        messageFr: review.messageFr,
        messageNl: review.messageNl,
      };

      let res: Response;
      if (review._id) {
        res = await fetch(`/api/reviews/${review._id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      } else {
        res = await fetch(`/api/reviews`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      }

      if (!res.ok) throw new Error("Failed to save review");

      showMessage(
        "success",
        review._id ? "Review updated successfully." : "Review created successfully."
      );
      setEditing(null);
      await load();
    } catch (err) {
      console.error(err);
      showMessage("error", "Error saving review.");
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id?: string) {
    if (!id) return;
    const ok = window.confirm("Delete this review?");
    if (!ok) return;

    try {
      setLoading(true);
      const res = await fetch(`/api/reviews/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete review");
      showMessage("success", "Review deleted.");
      await load();
    } catch (err) {
      console.error(err);
      showMessage("error", "Error deleting review.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={styles.reviewsRoot}>
      {/* Header */}
      <div className={styles.reviewsHeaderRow}>
        <div className={styles.reviewsHeaderText}>
          <p className={styles.reviewsKicker}>Landing</p>
          <h1 className={styles.reviewsTitle}>Reviews slider</h1>
          <p className={styles.reviewsSubtitle}>
            Manage the testimonials shown in the reviews carousel. Provide EN/FR/NL text.
          </p>
        </div>

        <div className={styles.reviewsHeaderActions}>
          {loading && (
            <span className={styles.syncIndicator}>
              <span className={styles.syncDot} />
              Syncing…
            </span>
          )}

          <button
            type="button"
            className={styles.primaryPill}
            onClick={() => setEditing({ ...emptyReview })}
          >
            <Plus size={15} strokeWidth={2.1} />
            <span>New review</span>
          </button>
        </div>
      </div>

      {/* Message */}
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

      {/* Table */}
      <div className={styles.tableCard}>
        {loading && reviews.length === 0 ? (
          <div className={styles.tableLoading}>Loading reviews…</div>
        ) : (
          <div className={styles.tableWrapper}>
            <table className={styles.reviewsTable}>
              <thead>
                <tr>
                  <th className={styles.colName}>Name</th>
                  <th className={styles.colMessage}>Message (EN)</th>
                  <th className={styles.colActions}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {reviews.map((r) => (
                  <tr key={r._id} className={styles.tableRow}>
                    <td className={styles.cellName}>
                      <span className={styles.cellNameText}>{r.name}</span>
                    </td>
                    <td className={styles.cellMessage}>
                      <p className={styles.cellMessageText}>{r.message}</p>
                    </td>
                    <td className={styles.cellActions}>
                      <button
                        type="button"
                        className={[styles.iconButton, styles.iconButtonEdit].join(" ")}
                        onClick={() => setEditing(r)}
                        aria-label="Edit review"
                      >
                        <Edit2 size={16} strokeWidth={2} />
                      </button>
                      <button
                        type="button"
                        className={[styles.iconButton, styles.iconButtonDelete].join(" ")}
                        onClick={() => handleDelete(r._id)}
                        aria-label="Delete review"
                      >
                        <Trash2 size={16} strokeWidth={2} />
                      </button>
                    </td>
                  </tr>
                ))}

                {reviews.length === 0 && !loading && (
                  <tr>
                    <td className={styles.emptyState} colSpan={3}>
                      No reviews yet. Use{" "}
                      <span className={styles.emptyStateAccent}>“New review”</span>{" "}
                      to create your first testimonial.
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
              {editing._id ? "Edit review" : "New review"}
            </h2>
            <p className={styles.modalSubtitle}>
              Provide the reviewer name and message in EN/FR/NL.
            </p>

            <div className={styles.modalBody}>
              <div className={styles.modalField}>
                <label className={styles.modalLabel}>Name</label>
                <input
                  className={styles.modalInput}
                  value={editing.name}
                  onChange={(e) => setEditing({ ...editing, name: e.target.value })}
                />
              </div>

              <div className={styles.modalField}>
                <label className={styles.modalLabel}>Message (EN)</label>
                <textarea
                  className={styles.modalTextarea}
                  value={editing.message}
                  onChange={(e) => setEditing({ ...editing, message: e.target.value })}
                />
              </div>

              <div className={styles.modalField}>
                <label className={styles.modalLabel}>Message (FR)</label>
                <textarea
                  className={styles.modalTextarea}
                  value={editing.messageFr}
                  onChange={(e) => setEditing({ ...editing, messageFr: e.target.value })}
                />
              </div>

              <div className={styles.modalField}>
                <label className={styles.modalLabel}>Message (NL)</label>
                <textarea
                  className={styles.modalTextarea}
                  value={editing.messageNl}
                  onChange={(e) => setEditing({ ...editing, messageNl: e.target.value })}
                />
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
                  !editing.message.trim() ||
                  !editing.messageFr.trim() ||
                  !editing.messageNl.trim()
                }
              >
                Save review
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
