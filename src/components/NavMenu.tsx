"use client";

import { useEffect, useRef, useState } from "react";
import { FaGithub } from "react-icons/fa";
import { SiNpm } from "react-icons/si";
import s from "./NavMenu.module.css";
import ThemeToggle from "./ThemeToggle";

export default function NavMenu() {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onHash = () => setOpen(false);
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    const onPointer = (e: PointerEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    window.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onPointer);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onPointer);
    };
  }, [open]);

  return (
    <div ref={rootRef} className={s.root}>
      {/* Text nav links — desktop: inline, mobile: dropdown */}
      <nav className={`${s.links} ${open ? s.open : ""}`}>
        <a href="#playground" className={s.link}>
          Playground
        </a>
        <a href="#api" className={s.link}>
          API
        </a>
        <a href="#examples" className={s.link}>
          Examples
        </a>
        <a href="/benchmark" className={s.link}>
          Benchmark
        </a>
      </nav>

      {/* Icon links — always visible */}
      <a
        href="https://www.npmjs.com/package/@ttsalpha/qrcode"
        target="_blank"
        rel="noopener noreferrer"
        className={s.iconLink}
        aria-label="npm"
      >
        <SiNpm size={20} aria-hidden={true} />
      </a>
      <a
        href="https://github.com/ttsalpha/qrcode"
        target="_blank"
        rel="noopener noreferrer"
        className={s.iconLink}
        aria-label="GitHub"
      >
        <FaGithub size={20} aria-hidden={true} />
      </a>
      <ThemeToggle />

      {/* Hamburger button — mobile only */}
      <button
        type="button"
        className={s.hamburger}
        onClick={() => setOpen((o) => !o)}
        aria-label={open ? "Close menu" : "Open menu"}
        aria-expanded={open}
      >
        <span className={`${s.bar} ${open ? s.bar1Open : ""}`} />
        <span className={`${s.bar} ${open ? s.bar2Open : ""}`} />
        <span className={`${s.bar} ${open ? s.bar3Open : ""}`} />
      </button>
    </div>
  );
}
