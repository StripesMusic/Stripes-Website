export function Eq({ on = false }: { on?: boolean }) {
  return (
    <span className={"s-eq" + (on ? " on" : "")} aria-hidden="true">
      <i />
      <i />
      <i />
    </span>
  );
}
