"use client";

import { useEffect, useState } from "react";
import { IoMoonOutline, IoSunnyOutline } from "react-icons/io5";
import { TbSunMoon } from "react-icons/tb";
import s from "./ThemeToggle.module.css";

type Theme = "system" | "light" | "dark";

const CYCLE: Theme[] = ["system", "light", "dark"];

const ICONS: Record<Theme, React.ReactNode> = {
  system: <TbSunMoon size={18} />,
  light: <IoSunnyOutline size={17} />,
  dark: <IoMoonOutline size={17} />,
};

const LABELS: Record<Theme, string> = {
  system: "System theme",
  light: "Light theme",
  dark: "Dark theme",
};

async function setThemeCookie(value: "light" | "dark" | null) {
  if ("cookieStore" in window) {
    if (value) {
      await window.cookieStore.set({
        name: "theme",
        value,
        expires: Date.now() + 365 * 24 * 60 * 60 * 1000,
        path: "/",
      });
    } else {
      await window.cookieStore.delete({ name: "theme", path: "/" });
    }
  } else {
    // biome-ignore lint/suspicious/noDocumentCookie: fallback for browsers without Cookie Store API
    document.cookie = value
      ? `theme=${value}; max-age=31536000; path=/`
      : "theme=; max-age=0; path=/";
  }
}

function readThemeCookie(): Theme {
  const match = document.cookie.match(/(?:^|;\s*)theme=(light|dark)/);
  return (match?.[1] as Theme) ?? "system";
}

export default function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>("system");

  useEffect(() => {
    setTheme(readThemeCookie());
  }, []);

  function toggle() {
    const next = CYCLE[(CYCLE.indexOf(theme) + 1) % CYCLE.length];
    setTheme(next);
    if (next === "system") {
      setThemeCookie(null);
      document.documentElement.removeAttribute("data-theme");
    } else {
      setThemeCookie(next);
      document.documentElement.setAttribute("data-theme", next);
    }
  }

  return (
    <button
      type="button"
      className={s.btn}
      onClick={toggle}
      aria-label={LABELS[theme]}
      title={LABELS[theme]}
    >
      {ICONS[theme]}
    </button>
  );
}
