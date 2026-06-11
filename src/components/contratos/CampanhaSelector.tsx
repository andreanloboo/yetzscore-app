import { useEffect, useRef, useState } from "react";
import type { KeyboardEvent } from "react";
import { CAMPAIGN_TYPE_LABELS, type Campanha } from "./types";

// ─── Status pill (Ativo verde claro / Inativo cinza) ─────────────────────────
function StatusPill({ status }: { status: Campanha["status"] }) {
  return status === "Ativo" ? (
    <span className="shrink-0 rounded-md bg-[#dcfce7] px-2 py-1 text-sm leading-[17px] text-[#22c55e]">
      Ativo
    </span>
  ) : (
    <span className="shrink-0 rounded-md bg-[#eee] px-2 py-1 text-sm leading-[17px] text-[#8e8e8e]">
      Inativo
    </span>
  );
}

// ─── Combobox de campanha (nome + badge + × + chevron) ───────────────────────
export interface CampanhaSelectorProps {
  campanhas: Campanha[];
  selected: Campanha | null;
  onSelect: (campanha: Campanha) => void;
  onClear: () => void;
}

const normalise = (s: string) =>
  s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();

export default function CampanhaSelector({
  campanhas,
  selected,
  onSelect,
  onClear,
}: CampanhaSelectorProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const rootRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  function close() {
    setOpen(false);
    setQuery("");
  }

  // Click-away + Escape fecham o dropdown
  useEffect(() => {
    if (!open) return;
    function onMouse(e: MouseEvent) {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        setOpen(false);
        setQuery("");
      }
    }
    function onKey(e: globalThis.KeyboardEvent) {
      if (e.key === "Escape") {
        setOpen(false);
        setQuery("");
      }
    }
    document.addEventListener("mousedown", onMouse);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onMouse);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  // Foco automático na busca ao abrir
  useEffect(() => {
    if (open) searchRef.current?.focus();
  }, [open]);

  const q = normalise(query.trim());
  const filtered = q
    ? campanhas.filter((c) => normalise(c.nome).includes(q))
    : campanhas;

  function handleTriggerKey(e: KeyboardEvent<HTMLDivElement>) {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      if (open) close();
      else setOpen(true);
    }
  }

  return (
    <div ref={rootRef} className="relative w-[400px]">
      {/* Trigger */}
      <div
        role="combobox"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label="Selecionar campanha"
        tabIndex={0}
        onClick={() => (open ? close() : setOpen(true))}
        onKeyDown={handleTriggerKey}
        className="flex h-12 w-full cursor-pointer items-center justify-between gap-2 rounded-md border border-[#cacaca] bg-white px-4 py-4 transition-colors duration-150 hover:border-[#8e8e8e] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00842f]/40"
      >
        <div className="flex min-w-0 flex-1 items-center gap-2">
          {selected ? (
            <>
              <span className="truncate text-base text-[#4b4b4b]">{selected.nome}</span>
              <StatusPill status={selected.status} />
            </>
          ) : (
            <span className="truncate text-base text-[#8e8e8e]">Selecionar campanha</span>
          )}
        </div>
        <div className="flex shrink-0 items-center gap-2">
          {selected && (
            <button
              type="button"
              aria-label="Limpar campanha selecionada"
              onClick={(e) => {
                e.stopPropagation();
                onClear();
                close();
              }}
              className="cursor-pointer rounded-sm text-[#8e8e8e] transition-colors duration-150 hover:text-[#4b4b4b] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00842f]/40"
            >
              <svg className="size-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          )}
          <svg
            className={`size-4 text-[#8e8e8e] transition-transform duration-200 ${open ? "rotate-180" : ""}`}
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            viewBox="0 0 24 24"
          >
            <polyline points="6,9 12,15 18,9" />
          </svg>
        </div>
      </div>

      {/* Dropdown */}
      {open && (
        <div className="absolute left-0 top-full z-50 mt-1 w-full origin-top translate-y-0 rounded-md border border-[#cacaca] bg-white opacity-100 shadow-md transition-[opacity,transform] duration-200 ease-out starting:-translate-y-1 starting:opacity-0">
          {/* Busca por digitação */}
          <div className="m-3 mb-1 flex items-center justify-between gap-2 rounded-md border border-[#cacaca] bg-white px-3 py-2">
            <input
              ref={searchRef}
              type="text"
              placeholder="Buscar campanha"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="min-w-0 flex-1 bg-transparent text-sm text-[#4b4b4b] placeholder-[#8e8e8e] outline-none"
            />
            <svg className="size-4 shrink-0 text-[#8e8e8e]" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </div>

          <ul role="listbox" aria-label="Campanhas" className="max-h-72 overflow-y-auto py-1">
            {filtered.map((c) => (
              <li key={c.id}>
                <button
                  type="button"
                  role="option"
                  aria-selected={selected?.id === c.id}
                  onClick={() => {
                    onSelect(c);
                    close();
                  }}
                  className={`flex w-full cursor-pointer flex-col items-start gap-1 px-4 py-3 text-left transition-colors duration-150 hover:bg-[#dffbe8] focus-visible:bg-[#dffbe8] focus-visible:outline-none ${
                    selected?.id === c.id ? "bg-[#dffbe8]" : "bg-white"
                  }`}
                >
                  <span className="flex w-full min-w-0 items-center gap-2">
                    <span className="truncate text-base text-[#4b4b4b]">{c.nome}</span>
                    <StatusPill status={c.status} />
                  </span>
                  <span className="text-xs text-[#8e8e8e]">{CAMPAIGN_TYPE_LABELS[c.tipo]}</span>
                </button>
              </li>
            ))}
            {filtered.length === 0 && (
              <li className="px-4 py-3 text-sm text-[#8e8e8e]">Nenhum resultado encontrado</li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
}
