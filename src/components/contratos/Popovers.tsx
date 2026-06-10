import { useEffect, useRef } from "react";
import type { ReactNode } from "react";

// ─── Generic popover wrapper (positioned absolute, closes on click-away/Esc) ──
interface PopoverProps {
  x: number;
  y: number;
  onClose: () => void;
  children: ReactNode;
}

export function PopoverWrapper({ x, y, onClose, children }: PopoverProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handle(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    }
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("mousedown", handle);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("mousedown", handle);
      document.removeEventListener("keydown", handleKey);
    };
  }, [onClose]);

  // Keep popover within viewport
  const style: React.CSSProperties = {
    position: "fixed",
    top: y,
    left: x,
    zIndex: 60,
  };

  return (
    <div ref={ref} style={style}>
      {children}
    </div>
  );
}

// ─── Actions popover ("...") ────────────────────────────────────────────────
interface AcoesPopoverProps {
  x: number;
  y: number;
  onAprovar: () => void;
  onReprovar: () => void;
  onDesvincular: () => void;
  onVerDetalhes: () => void;
  onClose: () => void;
}

export function AcoesPopover({
  x,
  y,
  onAprovar,
  onReprovar,
  onDesvincular,
  onVerDetalhes,
  onClose,
}: AcoesPopoverProps) {
  return (
    <PopoverWrapper x={x} y={y} onClose={onClose}>
      <div className="flex flex-col gap-4 rounded-md border border-[#cacaca] bg-white p-4 shadow-md">
        <button
          onClick={onAprovar}
          className="flex cursor-pointer items-center gap-2 text-xs text-[#4b4b4b] hover:text-[#00842f]"
        >
          <svg className="size-4 text-[#22c55e]" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="10" />
            <polyline points="8,12 11,15 16,9" />
          </svg>
          Aprovar Contrato
        </button>
        <button
          onClick={onReprovar}
          className="flex cursor-pointer items-center gap-2 text-xs text-[#4b4b4b] hover:text-red-500"
        >
          <svg className="size-4 text-red-500" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="10" />
            <line x1="15" y1="9" x2="9" y2="15" />
            <line x1="9" y1="9" x2="15" y2="15" />
          </svg>
          Reprovar Contrato
        </button>
        <button
          onClick={onDesvincular}
          className="flex cursor-pointer items-center gap-2 text-xs text-[#4b4b4b] hover:text-orange-500"
        >
          <svg className="size-4 text-[#4b4b4b]" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244" />
          </svg>
          Desvincular
        </button>
        <button
          onClick={onVerDetalhes}
          className="flex cursor-pointer items-center gap-2 text-xs text-[#4b4b4b] hover:text-[#00842f]"
        >
          <svg className="size-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
          </svg>
          Ver detalhes
        </button>
      </div>
    </PopoverWrapper>
  );
}

// ─── Ver detalhes (Detalhes cell) popover ────────────────────────────────────
interface VerDetalhesPopoverProps {
  x: number;
  y: number;
  onVerDetalhes: () => void;
  onClose: () => void;
}

export function VerDetalhesPopover({ x, y, onVerDetalhes, onClose }: VerDetalhesPopoverProps) {
  return (
    <PopoverWrapper x={x} y={y} onClose={onClose}>
      <div className="rounded-md border border-[#cacaca] bg-white p-4 shadow-md">
        <button
          onClick={onVerDetalhes}
          className="flex cursor-pointer items-center gap-2 text-xs text-[#4b4b4b] hover:text-[#00842f]"
        >
          <svg className="size-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
          </svg>
          Ver detalhes
        </button>
      </div>
    </PopoverWrapper>
  );
}

// ─── Status filter dropdown ──────────────────────────────────────────────────
type StatusOption = "Todos" | "Aguardando aprovação" | "Aprovado" | "Aguardando vínculo";

const STATUS_OPTIONS: StatusOption[] = [
  "Todos",
  "Aguardando aprovação",
  "Aprovado",
  "Aguardando vínculo",
];

interface StatusDropdownProps {
  x: number;
  y: number;
  current: StatusOption;
  onSelect: (s: StatusOption) => void;
  onClose: () => void;
}

export function StatusDropdown({ x, y, current, onSelect, onClose }: StatusDropdownProps) {
  return (
    <PopoverWrapper x={x} y={y} onClose={onClose}>
      <div className="flex flex-col rounded-md border border-[#cacaca] bg-white py-1 shadow-md">
        {STATUS_OPTIONS.map((opt) => (
          <button
            key={opt}
            onClick={() => { onSelect(opt); onClose(); }}
            className={`cursor-pointer px-4 py-4 text-left text-base text-[#4b4b4b] hover:bg-[#dffbe8] ${current === opt ? "bg-[#dffbe8]" : "bg-white"}`}
          >
            {opt}
          </button>
        ))}
      </div>
    </PopoverWrapper>
  );
}

