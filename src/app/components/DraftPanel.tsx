// The Drafts panel: preview addresses only. Switches for the draft looks, so each can be seen on
// and off, and the way into the hidden store.
import { useState } from "react";
import { Link } from "react-router";
import { setDraft, useDrafts, type DraftKey } from "../lib/drafts";

const SWITCHES: { key: DraftKey; label: string }[] = [
  { key: "grain", label: "Film grain" },
  { key: "rough", label: "Rough edges" },
];

export function DraftPanel() {
  const d = useDrafts();
  const [open, setOpen] = useState(false);
  return (
    <div className={"s-drafts" + (open ? " open" : "")}>
      <button type="button" className="s-btn s-drafts-btn" aria-expanded={open} aria-controls="s-drafts-list" onClick={() => setOpen((o) => !o)}>
        Drafts {open ? "−" : "+"}
      </button>
      {open && (
        <div className="s-drafts-list" id="s-drafts-list">
          <p className="s-mono">Only on preview links</p>
          {SWITCHES.map((s) => (
            <label key={s.key} className="s-ms-opt">
              <input type="checkbox" checked={d[s.key]} onChange={(e) => setDraft(s.key, e.currentTarget.checked)} />
              <span>{s.label}</span>
            </label>
          ))}
          <Link className="s-btn" to="/store" onClick={() => setOpen(false)}>
            Store (hidden) ↗
          </Link>
        </div>
      )}
    </div>
  );
}
