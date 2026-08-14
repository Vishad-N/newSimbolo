"use client";

import { useEffect, useRef, useState } from "react";
import { Check, ChevronDown, Image as ImageIcon } from "lucide-react";
import { PACKAGE_ILLUSTRATION_OPTIONS } from "./packageIllustrations";

interface PackageIllustrationSelectProps {
  value: string;
  onChange: (value: string) => void;
}

export function PackageIllustrationSelect({ value, onChange }: PackageIllustrationSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const selectedIllustration = PACKAGE_ILLUSTRATION_OPTIONS.find((illustration) => illustration.path === value);

  useEffect(() => {
    const handlePointerDown = (event: PointerEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("pointerdown", handlePointerDown);
    return () => document.removeEventListener("pointerdown", handlePointerDown);
  }, []);

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        onClick={() => setIsOpen((currentValue) => !currentValue)}
        onKeyDown={(event) => {
          if (event.key === "Escape") setIsOpen(false);
          if (event.key === "ArrowDown") setIsOpen(true);
        }}
        className="flex w-full items-center justify-between gap-3 rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-left text-sm text-white outline-none transition-colors hover:border-primary/40 hover:bg-white/10 focus:border-primary focus:ring-2 focus:ring-primary/20"
      >
        <span className="flex min-w-0 items-center gap-3">
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
            <ImageIcon className="h-4 w-4" aria-hidden="true" />
          </span>
          <span className={selectedIllustration ? "truncate" : "truncate text-gray-400"}>
            {selectedIllustration?.label || "Select an existing illustration"}
          </span>
        </span>
        <ChevronDown className={`h-4 w-4 shrink-0 text-gray-400 transition-transform ${isOpen ? "rotate-180" : ""}`} aria-hidden="true" />
      </button>

      {isOpen && (
        <div
          role="listbox"
          aria-label="Package illustration"
          className="custom-scrollbar absolute bottom-full left-0 right-0 z-30 mb-2 max-h-56 overflow-y-auto rounded-lg border border-white/10 bg-background p-1.5 shadow-2xl shadow-black/50"
        >
          {PACKAGE_ILLUSTRATION_OPTIONS.map((illustration) => {
            const isSelected = illustration.path === value;
            return (
              <button
                key={illustration.path}
                type="button"
                role="option"
                aria-selected={isSelected}
                onClick={() => {
                  onChange(illustration.path);
                  setIsOpen(false);
                }}
                className={`flex w-full items-center justify-between rounded-md px-3 py-2.5 text-left text-sm transition-colors ${
                  isSelected ? "bg-primary/15 text-primary" : "text-gray-300 hover:bg-white/5 hover:text-white"
                }`}
              >
                <span className="truncate">{illustration.label}</span>
                {isSelected && <Check className="h-4 w-4 shrink-0" aria-hidden="true" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
