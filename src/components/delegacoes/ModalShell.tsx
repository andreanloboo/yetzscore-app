import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import { XIcon } from "./icons";

/**
 * Transição de entrada (1 frame após a montagem) para fade/slide/scale
 * de modais e dropdowns sem depender de keyframes globais.
 */
export function useEntryTransition(): boolean {
  const [entered, setEntered] = useState(false);
  useEffect(() => {
    const id = requestAnimationFrame(() => setEntered(true));
    return () => cancelAnimationFrame(id);
  }, []);
  return entered;
}

interface DropdownPanelProps {
  children: ReactNode;
  /** Posicionamento/tamanho (ex.: "left-0 top-[calc(100%+4px)] w-full"). */
  className?: string;
}

/** Painel de dropdown com entrada em fade + slide (200ms). */
export function DropdownPanel({ children, className = "" }: DropdownPanelProps) {
  const entered = useEntryTransition();
  return (
    <div
      className={`absolute z-30 overflow-hidden rounded-md border border-[#cacaca] bg-white shadow-lg transition-[opacity,transform] duration-200 ${
        entered ? "translate-y-0 opacity-100" : "-translate-y-1 opacity-0"
      } ${className}`}
    >
      {children}
    </div>
  );
}

interface ModalShellProps {
  onClose: () => void;
  children: ReactNode;
  /** Largura do painel (padrão ~390px conforme o design). */
  widthClass?: string;
  ariaLabel?: string;
  /** Exibe o X no canto superior (alguns modais do design não têm). */
  showClose?: boolean;
}

/**
 * Casca padrão dos modais de Delegações: overlay escuro, painel branco
 * ~390px com X, fecha com Escape/clique fora e entra com fade + scale.
 */
export default function ModalShell({
  onClose,
  children,
  widthClass = "w-[390px]",
  ariaLabel,
  showClose = true,
}: ModalShellProps) {
  const entered = useEntryTransition();

  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [onClose]);

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-black/40 transition-opacity duration-200 ${
        entered ? "opacity-100" : "opacity-0"
      }`}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={ariaLabel}
        className={`relative max-h-[calc(100vh-32px)] ${widthClass} max-w-[calc(100vw-32px)] overflow-y-auto rounded-xl bg-white p-8 shadow-xl transition-[opacity,transform] duration-200 ${
          entered ? "scale-100 opacity-100" : "scale-95 opacity-0"
        }`}
      >
        {showClose && (
          <button
            type="button"
            aria-label="Fechar"
            onClick={onClose}
            className="absolute right-3 top-3 z-10 flex size-8 items-center justify-center rounded-md text-[#8e8e8e] transition-colors duration-150 hover:bg-[#f5f5f5] hover:text-[#4b4b4b] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00842f]"
          >
            <XIcon size={16} />
          </button>
        )}
        {children}
      </div>
    </div>
  );
}
