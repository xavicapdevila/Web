import { useEffect, useState, type RefObject } from "react";

interface Options {
  /** Trigger once then stop observing (default false). */
  once?: boolean;
  /** IntersectionObserver rootMargin — named `margin` to match framer-motion. */
  margin?: string;
}

/**
 * Lightweight replacement for framer-motion's `useInView`, built on the native
 * IntersectionObserver. Same call signature, so component code is unchanged —
 * but it drops the framer-motion dependency from the bundle.
 */
export function useInView(
  ref: RefObject<Element | null>,
  { once = false, margin = "0px" }: Options = {},
): boolean {
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") {
      setInView(true); // unsupported environment → just show the content
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          if (once) observer.disconnect();
        } else if (!once) {
          setInView(false);
        }
      },
      { rootMargin: margin },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [ref, once, margin]);

  return inView;
}
