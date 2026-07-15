"use client";

import { useEffect, useState, type RefObject } from "react";

const DURATIONS = ["1.1s", "1.5s", "1.9s", "1.3s", "1.7s"];

type Line = { d: string; color: string; duration: string };

export default function FlowLines({
  containerRef,
  originRef,
  targets,
  fallbackRef,
  fallbackColors,
  flowing,
  recomputeKey,
}: {
  containerRef: RefObject<HTMLElement | null>;
  originRef: RefObject<HTMLElement | null>;
  targets: { elsRef: RefObject<(HTMLElement | null)[]>; colors: string[] } | null;
  fallbackRef: RefObject<HTMLElement | null>;
  fallbackColors: string[];
  flowing: boolean;
  recomputeKey: string;
}) {
  const [box, setBox] = useState({ width: 0, height: 0 });
  const [lines, setLines] = useState<Line[]>([]);

  useEffect(() => {
    const recompute = () => {
      const container = containerRef.current;
      const origin = originRef.current;
      if (!container || !origin) return;

      const cRect = container.getBoundingClientRect();
      const oRect = origin.getBoundingClientRect();
      const ox = oRect.left - cRect.left;
      const oy = oRect.top + oRect.height / 2 - cRect.top;

      // real targets (one per issue card) when we have them; otherwise split
      // the placeholder box into evenly-spaced points as an ambient default.
      const points: { y: number; color: string }[] = [];
      if (targets && targets.colors.length > 0) {
        targets.colors.forEach((color, i) => {
          const el = targets.elsRef.current[i];
          if (!el) return;
          const r = el.getBoundingClientRect();
          points.push({ y: r.top + r.height / 2 - cRect.top, color });
        });
      } else if (fallbackRef.current) {
        const r = fallbackRef.current.getBoundingClientRect();
        const n = fallbackColors.length;
        fallbackColors.forEach((color, i) => {
          const y = r.top + ((i + 1) * r.height) / (n + 1) - cRect.top;
          points.push({ y, color });
        });
      }

      const firstTargetEl = targets && targets.colors.length > 0 ? targets.elsRef.current[0] : null;
      const targetX = (firstTargetEl ?? fallbackRef.current)?.getBoundingClientRect().left ?? cRect.right;
      const relTargetX = targetX - cRect.left;

      const next = points.map((p, i) => {
        const bend = ox + (relTargetX - ox) * 0.4;
        return {
          d: `M${ox},${oy} C${bend},${oy} ${bend},${p.y} ${relTargetX},${p.y}`,
          color: p.color,
          duration: DURATIONS[i % DURATIONS.length],
        };
      });

      setBox({ width: cRect.width, height: cRect.height });
      setLines(next);
    };

    recompute();
    const ro = new ResizeObserver(recompute);
    if (containerRef.current) ro.observe(containerRef.current);
    window.addEventListener("resize", recompute);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", recompute);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [recomputeKey]);

  return (
    <svg
      className="pointer-events-none absolute inset-0 transition-opacity duration-500"
      width={box.width}
      height={box.height}
      style={{ opacity: flowing ? 1 : 0.25 }}
      aria-hidden="true"
    >
      {lines.map((line, i) => (
        <path key={i} className="flow-path" d={line.d} style={{ stroke: line.color, animationDuration: line.duration }} />
      ))}
    </svg>
  );
}
