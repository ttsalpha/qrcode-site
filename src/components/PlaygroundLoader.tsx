"use client";

import type { ComponentType } from "react";
import { useEffect, useRef, useState } from "react";

let cached: ComponentType | null = null;

export default function PlaygroundLoader() {
  const ref = useRef<HTMLDivElement>(null);
  const [Component, setComponent] = useState<ComponentType | null>(
    () => cached,
  );

  useEffect(() => {
    if (cached) {
      setComponent(() => cached);
      return;
    }
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          observer.disconnect();
          import("./Playground").then((m) => {
            cached = m.default;
            setComponent(() => cached);
          });
        }
      },
      { rootMargin: "300px" },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  if (!Component) {
    return (
      <div
        ref={ref}
        style={{
          minHeight: 520,
          borderRadius: 12,
          background: "var(--surface-2)",
        }}
      />
    );
  }

  return <Component />;
}
