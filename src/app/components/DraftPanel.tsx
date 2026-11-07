// The Drafts panel: preview addresses only. The way into the hidden store.
import { useState } from "react";
import { Link } from "react-router";

export function DraftPanel() {
  const [open, setOpen] = useState(false);
  return (
    <div className={"s-drafts" + (open ? " open" : "")}>
      <button type="button" className="s-btn s-drafts-btn" aria-expanded={open} aria-controls="s-drafts-list" onClick={() => setOpen((o) => !o)}>
        Drafts {open ? "−" : "+"}
      </button>
      {open && (
        <div className="s-drafts-list" id="s-drafts-list">
          <p className="s-mono">Only on preview links</p>
          <Link className="s-btn" to="/store" onClick={() => setOpen(false)}>
            Store (hidden) ↗
          </Link>
        </div>
      )}
    </div>
  );
}
