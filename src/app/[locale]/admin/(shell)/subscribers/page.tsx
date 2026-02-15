"use client";

import { useEffect, useState } from "react";
import { Trash2 } from "lucide-react";
import styles from "./AdminSubscribersPage.module.css";

type Subscriber = {
  _id: string;
  email: string;
  locale: string;
  subscribedAt: string;
};

type Message = { type: "success" | "error"; text: string } | null;

function formatDate(iso: string) {
  const d = new Date(iso);
  return d.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function AdminSubscribersPage() {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<Message>(null);

  function showMessage(type: "success" | "error", text: string) {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 2600);
  }

  async function load() {
    try {
      setLoading(true);
      const res = await fetch("/api/subscribers");
      if (!res.ok) throw new Error();
      const data: Subscriber[] = await res.json();
      setSubscribers(data);
    } catch {
      showMessage("error", "Error loading subscribers.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function handleDelete(id: string, email: string) {
    if (!window.confirm(`Remove ${email} from the list?`)) return;
    try {
      setLoading(true);
      const res = await fetch(`/api/subscribers/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      showMessage("success", `${email} removed.`);
      await load();
    } catch {
      showMessage("error", "Error deleting subscriber.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={styles.root}>
      <div className={styles.headerRow}>
        <div className={styles.headerText}>
          <p className={styles.kicker}>Newsletter</p>
          <h1 className={styles.title}>Subscribers</h1>
          <p className={styles.subtitle}>
            Everyone who signed up via the newsletter section on the landing page.
          </p>
        </div>

        <div className={styles.headerMeta}>
          {loading && (
            <span className={styles.syncIndicator}>
              <span className={styles.syncDot} />
              Syncing…
            </span>
          )}
          {!loading && subscribers.length > 0 && (
            <span className={styles.countBadge}>
              {subscribers.length} subscriber{subscribers.length !== 1 ? "s" : ""}
            </span>
          )}
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
        {loading && subscribers.length === 0 ? (
          <div className={styles.tableLoading}>Loading subscribers…</div>
        ) : (
          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Email</th>
                  <th>Locale</th>
                  <th>Subscribed at</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {subscribers.map((s, i) => (
                  <tr key={s._id} className={styles.tableRow}>
                    <td className={styles.cellDate} style={{ width: 40, color: "rgba(15,23,42,0.3)" }}>
                      {i + 1}
                    </td>
                    <td className={styles.cellEmail}>{s.email}</td>
                    <td className={styles.cellDate}>
                      <span className={styles.localeBadge} data-locale={s.locale ?? "en"}>
                        {(s.locale ?? "en").toUpperCase()}
                      </span>
                    </td>
                    <td className={styles.cellDate}>{formatDate(s.subscribedAt)}</td>
                    <td className={styles.cellActions}>
                      <button
                        type="button"
                        className={[styles.iconButton, styles.iconButtonDelete].join(" ")}
                        onClick={() => handleDelete(s._id, s.email)}
                        aria-label="Delete subscriber"
                      >
                        <Trash2 size={15} strokeWidth={2} />
                      </button>
                    </td>
                  </tr>
                ))}

                {subscribers.length === 0 && !loading && (
                  <tr>
                    <td className={styles.emptyState} colSpan={5}>
                      No subscribers yet. They will appear here once someone signs up via the{" "}
                      <span className={styles.emptyStateAccent}>newsletter section</span>.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
