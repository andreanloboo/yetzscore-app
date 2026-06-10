import { useState } from "react";
import type { ColumnConfig } from "./types";

interface GerenciarColunasPanelProps {
  columns: ColumnConfig[];
  onApply: (columns: ColumnConfig[]) => void;
  onCancel: () => void;
  defaultColumns: ColumnConfig[];
}

export default function GerenciarColunasPanel({
  columns,
  onApply,
  onCancel,
  defaultColumns,
}: GerenciarColunasPanelProps) {
  const [localCols, setLocalCols] = useState<ColumnConfig[]>(() =>
    [...columns].sort((a, b) => a.order - b.order)
  );
  const [dragIdx, setDragIdx] = useState<number | null>(null);
  const [dragOverIdx, setDragOverIdx] = useState<number | null>(null);

  const allVisible = localCols.every((c) => c.visible);

  function toggleAll() {
    const next = !allVisible;
    setLocalCols((prev) => prev.map((c) => ({ ...c, visible: next })));
  }

  function toggleOne(id: string) {
    setLocalCols((prev) =>
      prev.map((c) => (c.id === id ? { ...c, visible: !c.visible } : c))
    );
  }

  function handleRestore() {
    setLocalCols([...defaultColumns].sort((a, b) => a.order - b.order));
  }

  // Drag handlers
  function handleDragStart(idx: number) {
    setDragIdx(idx);
  }

  function handleDragOver(e: React.DragEvent, idx: number) {
    e.preventDefault();
    setDragOverIdx(idx);
  }

  function handleDrop(idx: number) {
    if (dragIdx === null || dragIdx === idx) {
      setDragIdx(null);
      setDragOverIdx(null);
      return;
    }
    const next = [...localCols];
    const [moved] = next.splice(dragIdx, 1);
    next.splice(idx, 0, moved);
    setLocalCols(next.map((c, i) => ({ ...c, order: i })));
    setDragIdx(null);
    setDragOverIdx(null);
  }

  function handleApply() {
    onApply(localCols.map((c, i) => ({ ...c, order: i })));
  }

  return (
    <div className="fixed inset-y-0 right-0 z-40 flex w-[400px] flex-col bg-white shadow-xl">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[#cacaca] px-8 py-6">
        <div className="flex items-center gap-4">
          <svg className="size-10 text-[#00842f]" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 4.5v15m6-15v15m-10.875 0h15.75c.621 0 1.125-.504 1.125-1.125V5.625c0-.621-.504-1.125-1.125-1.125H4.125C3.504 4.5 3 5.004 3 5.625v12.75c0 .621.504 1.125 1.125 1.125z" />
          </svg>
          <p className="text-[22px] font-bold leading-[26px] text-[#00842f]">Gerenciar colunas</p>
        </div>
        <button onClick={onCancel} className="text-[#8e8e8e] hover:text-[#4b4b4b]">
          <svg className="size-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </div>

      <div className="flex flex-1 flex-col gap-8 overflow-y-auto px-8 py-8">
        <p className="text-base text-[#4b4b4b]">
          Arraste para reordenar. Marque ou desmarque para mostrar ou ocultar colunas
        </p>

        {/* Draggable list */}
        <div className="flex flex-col gap-2">
          {localCols.map((col, idx) => (
            <div
              key={col.id}
              draggable
              onDragStart={() => handleDragStart(idx)}
              onDragOver={(e) => handleDragOver(e, idx)}
              onDrop={() => handleDrop(idx)}
              onDragEnd={() => { setDragIdx(null); setDragOverIdx(null); }}
              className={`flex h-[41px] cursor-grab items-center gap-2 rounded-none bg-[#f5f5f5] px-4 py-3 ${dragOverIdx === idx ? "ring-2 ring-[#00842f]" : ""}`}
            >
              {/* drag handle */}
              <svg className="size-5 shrink-0 text-[#8e8e8e]" fill="currentColor" viewBox="0 0 24 24">
                <circle cx="9" cy="6" r="1.5" />
                <circle cx="15" cy="6" r="1.5" />
                <circle cx="9" cy="12" r="1.5" />
                <circle cx="15" cy="12" r="1.5" />
                <circle cx="9" cy="18" r="1.5" />
                <circle cx="15" cy="18" r="1.5" />
              </svg>
              <input
                type="checkbox"
                checked={col.visible}
                onChange={() => toggleOne(col.id)}
                className="size-4 cursor-pointer accent-[#00842f]"
              />
              <span className="text-sm text-[#4b4b4b]">{col.label}</span>
            </div>
          ))}
        </div>

        {/* Bottom action row */}
        <div className="flex items-center justify-between">
          <button
            onClick={toggleAll}
            className="flex items-center gap-2 text-base font-bold text-[#00842f] hover:underline"
          >
            <svg className="size-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
              <polyline points="20,6 9,17 4,12" />
            </svg>
            Selecionar todos
          </button>
          <button
            onClick={handleRestore}
            className="flex items-center gap-2 text-base font-bold text-[#00842f] hover:underline"
          >
            <svg className="size-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Restaurar padrão
          </button>
        </div>

        {/* Apply / Cancel */}
        <div className="flex flex-col gap-2">
          <button
            onClick={handleApply}
            className="flex h-12 w-full cursor-pointer items-center justify-center rounded-md bg-[#00842f] text-base font-bold text-white hover:bg-[#006b25]"
          >
            Aplicar
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
  );
}
