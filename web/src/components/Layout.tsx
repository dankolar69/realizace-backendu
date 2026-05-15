import { NavLink, Outlet, Link, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import { useTheme } from "../hooks/useTheme";

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  [
    "px-3 py-1.5 rounded-md text-sm font-medium transition-colors",
    isActive
      ? "bg-navy-10 text-navy"
      : "text-navy-60 hover:text-navy hover:bg-grey",
  ].join(" ");

const mobileNavLinkClass = ({ isActive }: { isActive: boolean }) =>
  [
    "block w-full px-4 py-3 rounded-lg text-base font-medium transition-colors",
    isActive
      ? "bg-navy-10 text-navy"
      : "text-navy-70 hover:text-navy hover:bg-grey",
  ].join(" ");

function LanguageSwitcher() {
  const { i18n, t } = useTranslation();
  const current = i18n.resolvedLanguage ?? i18n.language;
  const langs = [
    { code: "en", label: "EN" },
    { code: "cs", label: "CS" },
  ] as const;
  const activeIndex = Math.max(
    0,
    langs.findIndex((l) => l.code === current),
  );

  function setLang(lng: string) {
    void i18n.changeLanguage(lng);
    localStorage.setItem("locale", lng);
  }

  return (
    <div
      role="radiogroup"
      aria-label={t("common.language")}
      className="relative inline-flex items-center h-9 rounded-lg border border-border bg-white p-0.5"
    >
      <span
        aria-hidden="true"
        className="absolute top-0.5 bottom-0.5 left-0.5 rounded-md bg-navy transition-transform duration-300 ease-out"
        style={{
          width: "calc(50% - 2px)",
          transform: `translateX(${activeIndex * 100}%)`,
        }}
      />
      {langs.map((l) => {
        const active = l.code === current;
        return (
          <button
            key={l.code}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => setLang(l.code)}
            className={`relative z-10 h-full px-3 inline-flex items-center justify-center rounded-md text-sm font-semibold transition-colors duration-200 ${
              active ? "text-white" : "text-navy-60 hover:text-navy"
            }`}
            style={{ minWidth: "2.5rem" }}
          >
            {l.label}
          </button>
        );
      })}
    </div>
  );
}

function ThemeToggle() {
  const { t } = useTranslation();
  const [theme, setTheme] = useTheme();
  const isDark = theme === "dark";
  return (
    <button
      type="button"
      role="switch"
      aria-checked={isDark}
      aria-label={t("common.toggleDarkMode")}
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="relative inline-flex h-9 w-16 items-center rounded-full border border-border bg-white transition-colors duration-300"
    >
      <span
        aria-hidden="true"
        className="absolute top-0.5 left-0.5 h-7 w-7 rounded-full bg-navy shadow-sm transition-transform duration-300 ease-out"
        style={{ transform: isDark ? "translateX(28px)" : "translateX(0)" }}
      />
      <span
        aria-hidden="true"
        className="absolute left-2 top-1/2 -translate-y-1/2 z-10 flex items-center justify-center"
      >
        <SunIcon
          className={`h-4 w-4 transition-colors duration-300 ${
            isDark ? "text-navy-40" : "text-white"
          }`}
        />
      </span>
      <span
        aria-hidden="true"
        className="absolute right-2 top-1/2 -translate-y-1/2 z-10 flex items-center justify-center"
      >
        <MoonIcon
          className={`h-4 w-4 transition-colors duration-300 ${
            isDark ? "text-black" : "text-navy-40"
          }`}
        />
      </span>
    </button>
  );
}

function HamburgerButton({
  open,
  onClick,
  label,
}: {
  open: boolean;
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      aria-expanded={open}
      className="relative inline-flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-white transition-colors hover:bg-grey md:hidden"
    >
      <span className="relative block h-5 w-5">
        <span
          className="absolute left-0 top-1 block h-0.5 w-5 rounded bg-navy transition-transform duration-300 ease-out"
          style={{ transform: open ? "translateY(7px) rotate(45deg)" : "none" }}
        />
        <span
          className="absolute left-0 top-1/2 -translate-y-1/2 block h-0.5 w-5 rounded bg-navy transition-opacity duration-200"
          style={{ opacity: open ? 0 : 1 }}
        />
        <span
          className="absolute left-0 bottom-1 block h-0.5 w-5 rounded bg-navy transition-transform duration-300 ease-out"
          style={{
            transform: open ? "translateY(-7px) rotate(-45deg)" : "none",
          }}
        />
      </span>
    </button>
  );
}

function SunIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 16 16" fill="none" aria-hidden="true" {...props}>
      <circle cx="8" cy="8" r="3" fill="currentColor" />
      <g stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
        <path d="M8 1.5v1.5" />
        <path d="M8 13v1.5" />
        <path d="M1.5 8h1.5" />
        <path d="M13 8h1.5" />
        <path d="M3.4 3.4l1.05 1.05" />
        <path d="M11.55 11.55l1.05 1.05" />
        <path d="M3.4 12.6l1.05-1.05" />
        <path d="M11.55 4.45l1.05-1.05" />
      </g>
    </svg>
  );
}

function MoonIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 16 16" fill="none" aria-hidden="true" {...props}>
      <path
        d="M13.5 9.5a5.5 5.5 0 01-7-7 5.5 5.5 0 107 7z"
        fill="currentColor"
      />
    </svg>
  );
}

export default function Layout() {
  const { t } = useTranslation();
  const [theme] = useTheme();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const location = useLocation();
  const logoSrc =
    theme === "dark" ? "/sharemind-logo-dark.svg" : "/sharemind-logo.svg";

  useEffect(() => {
    setDrawerOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (drawerOpen) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = prev;
      };
    }
  }, [drawerOpen]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setDrawerOpen(false);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <div className="min-h-full flex flex-col bg-white">
      <header className="bg-white/90 backdrop-blur border-b border-border sticky top-0 z-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-3">
          <Link
            to="/"
            className="flex items-center hover:no-underline shrink-0"
          >
            <img
              key={theme}
              src={logoSrc}
              alt="ShareMind"
              className="h-10 sm:h-14 w-auto transition-opacity duration-300"
            />
          </Link>

          <nav className="hidden md:flex items-center gap-2">
            <NavLink to="/" end className={navLinkClass}>
              {t("nav.articles")}
            </NavLink>
            <NavLink to="/topics" className={navLinkClass}>
              {t("nav.topics")}
            </NavLink>
            <NavLink
              to="/articles/new"
              className="btn-brand ml-1 inline-flex items-center gap-1 h-9 rounded-lg px-3.5 text-sm font-medium shadow-sm transition"
            >
              {t("nav.newArticle")}
            </NavLink>
            <div className="ml-1 flex items-center gap-2">
              <LanguageSwitcher />
              <ThemeToggle />
            </div>
          </nav>

          <HamburgerButton
            open={drawerOpen}
            onClick={() => setDrawerOpen((o) => !o)}
            label={t("nav.menu")}
          />
        </div>
      </header>

      <div
        aria-hidden="true"
        onClick={() => setDrawerOpen(false)}
        className={`fixed inset-0 z-30 bg-navy/40 backdrop-blur-sm transition-opacity duration-300 md:hidden ${
          drawerOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      />
      <aside
        role="dialog"
        aria-modal="true"
        aria-label={t("nav.menu")}
        className={`fixed top-0 right-0 z-40 h-full w-80 max-w-[85vw] bg-white shadow-2xl flex flex-col transition-transform duration-300 ease-out md:hidden ${
          drawerOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <img
            key={theme}
            src={logoSrc}
            alt="ShareMind"
            className="h-10 w-auto"
          />
          <button
            type="button"
            onClick={() => setDrawerOpen(false)}
            aria-label={t("nav.close")}
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-white text-navy-70 transition-colors hover:bg-grey"
          >
            <svg
              viewBox="0 0 16 16"
              className="h-4 w-4"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M4 4l8 8M12 4l-8 8"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>

        <nav className="flex-1 px-4 py-4 flex flex-col gap-1 overflow-y-auto">
          <NavLink to="/" end className={mobileNavLinkClass}>
            {t("nav.articles")}
          </NavLink>
          <NavLink to="/topics" className={mobileNavLinkClass}>
            {t("nav.topics")}
          </NavLink>
          <NavLink
            to="/articles/new"
            className="btn-brand mt-3 inline-flex items-center justify-center gap-1 rounded-lg px-4 py-3 text-base font-medium shadow-sm transition"
          >
            {t("nav.newArticle")}
          </NavLink>
        </nav>

        <div className="px-5 py-4 border-t border-border flex items-center justify-between gap-3">
          <LanguageSwitcher />
          <ThemeToggle />
        </div>
      </aside>

      <main className="flex-1 w-full max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-10">
        <Outlet />
      </main>
      <footer className="border-t border-border bg-white text-center text-xs text-navy-50 py-5 px-4">
        {t("footer")}
      </footer>
    </div>
  );
}
