import { useEffect, useState } from "react";
import ContratosTable from "./ContratosTable";
import type { SortState, StatusFilter } from "./ContratosTable";
import type { ColumnConfig, Contrato } from "./types";

// ─── Tabela única do perfil Gerente de Contas (frame 8428:18867) ─────────────
// Reusa o ContratosTable existente sem a barra do grupo, sem checkbox de
// seleção e sem toggle Aprovar; a última coluna passa a se chamar "Ação".
// O popover aberto por "..." depende do status da linha + tipo da campanha
// (decidido pelo ContratosPage via onAction → overlay "verDetalhes").

interface GcContratosTableProps {
  contratos: Contrato[];
  columns: ColumnConfig[];
  /** Abre o popover de ação da linha ("..."), posicionado em (x, y). */
  onAction: (id: string, x: number, y: number) => void;
  statusFilter: StatusFilter;
  onStatusFilterOpen: (x: number, y: number) => void;
  sort: SortState | null;
  onSortChange: (sort: SortState | null) => void;
  onReorder: (fromId: string, toId: string) => void;
}

const NO_SELECTION = new Set<string>();
const noop = () => {};

export default function GcContratosTable({
  contratos,
  columns,
  onAction,
  statusFilter,
  onStatusFilterOpen,
  sort,
  onSortChange,
  onReorder,
}: GcContratosTableProps) {
  // Microinteração sutil: fade + leve deslize ao montar (200ms)
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    const raf = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <div
      className={`transition-[opacity,transform] duration-200 ease-out ${
        mounted ? "translate-y-0 opacity-100" : "translate-y-1 opacity-0"
      }`}
    >
      <ContratosTable
        groupLabel=""
        showGroupHeader={false}
        contratos={contratos}
        columns={columns}
        selectedIds={NO_SELECTION}
        onToggle={noop}
        onToggleAll={noop}
        onSelectAll={noop}
        onAprovarSelected={noop}
        onAcoes={onAction}
        onDetalhes={onAction}
        showAprovarAction={false}
        showDetalhes
        actionsLabel="Ação"
        statusFilter={statusFilter}
        onStatusFilterOpen={onStatusFilterOpen}
        sort={sort}
        onSortChange={onSortChange}
        onReorder={onReorder}
      />
    </div>
  );
}
