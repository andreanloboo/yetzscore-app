import { useState } from "react";
import { ChevronLeftIcon, ChevronRightIcon } from "./icons";

export interface DateRange {
  start: string | null; // ISO yyyy-mm-dd
  end: string | null;
}

interface CalendarPopoverProps {
  range: DateRange;
  onChange: (range: DateRange) => void;
  onClear: () => void;
}

const MONTH_NAMES = [
  "Janeiro",
  "Fevereiro",
  "Março",
  "Abril",
  "Maio",
  "Junho",
  "Julho",
  "Agosto",
  "Setembro",
  "Outubro",
  "Novembro",
  "Dezembro",
];

const WEEKDAYS = ["D", "S", "T", "Q", "Q", "S", "S"];

function toIso(year: number, month: number, day: number): string {
  return `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

export function formatFullDate(iso: string): string {
  const [year, month, day] = iso.split("-");
  return `${day}/${month}/${year}`;
}

export default function CalendarPopover({ range, onChange, onClear }: CalendarPopoverProps) {
  // Junho de 2026 como mês inicial (conforme design)
  const [viewYear, setViewYear] = useState(2026);
  const [viewMonth, setViewMonth] = useState(5);

  const firstWeekday = new Date(viewYear, viewMonth, 1).getDay();
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();

  function prevMonth() {
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear((y) => y - 1);
    } else {
      setViewMonth((m) => m - 1);
    }
  }

  function nextMonth() {
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear((y) => y + 1);
    } else {
      setViewMonth((m) => m + 1);
    }
  }

  function handleDayClick(day: number) {
    const iso = toIso(viewYear, viewMonth, day);
    if (!range.start || (range.start && range.end)) {
      // Inicia uma nova seleção
      onChange({ start: iso, end: null });
    } else if (iso < range.start) {
      onChange({ start: iso, end: range.start });
    } else {
      onChange({ start: range.start, end: iso });
    }
  }

  function dayState(day: number): "start" | "end" | "in-range" | "none" {
    const iso = toIso(viewYear, viewMonth, day);
    if (iso === range.start) return "start";
    if (iso === range.end) return "end";
    if (range.start && range.end && iso > range.start && iso < range.end) return "in-range";
    return "none";
  }

  const cells: (number | null)[] = [
    ...Array.from({ length: firstWeekday }, () => null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  return (
    <div className="absolute right-0 top-[calc(100%+4px)] z-30 w-[312px] rounded-md border border-[#cacaca] bg-white p-4 shadow-lg">
      {/* Cabeçalho: Período selecionado */}
      <div className="flex items-center justify-between border-b border-[#e1e1e1] pb-3">
        <div className="flex flex-col gap-0.5">
          <span className="text-sm font-bold leading-[17px] text-[#00842f]">Período</span>
          <span className="text-sm leading-[17px] text-[#4b4b4b]">
            {range.start ? formatFullDate(range.start) : "--/--/----"}
            {" - "}
            {range.end ? formatFullDate(range.end) : "--/--/----"}
          </span>
        </div>
        <button
          type="button"
          onClick={onClear}
          className="rounded-md px-2 py-1 text-sm font-bold text-[#00842f] transition-colors hover:bg-[#e6f3ea]"
        >
          Limpar
        </button>
      </div>

      {/* Navegação de mês */}
      <div className="flex items-center justify-between py-3">
        <button
          type="button"
          aria-label="Mês anterior"
          onClick={prevMonth}
          className="flex h-8 w-8 items-center justify-center rounded-md border border-[#cacaca] text-[#4b4b4b] transition-colors hover:border-[#00842f] hover:text-[#00842f]"
        >
          <ChevronLeftIcon size={16} />
        </button>
        <span className="text-base font-bold text-[#4b4b4b]">
          {MONTH_NAMES[viewMonth]} {viewYear}
        </span>
        <button
          type="button"
          aria-label="Próximo mês"
          onClick={nextMonth}
          className="flex h-8 w-8 items-center justify-center rounded-md border border-[#cacaca] text-[#4b4b4b] transition-colors hover:border-[#00842f] hover:text-[#00842f]"
        >
          <ChevronRightIcon size={16} />
        </button>
      </div>

      {/* Dias da semana */}
      <div className="grid grid-cols-7">
        {WEEKDAYS.map((d, i) => (
          <span
            key={`${d}-${i}`}
            className="flex h-8 items-center justify-center text-xs font-bold text-[#8e8e8e]"
          >
            {d}
          </span>
        ))}
      </div>

      {/* Grade de dias */}
      <div className="grid grid-cols-7 gap-y-0.5">
        {cells.map((day, i) => {
          if (day === null) return <span key={`empty-${i}`} />;
          const state = dayState(day);
          const isEndpoint = state === "start" || state === "end";
          return (
            <button
              key={day}
              type="button"
              onClick={() => handleDayClick(day)}
              className={`flex h-9 w-full items-center justify-center text-sm transition-colors ${
                isEndpoint
                  ? "rounded-md bg-[#00842f] font-bold text-white"
                  : state === "in-range"
                    ? "bg-[#e6f3ea] text-[#00842f]"
                    : "rounded-md text-[#4b4b4b] hover:bg-[#e6f3ea] hover:text-[#00842f]"
              }`}
            >
              {day}
            </button>
          );
        })}
      </div>
    </div>
  );
}