// ─── User menu popover ────────────────────────────────────────────────────────
interface UserMenuPopoverProps {
  onEditarPerfil: () => void;
  onRecuperarSenha: () => void;
  onSair: () => void;
  onClose: () => void;
}

export function UserMenuPopover({
  onEditarPerfil,
  onRecuperarSenha,
  onSair,
  onClose,
}: UserMenuPopoverProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handle(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    }
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("mousedown", handle);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("mousedown", handle);
      document.removeEventListener("keydown", handleKey);
    };
  }, [onClose]);

  return (
    <div
      ref={ref}
      className="absolute bottom-full left-0 z-60 mb-2 w-52 rounded-md border border-[#cacaca] bg-white shadow-md"
      style={{ zIndex: 60 }}
    >
      {[
        { label: "Editar perfil", action: onEditarPerfil },
        { label: "Recuperar senha", action: onRecuperarSenha },
        { label: "Sair", action: onSair },
      ].map((item) => (
        <button
          key={item.label}
          onClick={() => { item.action(); onClose(); }}
          className="flex w-full cursor-pointer items-center px-4 py-3 text-sm text-[#4b4b4b] hover:bg-[#f5f5f5]"
        >
          {item.label}
        </button>
      ))}
    </div>
  );
}

// ─── Gerentes dropdown ────────────────────────────────────────────────────────
interface GerentesDropdownProps {
  selected: string[];
  onToggle: (id: string) => void;
  onSelecionar: () => void;
  onClose: () => void;
  search: string;
  onSearchChange: (v: string) => void;
}

const GERENTES_OPTS = [
  { id: "kaique", label: "Kaique Atene GC" },
  { id: "maria", label: "Maria GC" },
  { id: "joao", label: "João GC" },
  { id: "junior", label: "Junior GC" },
];

export function GerentesDropdown({
  selected,
  onToggle,
  onSelecionar,
  onClose,
  search,
  onSearchChange,
}: GerentesDropdownProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handle(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    }
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("mousedown", handle);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("mousedown", handle);
      document.removeEventListener("keydown", handleKey);
    };
  }, [onClose]);

  const filtered = GERENTES_OPTS.filter((g) =>
    g.label.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div
      ref={ref}
      className="absolute left-0 top-full z-50 mt-1 w-[328px] rounded-md border border-[#cacaca] bg-white p-4 shadow-md"
      style={{ zIndex: 50 }}
    >
      {/* Selected badges */}
      {selected.length > 0 && (
        <div className="mb-3 flex flex-wrap gap-1">
          {selected.map((id) => {
            const g = GERENTES_OPTS.find((o) => o.id === id);
            return g ? (
              <span
                key={id}
                className="flex items-center gap-1 rounded-md bg-[#eee] px-2 py-1 text-sm text-[#4b4b4b]"
              >
                {g.label}
                <button
                  onClick={() => onToggle(id)}
                  className="cursor-pointer text-[#8e8e8e] hover:text-[#4b4b4b]"
                >
                  <svg className="size-3" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              </span>
            ) : null;
          })}
        </div>
      )}
      {/* Search */}
      <div className="mb-4 flex items-center justify-between rounded-md border border-[#cacaca] bg-white px-4 py-3">
        <input
          type="text"
          placeholder="Buscar por gerente de negócio"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="flex-1 bg-transparent text-sm text-[#4b4b4b] placeholder-[#8e8e8e] outline-none"
        />
        <svg className="size-4 text-[#8e8e8e]" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
      </div>
      {/* Options */}
      <div className="flex flex-col">
        {filtered.map((g, idx) => (
          <button
            key={g.id}
            onClick={() => onToggle(g.id)}
            className={`flex items-center gap-2 cursor-pointer px-4 py-3 text-sm text-[#4b4b4b] hover:bg-[#f5f5f5] ${idx % 2 === 1 ? "bg-[#f5f5f5]" : "bg-white"}`}
          >
            <svg className="size-5 text-[#00842f]" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            {g.label}
          </button>
        ))}
      </div>
      {/* Selecionar button */}
      <button
        onClick={onSelecionar}
        className="mt-4 flex h-12 w-full cursor-pointer items-center justify-center rounded-md bg-[#00842f] text-base font-bold text-white hover:bg-[#006b25]"
      >
        Selecionar
      </button>
    </div>
  );
}
