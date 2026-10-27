import { useLayoutEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useLocation } from "react-router";
import { whenReady } from "../lib/intro";
import { slideIn } from "../lib/slideIn";

// Opacity only on the wrapper: a transform or filter here would break the pinned and fixed parts
// of pages. The new page's own elements slide in instead (lib/slideIn.ts).
export function PageTransition({ children }: { children: React.ReactNode }) {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
      >
        <SlideIn path={location.pathname}>{children}</SlideIn>
      </motion.div>
    </AnimatePresence>
  );
}

function SlideIn({ path, children }: { path: string; children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  // before the first paint, so nothing shows in place and then jumps; the old page has faded out
  // by now, so this is when to go back to the top
  useLayoutEffect(() => {
    scrollTo(0, 0);
    return whenReady(() => ref.current && slideIn(ref.current, path));
  }, [path]);
  return <div ref={ref}>{children}</div>;
}
