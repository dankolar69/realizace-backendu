import { useEffect, useLayoutEffect, useRef, useState } from "react";
import type { ComponentType, SVGProps } from "react";

export type SelectOption = {
  value: string;
  label: string;
};

type Props = {
  label: string;
  options: ReadonlyArray<SelectOption>;
  selected: string;
  onChange: (next: string) => void;
  icon?: ComponentType<SVGProps<SVGSVGElement>>;
  ariaLabel?: string;
  allOptionLabel?: string;
};

const DROPDOWN_WIDTH = 240;
const VIEWPORT_MARGIN = 16;

export default function SelectFilter({
  label,
  options,
  selected,
  onChange,
  icon: Icon,
  ariaLabel,
  allOptionLabel = "All",
}: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [alignRight, setAlignRight] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  useLayoutEffect(() => {
    if (!isOpen || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const wouldOverflow =
      rect.left + DROPDOWN_WIDTH > window.innerWidth - VIEWPORT_MARGIN;
    setAlignRight(wouldOverflow);
  }, [isOpen]);

  const isActive = selected !== "";
  const selectedLabel = options.find((o) => o.value === selected)?.label;
  const triggerText = isActive ? `${label}: ${selectedLabel}` : label;

  const triggerColorClass = isActive
    ? "border-navy text-navy-100"
    : "border-border text-navy-50";
  const iconColorClass = isActive ? "text-navy-100" : "text-navy-50";

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setIsOpen((p) => !p)}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-label={ariaLabel ?? label}
        className={`inline-flex items-center gap-2 rounded-lg border bg-white py-2.5 pl-3.5 pr-3 text-sm font-normal leading-[1.4] transition focus:outline-none focus:ring-2 focus:ring-navy-10 ${triggerColorClass}`}
      >
        {Icon ? (
          <Icon className={`h-4 w-4 ${iconColorClass}`} aria-hidden="true" />
        ) : null}
        <span>{triggerText}</span>
        <svg
          className={`h-4 w-4 transition-transform ${iconColorClass} ${
            isOpen ? "rotate-180" : ""
          }`}
          viewBox="0 0 16 16"
          fill="none"
          aria-hidden="true"
        >
          <path
            d="M4 6l4 4 4-4"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
      {isOpen ? (
        <div
          role="listbox"
          className={`absolute z-40 mt-2 max-h-72 w-60 overflow-y-auto rounded-lg border border-border bg-white shadow-lg ${
            alignRight ? "right-0" : "left-0"
          }`}
        >
          {options.length === 0 ? (
            <p className="px-4 py-3 text-sm text-navy-50">No options</p>
          ) : (
            <ul className="py-1">
              <li>
                <button
                  type="button"
                  role="option"
                  aria-selected={!isActive}
                  onClick={() => {
                    onChange("");
                    setIsOpen(false);
                  }}
                  className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-navy-100 transition hover:bg-grey"
                >
                  <span
                    className={`flex h-4 w-4 shrink-0 items-center justify-center rounded border ${
                      !isActive
                        ? "border-navy bg-navy text-white"
                        : "border-border text-transparent"
                    }`}
                    aria-hidden="true"
                  >
                    <svg
                      viewBox="0 0 16 16"
                      className="h-3 w-3"
                      fill="none"
                    >
                      <path
                        d="M3.5 8.5l3 3 6-6"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>
                  <span className="truncate">{allOptionLabel}</span>
                </button>
              </li>
              {options.map((option) => {
                const checked = selected === option.value;
                return (
                  <li key={option.value}>
                    <button
                      type="button"
                      role="option"
                      aria-selected={checked}
                      onClick={() => {
                        onChange(option.value);
                        setIsOpen(false);
                      }}
                      className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-navy-100 transition hover:bg-grey"
                    >
                      <span
                        className={`flex h-4 w-4 shrink-0 items-center justify-center rounded border ${
                          checked
                            ? "border-navy bg-navy text-white"
                            : "border-border text-transparent"
                        }`}
                        aria-hidden="true"
                      >
                        <svg
                          viewBox="0 0 16 16"
                          className="h-3 w-3"
                          fill="none"
                        >
                          <path
                            d="M3.5 8.5l3 3 6-6"
                            stroke="currentColor"
                            strokeWidth="2.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </span>
                      <span className="truncate">{option.label}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      ) : null}
    </div>
  );
}
