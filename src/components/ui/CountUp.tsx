"use client";

import { useRef, useEffect, useState } from "react";

interface Props {
  target: number;
  duration?: number; // ms
  suffix?: string;
  prefix?: string;
  className?: string;
  /** Decimales a mostrar (con coma, estilo es-ES). 0 = entero. */
  decimals?: number;
}

export default function CountUp({
  target,
  duration = 1800,
  suffix = "",
  prefix = "",
  className = "",
  decimals = 0,
}: Props) {
  const ref = useRef<HTMLSpanElement>(null);
  // Inicia en `target` para que el HTML del servidor (y los buscadores / sin JS)
  // muestren ya el numero real. La animacion en cliente reinicia desde 0 al
  // entrar en viewport. Si el JS o el observer no corren, queda el valor real.
  const [value, setValue] = useState(target);
  const started = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          const startTime = performance.now();
          const tick = (now: number) => {
            const elapsed = now - startTime;
            const progress = Math.min(elapsed / duration, 1);
            // easeOutCubic
            const ease = 1 - Math.pow(1 - progress, 3);
            setValue(ease * target);
            if (progress < 1) requestAnimationFrame(tick);
          };
          requestAnimationFrame(tick);
          observer.disconnect();
        }
      },
      { threshold: 0.5 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [target, duration]);

  const shown =
    decimals > 0
      ? value.toFixed(decimals).replace(".", ",")
      : String(Math.round(value));

  return (
    <span ref={ref} className={className}>
      {prefix}{shown}{suffix}
    </span>
  );
}
