"use client";

import { useEffect, useRef, useState } from "react";

type Props = {
  to: number;
  decimals?: number;
  suffix?: string;
  className?: string;
};

export function CountUp({ to, decimals = 0, suffix = "", className }: Props) {
  const ref = useRef<HTMLSpanElement>(null);
  const [value, setValue] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      // Snap to the final value on the next frame (avoids a synchronous
      // setState in the effect body) instead of animating.
      const snap = requestAnimationFrame(() => setValue(to));
      return () => cancelAnimationFrame(snap);
    }

    let raf = 0;
    let start: number | null = null;
    let finished = false;
    const finish = () => {
      finished = true;
      setValue(to);
    };
    // Fallback: converge to the final value even where IntersectionObserver /
    // rAF are throttled or never fire (and never restart once finished).
    const settle = window.setTimeout(finish, 1400);

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting || finished) return;
          io.unobserve(entry.target);
          const step = (t: number) => {
            if (finished) return;
            start = start ?? t;
            const p = Math.min((t - start) / 900, 1);
            const eased = 0.2 + 0.8 * p * (2 - p);
            setValue(to * eased);
            if (p < 1) raf = requestAnimationFrame(step);
            else finish();
          };
          raf = requestAnimationFrame(step);
        });
      },
      { threshold: 0.6 },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
      clearTimeout(settle);
    };
  }, [to]);

  return (
    <span ref={ref} className={className}>
      {value.toFixed(decimals)}
      {suffix}
    </span>
  );
}
