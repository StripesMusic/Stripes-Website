import { LOGO_PATHS, LOGO_W, LOGO_H } from "./home/logoPaths";

export function StripesMark({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox={`0 0 ${LOGO_W} ${LOGO_H}`} fill="currentColor" aria-hidden="true">
      {LOGO_PATHS.map((d, i) => (
        <path key={i} d={d} />
      ))}
    </svg>
  );
}
