"use client";

import * as React from "react";
import { Check, ChevronDown, X } from "lucide-react";

import { cn } from "@/lib/utils";

type MultiSelectOption = {
  label: string;
  value: string;
};

type MultiSelectProps = {
  name: string;
  options: MultiSelectOption[];
  value: string[];
  onValueChange: (value: string[]) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
};

export function MultiSelect({
  name,
  options,
  value,
  onValueChange,
  placeholder = "Select options",
  disabled = false,
  className,
}: MultiSelectProps) {
  const [open, setOpen] = React.useState(false);
  const containerRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    function handlePointerDown(event: PointerEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
      }
    }

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  function toggleValue(optionValue: string) {
    if (value.includes(optionValue)) {
      onValueChange(value.filter((item) => item !== optionValue));
      return;
    }

    onValueChange([...value, optionValue]);
  }

  const selectedOptions = options.filter((option) => value.includes(option.value));

  return (
    <div ref={containerRef} className={cn("relative w-full", className)}>
      {value.map((selectedValue) => (
        <input key={selectedValue} type="hidden" name={name} value={selectedValue} />
      ))}

      <button
        type="button"
        disabled={disabled}
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((current) => !current)}
        className={cn(
          "flex min-h-9 w-full items-center justify-between rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm",
          "focus:outline-none focus:ring-1 focus:ring-ring",
          "disabled:cursor-not-allowed disabled:opacity-50",
        )}
      >
        <div className="flex min-w-0 flex-1 flex-wrap gap-1 text-left">
          {selectedOptions.length === 0 ? (
            <span className="text-muted-foreground">{placeholder}</span>
          ) : (
            selectedOptions.map((option) => (
              <span
                key={option.value}
                className="inline-flex items-center gap-1 rounded-md bg-muted px-2 py-0.5 text-xs"
              >
                {option.label}

                <span
                  role="button"
                  tabIndex={0}
                  aria-label={`Remove ${option.label}`}
                  onClick={(event) => {
                    event.stopPropagation();
                    toggleValue(option.value);
                  }}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === " ") {
                      event.preventDefault();
                      event.stopPropagation();
                      toggleValue(option.value);
                    }
                  }}
                  className="rounded-sm opacity-70 hover:opacity-100"
                >
                  <X className="h-3 w-3" />
                </span>
              </span>
            ))
          )}
        </div>

        <ChevronDown
          className={cn(
            "ml-2 h-4 w-4 shrink-0 opacity-50 transition-transform",
            open && "rotate-180",
          )}
        />
      </button>

      {open && (
        <div
          role="listbox"
          aria-multiselectable="true"
          className="absolute z-50 mt-1 max-h-64 w-full overflow-y-auto rounded-md border bg-popover p-1 text-popover-foreground shadow-md"
        >
          {options.map((option) => {
            const selected = value.includes(option.value);

            return (
              <button
                key={option.value}
                type="button"
                role="option"
                aria-selected={selected}
                onClick={() => toggleValue(option.value)}
                className={cn(
                  "flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-left text-sm",
                  "hover:bg-accent hover:text-accent-foreground",
                  "focus:bg-accent focus:text-accent-foreground focus:outline-none",
                )}
              >
                <span
                  className={cn(
                    "flex h-4 w-4 shrink-0 items-center justify-center rounded-sm border",
                    selected && "bg-primary text-primary-foreground",
                  )}
                >
                  {selected && <Check className="h-3 w-3" />}
                </span>

                <span>{option.label}</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
