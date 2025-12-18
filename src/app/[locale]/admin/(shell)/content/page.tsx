"use client";

import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { Search, Edit2, X, ChevronDown } from "lucide-react";
import styles from "./AdminContentPage.module.css";

type Row = {
  key: string;
  section: string;
  values: { en: string; fr: string; nl: string };
  isOverridden: { en: boolean; fr: boolean; nl: boolean };
};

type ApiData = {
  sections: Record<string, string[]>;
  rows: Row[];
};

type LocaleValues = { en: string; fr: string; nl: string };

const SECTION_ORDER: Array<{ id: string; title: string; hint: string }> = [
  { id: "hero", title: "Hero section", hint: "Top headline, intro, CTAs" },
  { id: "about", title: "About Taramar", hint: "Endorsement section" },
  { id: "aboutIngredients", title: "About ingredients", hint: "NoTox, botanicals, philosophy" },
  { id: "quote", title: "Dagny Ros Quote", hint: "Quote block + author" },
  { id: "founders", title: "The Founders", hint: "Story and research copy" },
  { id: "products", title: "The collection", hint: "Collection headline and CTA" },
  { id: "productPopup", title: "Product Popup", hint: "Popup copy for product details" },
  { id: "experience", title: "The Taramar Ritual", hint: "In-store ritual section" },
  { id: "videoSection", title: "Video section", hint: "Headlines + CTA" },
  { id: "reviews", title: "Reviews", hint: "Slider headline and labels" },
  { id: "stores", title: "Find Taramar", hint: "Map section + locations" },
  { id: "mapModal", title: "Find Taramar Popup", hint: "Store locator modal copy" },
  { id: "newsletter", title: "Newsletter", hint: "Signup text + CTA" },
  { id: "footer", title: "Footer", hint: "Claims + links" },
];

function firstSectionId() {
  return SECTION_ORDER[0]?.id ?? "hero";
}

