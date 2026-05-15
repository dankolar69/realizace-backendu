import { useSyncExternalStore } from "react";

export type Theme = "light" | "dark";

function readInitial(): Theme {
  if (typeof document === "undefined") return "light";
  return document.documentElement.classList.contains("dark") ? "dark" : "light";
}

let current: Theme = readInitial();
const listeners = new Set<() => void>();

function subscribe(cb: () => void) {
  listeners.add(cb);
  return () => {
    listeners.delete(cb);
  };
}

function getSnapshot(): Theme {
  return current;
}

function setTheme(next: Theme) {
  if (next === current) return;
  current = next;
  const root = document.documentElement;
  if (next === "dark") root.classList.add("dark");
  else root.classList.remove("dark");
  try {
    localStorage.setItem("theme", next);
  } catch {
    /* ignore */
  }
  listeners.forEach((l) => l());
}

export function useTheme(): [Theme, (next: Theme) => void] {
  const theme = useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
  return [theme, setTheme];
}
