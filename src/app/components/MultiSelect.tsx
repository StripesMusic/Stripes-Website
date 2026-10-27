// A filter dropdown with a checkbox per option: the button shows how many are ticked, the list
// closes on Escape, a click outside or tabbing away, and focus goes back to the button.
import { useEffect, useId, useRef, useState } from "react";

type Props = { label: string; options: string[]; selected: string[]; onChange: (next: string[]) => void; show?: (o: string) => string };

export function MultiSelect({ label, options, selected, onChange, show = (o) => o }: Props) {
  const [open, setOpen] = useState(false);
  const box = useRef<HTMLDivElement>(null);
  const btn = useRef<HTMLButtonElement>(null);
  const id = useId();

  useEffect(() => {
    if (!open) return;
    const away = (e: PointerEvent) => !box.current?.contains(e.target as Node) && setOpen(false);
    const esc = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      e.preventDefault();
      setOpen(false);
      btn.current?.focus();
    };
    document.addEventListener("pointerdown", away);
    document.addEventListener("keydown", esc);
    box.current?.querySelector("input")?.focus();
    return () => {
      document.removeEventListener("pointerdown", away);
      document.removeEventListener("keydown", esc);
    };
  }, [open]);

  const toggle = (o: string) => onChange(selected.includes(o) ? selected.filter((x) => x !== o) : [...selected, o]);

  return (
    <div className="s-ms" ref={box} onBlur={(e) => open && !box.current?.contains(e.relatedTarget as Node) && setOpen(false)}>
      <button ref={btn} type="button" className="s-btn s-ms-btn" aria-expanded={open} aria-controls={id} aria-pressed={selected.length > 0} onClick={() => setOpen((o) => !o)}>
        {label}
        {selected.length > 0 && <span className="s-ms-count">{selected.length}</span>}
        <span className="s-ms-caret" aria-hidden="true" />
      </button>
      {open && (
        <fieldset className="s-ms-list" id={id}>
          <legend className="s-vh">{label}</legend>
          {options.map((o) => (
            <label key={o} className="s-ms-opt">
              <input type="checkbox" checked={selected.includes(o)} onChange={() => toggle(o)} />
              <span>{show(o)}</span>
            </label>
          ))}
        </fieldset>
      )}
    </div>
  );
}