export default function AdminContentPage() {
  const [data, setData] = useState<ApiData | null>(null);
  const [loading, setLoading] = useState(false);

  const [query, setQuery] = useState("");
  const [editing, setEditing] = useState<Row | null>(null);

  const [draft, setDraft] = useState<LocaleValues>({
    en: "",
    fr: "",
    nl: "",
  });

  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    [firstSectionId()]: true,
  });

  // Portal safe guard
  const [canPortal, setCanPortal] = useState(false);
  useEffect(() => setCanPortal(true), []);

  // Hard scroll lock + ESC close when modal open
  useEffect(() => {
    if (!editing) return;
    if (typeof window === "undefined") return;

    const html = document.documentElement;
    const body = document.body;

    const prevHtmlOverflow = html.style.overflow;
    const prevBodyOverflow = body.style.overflow;
    const prevPaddingRight = body.style.paddingRight;

    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;

    html.style.overflow = "hidden";
    body.style.overflow = "hidden";
    if (scrollbarWidth > 0) body.style.paddingRight = `${scrollbarWidth}px`;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setEditing(null);
    };
    window.addEventListener("keydown", onKeyDown);

    return () => {
      html.style.overflow = prevHtmlOverflow;
      body.style.overflow = prevBodyOverflow;
      body.style.paddingRight = prevPaddingRight;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [editing]);

  async function load() {
    setLoading(true);
    try {
      const res = await fetch("/api/translations");
      if (!res.ok) throw new Error("Failed to load translations");
      const json = (await res.json()) as ApiData;
      setData(json);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  function openEdit(row: Row) {
    setEditing(row);
    setDraft({
      en: row.values.en,
      fr: row.values.fr,
      nl: row.values.nl,
    });
  }

  async function save() {
    if (!editing) return;

    setLoading(true);
    try {
      const res = await fetch("/api/translations/save", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key: editing.key, values: draft }),
      });
      if (!res.ok) throw new Error("Failed to save");

      setEditing(null);
      await load();
    } finally {
      setLoading(false);
    }
  }

  const filteredRows = useMemo(() => {
    if (!data) return [];

    const q = query.trim().toLowerCase();
    if (!q) return data.rows;

    return data.rows.filter((r) => {
      return (
        r.key.toLowerCase().includes(q) ||
        r.values.en.toLowerCase().includes(q) ||
        r.values.fr.toLowerCase().includes(q) ||
        r.values.nl.toLowerCase().includes(q)
      );
    });
  }, [data, query]);

  const rowsBySection = useMemo(() => {
    const map: Record<string, Row[]> = {};
    for (const row of filteredRows) {
      if (!map[row.section]) map[row.section] = [];
      map[row.section].push(row);
    }
    for (const section of Object.keys(map)) {
      map[section].sort((a, b) => a.key.localeCompare(b.key));
    }
    return map;
  }, [filteredRows]);

  // Expand matching sections on search
  useEffect(() => {
    const q = query.trim();
    if (!q) return;

    const next: Record<string, boolean> = { ...openSections };
    for (const s of SECTION_ORDER) {
      if (rowsBySection[s.id]?.length) next[s.id] = true;
    }
    setOpenSections(next);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);

  function toggleSection(id: string) {
    setOpenSections((prev) => ({ ...prev, [id]: !prev[id] }));
  }

  function hasOverrides(row: Row) {
    return row.isOverridden.en || row.isOverridden.fr || row.isOverridden.nl;
  }

  function countOverrides(rows: Row[]) {
    let count = 0;
    for (const r of rows) if (hasOverrides(r)) count += 1;
    return count;
  }

  const modal =
    editing && canPortal
      ? createPortal(
          <div
            className={styles.modalOverlay}
            role="dialog"
            aria-modal="true"
            aria-label="Edit translation"
            onMouseDown={(e) => {
              if (e.target === e.currentTarget) setEditing(null);
            }}
          >
            <div
              className={styles.modalCard}
              onMouseDown={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                className={styles.modalClose}
                onClick={() => setEditing(null)}
                aria-label="Close"
              >
                <X size={18} />
              </button>

              <div className={styles.modalHeader}>
                <p className={styles.modalKicker}>Editing</p>
                <h2 className={styles.modalTitle}>{editing.key}</h2>
                <p className={styles.modalHint}>
                  Leave a field empty to remove the override for that language.
                </p>
              </div>

              <div className={styles.modalBody}>
                <div className={styles.field}>
                  <label className={styles.label}>English (EN)</label>
                  <textarea
                    className={styles.textarea}
                    value={draft.en}
                    onChange={(e) => setDraft({ ...draft, en: e.target.value })}
                  />
                </div>

                <div className={styles.field}>
                  <label className={styles.label}>Français (FR)</label>
                  <textarea
                    className={styles.textarea}
                    value={draft.fr}
                    onChange={(e) => setDraft({ ...draft, fr: e.target.value })}
                  />
                </div>

                <div className={styles.field}>
                  <label className={styles.label}>Nederlands (NL)</label>
                  <textarea
                    className={styles.textarea}
                    value={draft.nl}
                    onChange={(e) => setDraft({ ...draft, nl: e.target.value })}
                  />
                </div>
              </div>

              <div className={styles.modalFooter}>
                <button
                  type="button"
                  className={styles.secondaryBtn}
                  onClick={() => setEditing(null)}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className={styles.primaryBtn}
                  onClick={save}
                  disabled={loading}
                >
                  Save changes
                </button>
              </div>
            </div>
          </div>,
          document.body
        )
      : null;

  return (
    <div className={styles.root}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerText}>
          <p className={styles.kicker}>Landing</p>
          <h1 className={styles.title}>Website copy</h1>
          <p className={styles.subtitle}>
            Edit the EN/FR/NL copy per section. Use search to quickly find any text.
            Leaving a field empty removes the override and falls back to the default JSON.
          </p>
        </div>
      </div>

      {/* Toolbar */}
      <div className={styles.toolbar}>
        <div className={styles.searchWrap}>
          <Search size={16} />
          <input
            className={styles.search}
            placeholder="Search key or text…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>

        {loading ? <span className={styles.sync}>Syncing…</span> : null}
      </div>

      {/* Accordion */}
      <div className={styles.sections}>
        {SECTION_ORDER.map((s) => {
          const rows = rowsBySection[s.id] ?? [];
          const isOpen = !!openSections[s.id];

          const existsInData = !!data?.sections?.[s.id];
          const show = rows.length > 0 || existsInData;
          if (!show) return null;

          const overrideCount = countOverrides(rows);
          const panelId = `panel-${s.id}`;

          return (
            <div key={s.id} className={styles.sectionCard} data-open={isOpen}>
              <button
                type="button"
                className={styles.sectionHeader}
                onClick={() => toggleSection(s.id)}
                aria-expanded={isOpen}
                aria-controls={panelId}
                data-open={isOpen}
              >
                <div className={styles.sectionHeaderLeft}>
                  <div className={styles.sectionTitleRow}>
                    <p className={styles.sectionTitle}>{s.title}</p>
                    <span className={styles.statePill}>
                      {isOpen ? "Open" : "Closed"}
                    </span>
                  </div>

                  <p className={styles.sectionHint}>{s.hint}</p>

                  <div className={styles.sectionMetaRow}>
                    <span className={styles.sectionMeta}>
                      {rows.length} item{rows.length === 1 ? "" : "s"}
                    </span>

                    {overrideCount > 0 ? (
                      <span className={styles.overridePill}>
                        {overrideCount} overridden
                      </span>
                    ) : (
                      <span className={styles.neutralPill}>No overrides</span>
                    )}
                  </div>
                </div>

                <div className={styles.sectionHeaderRight}>
                  <ChevronDown
                    size={18}
                    className={`${styles.chevron} ${
                      isOpen ? styles.chevronOpen : ""
                    }`}
                  />
                </div>
              </button>

              <div id={panelId} className={styles.panelOuter} data-open={isOpen}>
                <div className={styles.panelInner}>
                  <div className={styles.tableCard}>
                    <div className={styles.tableWrap}>
                      <table className={styles.table}>
                        <thead>
                          <tr>
                            <th className={styles.colKey}>Key</th>
                            <th className={styles.colPreview}>Preview (EN)</th>
                            <th className={styles.colActions}>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {rows.map((r) => (
                            <tr key={r.key} className={styles.row}>
                              <td className={styles.cellKey}>
                                <div className={styles.keyTop}>
                                  <span className={styles.key}>{r.key}</span>
                                  <span className={styles.badges}>
                                    {hasOverrides(r) ? (
                                      <span className={styles.badge}>Overridden</span>
                                    ) : null}
                                  </span>
                                </div>
                              </td>

                              <td className={styles.cellPreview}>
                                <p className={styles.previewText}>{r.values.en}</p>
                              </td>

                              <td className={styles.cellActions}>
                                <button
                                  type="button"
                                  className={styles.iconBtn}
                                  onClick={() => openEdit(r)}
                                  aria-label="Edit text"
                                >
                                  <Edit2 size={16} />
                                </button>
                              </td>
                            </tr>
                          ))}

                          {rows.length === 0 && (
                            <tr>
                              <td colSpan={3} className={styles.empty}>
                                No items found in this section.
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  <div className={styles.sectionFooterNote}>
                    Tip: overrides update the live site instantly. Clear a field to revert to the default copy.
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Portal modal */}
      {modal}
    </div>
  );
}
