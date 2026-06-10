import type { ReactNode } from "react";
import type { Contrato } from "./types";

// ─── Overlay backdrop ────────────────────────────────────────────────────────
export function ModalBackdrop({
  onClose,
  children,
}: {
  onClose: () => void;
  children: ReactNode;
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      {children}
    </div>
  );
}

// ─── Info icon (used in Atenção modals) ──────────────────────────────────────
function InfoIcon() {
  return (
    <svg
      className="size-8 text-[#f59e0b]"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      viewBox="0 0 24 24"
    >
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="8" x2="12" y2="12" />
      <line x1="12" y1="16" x2="12.01" y2="16" strokeWidth={3} />
    </svg>
  );
}

// ─── Green check icon (used in success modals) ───────────────────────────────
function SuccessIcon() {
  return (
    <svg
      className="size-8 text-[#00842f]"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.5}
      viewBox="0 0 24 24"
    >
      <circle cx="12" cy="12" r="10" />
      <polyline points="8,12 11,15 16,9" />
    </svg>
  );
}

// ─── Atenção modal (generic) ─────────────────────────────────────────────────
interface AtencaoModalProps {
  question: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export function AtencaoModal({ question, onConfirm, onCancel }: AtencaoModalProps) {
  return (
    <ModalBackdrop onClose={onCancel}>
      <div className="flex items-center justify-center rounded-xl bg-white px-8 py-8 shadow-xl">
        <div className="flex w-[327px] flex-col items-center gap-10">
          <div className="flex flex-col items-center gap-6">
            <InfoIcon />
            <p className="text-center text-[22px] font-bold leading-normal text-black">Atenção</p>
            <p className="text-center text-sm leading-normal text-[#4b4b4b]">{question}</p>
          </div>
          <div className="flex w-full flex-col gap-2">
            <button
              onClick={onConfirm}
              className="flex h-12 w-full cursor-pointer items-center justify-center rounded-md bg-[#00842f] text-base font-bold text-white hover:bg-[#006b25]"
            >
              Confirmar
            </button>
            <button
              onClick={onCancel}
              className="flex h-12 w-full cursor-pointer items-center justify-center rounded-md border border-[#00842f] text-base font-bold text-[#00842f] hover:bg-[#e6f3ea]"
            >
              Cancelar
            </button>
          </div>
        </div>
      </div>
    </ModalBackdrop>
  );
}

// ─── Success modal (generic) ──────────────────────────────────────────────────
interface SucessoModalProps {
  message: string;
  onOk: () => void;
}

export function SucessoModal({ message, onOk }: SucessoModalProps) {
  return (
    <ModalBackdrop onClose={onOk}>
      <div className="flex items-center justify-center rounded-2xl bg-white p-8 shadow-xl">
        <div className="flex w-full flex-col items-center gap-10">
          <div className="flex flex-col items-center gap-6">
            <SuccessIcon />
            <p className="whitespace-pre-line text-center text-[22px] font-bold text-black">{message}</p>
          </div>
          <button
            onClick={onOk}
            className="flex h-12 w-full cursor-pointer items-center justify-center rounded-md bg-[#00842f] text-base font-bold text-white hover:bg-[#006b25]"
          >
            Ok
          </button>
        </div>
      </div>
    </ModalBackdrop>
  );
}

// ─── Contratos Selecionados modal ─────────────────────────────────────────────
interface ContratosSelecionadosModalProps {
  contratos: Contrato[];
  selectedIds: Set<string>;
  onToggle: (id: string) => void;
  onToggleAll: () => void;
  onAprovar: () => void;
  onCancel: () => void;
}

export function ContratosSelecionadosModal({
  contratos,
  selectedIds,
  onToggle,
  onToggleAll,
  onAprovar,
  onCancel,
}: ContratosSelecionadosModalProps) {
  const allSelected = contratos.every((c) => selectedIds.has(c.id));
  const count = selectedIds.size;

  return (
    <ModalBackdrop onClose={onCancel}>
      <div className="flex w-[480px] max-h-[80vh] flex-col gap-5 overflow-hidden rounded-xl bg-white p-8 shadow-xl">
        {/* Header */}
        <div className="flex items-center gap-3">
          <svg className="size-6 text-[#00842f]" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
          </svg>
          <p className="text-[22px] font-bold leading-[26px] text-[#00842f]">Contratos selecionados</p>
        </div>
        <div className="h-px bg-[#cacaca]" />
        {/* Description */}
        <div className="flex items-center justify-between gap-3">
          <p className="text-sm text-[#4b4b4b]">Desmarque os que não devem ser aprovados.</p>
          <span className="rounded-md bg-[#dffbe8] px-2 py-1 text-xs font-bold text-[#00842f] whitespace-nowrap">
            {count} de {contratos.length}
          </span>
        </div>
        {/* Select all */}
        <label className="flex cursor-pointer items-center gap-2">
          <input
            type="checkbox"
            checked={allSelected}
            onChange={onToggleAll}
            className="h-4 w-4 rounded accent-[#00842f]"
          />
          <span className="text-sm">Selecionar todos</span>
        </label>
        {/* List */}
        <div className="flex flex-col gap-2 overflow-y-auto">
          {contratos.map((c) => (
            <div
              key={c.id}
              className="flex items-center gap-3 rounded-lg bg-[#f5f5f5] p-3"
            >
              <div
                className={`relative shrink-0 size-[15px] cursor-pointer rounded-[3px] ${selectedIds.has(c.id) ? "bg-[#00842f]" : "border border-[#cacaca] bg-white"}`}
                onClick={() => onToggle(c.id)}
              >
                {selectedIds.has(c.id) && (
                  <svg className="absolute inset-[2px]" fill="none" stroke="white" strokeWidth={3} viewBox="0 0 12 12">
                    <polyline points="1,6 5,10 11,2" />
                  </svg>
                )}
              </div>
              <div className="flex flex-1 min-w-0 flex-col gap-0.5 overflow-hidden">
                <p className="truncate text-sm font-bold">Cód. revenda {c.codigoRevenda}</p>
                <p className="truncate text-xs text-[#909191]">Proposta {c.numeroProposta}</p>
              </div>
              <span className="shrink-0 rounded-md bg-[#ffedee] px-2 py-0.5 text-xs font-bold text-[#cc0000]">
                {c.status}
              </span>
              <button onClick={() => onToggle(c.id)} className="shrink-0 text-[#cc0000] hover:text-red-700">
                <svg className="size-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="15" y1="9" x2="9" y2="15" />
                  <line x1="9" y1="9" x2="15" y2="15" />
                </svg>
              </button>
            </div>
          ))}
        </div>
        {/* Buttons */}
        <div className="flex flex-col gap-2">
          <button
            onClick={onAprovar}
            disabled={count === 0}
            className="flex h-12 w-full cursor-pointer items-center justify-center rounded-md bg-[#00842f] text-base font-bold text-white disabled:opacity-50 hover:bg-[#006b25]"
          >
            Aprovar selecionados ({count})
          </button>
          <button
            onClick={onCancel}
            className="flex h-12 w-full cursor-pointer items-center justify-center rounded-md border border-[#00842f] text-base font-bold text-[#00842f] hover:bg-[#e6f3ea]"
          >
            Cancelar
          </button>
        </div>
      </div>
    </ModalBackdrop>
  );
}
