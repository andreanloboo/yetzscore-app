import { useEffect, useState, type ReactNode } from "react";
import { CloseIcon } from "./icons";

// ─── Entrada com fade + slide (dropdowns/painéis) ─────────────────────────────
export function FadeSlideIn({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  const [entered, setEntered] = useState(false);
  useEffect(() => {
    const raf = requestAnimationFrame(() => setEntered(true));
    return () => cancelAnimationFrame(raf);
  }, []);
  return (
    <div
      className={`transition-all duration-200 ease-out ${
        entered ? "translate-y-0 opacity-100" : "-translate-y-1 opacity-0"
      } ${className}`}
    >
      {children}
    </div>
  );
}

// ─── Casca de modal: overlay escuro, fade+scale, X fecha, Escape fecha ────────
interface ModalShellProps {
  onClose: () => void;
  children: ReactNode;
  /** Largura do modal em px (padrão 391 = 327 de conteúdo + 32 de padding em cada lado). */
  width?: number;
}

export default function ModalShell({ onClose, children, width = 391 }: ModalShellProps) {
  const [entered, setEntered] = useState(false);

  useEffect(() => {
    const raf = requestAnimationFrame(() => setEntered(true));
    return () => cancelAnimationFrame(raf);
  }, []);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
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
        style={{ width }}
        className={`relative max-h-[90vh] max-w-[calc(100vw-32px)] overflow-y-auto rounded-xl bg-white p-8 shadow-xl transition-all duration-200 ease-out ${
          entered ? "scale-100 opacity-100" : "scale-95 opacity-0"
        }`}
      >
        <button
          type="button"
          aria-label="Fechar"
          onClick={onClose}
          className="absolute right-3 top-3 cursor-pointer rounded p-1 text-[#4b4b4b] transition-colors duration-150 hover:bg-[#e6f3ea] hover:text-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00842f]"
        >
          <CloseIcon className="size-4" />
        </button>
        {children}
      </div>
    </div>
  );
}
