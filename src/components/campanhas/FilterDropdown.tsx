import type { ReactNode } from "react";
import { CheckIcon } from "./icons";

export interface FilterOption<T extends string> {
  value: T;
  label: string;
  icon?: ReactNode;
}

interface FilterDropdownProps<T extends string> {
  options: FilterOption<T>[];
  selected: T;
  onSelect: (value: T) => void;
}

export default function FilterDropdown<T extends string>({
  options,
  selected,
  onSelect,
}: FilterDropdownProps<T>) {
  return (
    <div className="absolute right-0 top-[calc(100%+4px)] z-30 min-w-[220px] overflow-hidden rounded-md border border-[#cacaca] bg-white shadow-lg">
      {options.map((option, i) => {
        const isSelected = option.value === selected;
        return (
          <button
            key={option.value}
            type="button"
            onClick={() => onSelect(option.value)}
            className={`flex h-[45px] w-full items-center justify-between gap-2 px-4 py-3 text-left text-sm leading-[17px] transition-colors hover:bg-[#e6f3ea] ${
              i % 2 === 1 ? "bg-[#f5f5f5]" : "bg-white"
            } ${isSelected ? "font-bold text-[#00842f]" : "text-[#4b4b4b]"}`}
          >
            <span className="flex items-center gap-2">
              {option.icon}
              {option.label}
            </span>
            {isSelected && <CheckIcon size={16} className="text-[#00842f]" />}
          </button>
        );
      })}
    </div>
  );
}
