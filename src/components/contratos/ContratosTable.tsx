import { useRef } from "react";
import StatusBadge from "./StatusBadge";
import type { Contrato, ColumnConfig, ContratoStatus } from "./types";

type StatusFilter = "Todos" | "Aguardando aprovação" | "Aprovado" | "Aguardando vínculo";

interface ContratosTableProps {
  groupLabel: string;
  contratos: Contrato[];
  columns: ColumnConfig[];
  selectedIds: Set<string>;
  onToggle: (id: string) => void;
  onSelectAll: () => void;
  onAprovarSelected: () => void;
  onAcoes: (id: string, x: number, y: number) => void;
  onDetalhes: (id: string, x: number, y: number) => void;
  showAprovarAction: boolean;
  showDetalhes?: boolean;
  statusFilter: StatusFilter;
  onStatusFilterOpen: (x: number, y: number) => void;
}

function getColumnValue(col: ColumnConfig, row: Contrato): string {
  switch (col.id) {
    case "codigoRevenda": return row.codigoRevenda;
    case "grupoEconomico": return row.grupoEconomico;
    case "cnpjCliente": return row.cnpjCliente;
    case "numeroProposta": return row.numeroProposta;
    case "vendedor": return row.vendedor;
    case "gerente": return row.gerente;
    case "valorContrato": return row.valorContrato ?? "—";
    case "nomeCliente": return row.nomeCliente ?? "—";
    case "dataContrato": return row.dataContrato ?? "—";
    case "numeroContrato": return row.numeroContrato ?? "—";
    case "chassi": return row.chassi ?? "—";
    case "fornecedor": return row.fornecedor ?? "—";
    default: return "—";
  }
}

const visibleColumns = (cols: ColumnConfig[]) =>
  [...cols].filter((c) => c.visible).sort((a, b) => a.order - b.order);

export default function ContratosTable({
  groupLabel,
  contratos,
  columns,
  selectedIds,
  onToggle,
  onSelectAll,
  onAprovarSelected,
  onAcoes,
  onDetalhes,
  showAprovarAction,
  showDetalhes = false,
  statusFilter,
  onStatusFilterOpen,
}: ContratosTableProps) {
  const statusHeaderRef = useRef<HTMLTableCellElement>(null);
  const cols = visibleColumns(columns);
  const allSelected = contratos.length > 0 && contratos.every((c) => selectedIds.has(c.id));
  const anySelected = contratos.some((c) => selectedIds.has(c.id));
  const selectedCount = contratos.filter((c) => selectedIds.has(c.id)).length;

  const filtered = statusFilter === "Todos"
    ? contratos
    : contratos.filter((c) => c.status === (statusFilter as ContratoStatus));

  return (
    <div className="flex flex-col gap-6">
      {/* Group header bar */}
      <div className="flex items-center justify-between">
        <p className="text-xl font-black text-black">{groupLabel}</p>
        {showAprovarAction && (
          <div className="flex items-center gap-6">
            <label className="flex cursor-pointer items-center gap-2">
              <div
                className={`relative shrink-0 size-[15px] cursor-pointer rounded-[3px] ${allSelected ? "bg-[#00842f]" : "border-[1.8px] border-[#909191]"}`}
                onClick={onSelectAll}
              >
                {allSelected && (
                  <svg className="absolute inset-[2px]" fill="none" stroke="white" strokeWidth={3} viewBox="0 0 12 12">
                    <polyline points="1,6 5,10 11,2" />
                  </svg>
                )}
              </div>
              <span className="cursor-pointer text-sm font-bold text-[#8e8e8e] underline" onClick={onSelectAll}>
                Selecionar todos
              </span>
            </label>
            <label className="flex items-center gap-2">
              <div
                className={`relative flex h-6 w-12 items-center rounded-full p-1 transition-colors ${anySelected ? "bg-[#00842f]" : "bg-[#c6c6c6]"}`}
                onClick={anySelected ? onAprovarSelected : undefined}
                style={{ cursor: anySelected ? "pointer" : "default" }}
              >
                <div
                  className={`size-4 rounded-full bg-white shadow transition-transform ${anySelected ? "translate-x-6" : "translate-x-0"}`}
                />
              </div>
              <span className="text-base text-black">
                Aprovar{anySelected ? ` (${selectedCount})` : ""}
              </span>
            </label>
          </div>
        )}
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-lg">
        <table className="w-full border-separate border-spacing-y-px">
          <thead>
            <tr>
              {showAprovarAction && (
                <th className="bg-[#00842f] rounded-tl-lg rounded-bl-lg w-12" />
              )}
              {cols.map((col, ci) => (
                <th
                  key={col.id}
                  className={`bg-[#00842f] h-[54px] px-4 py-3 text-left text-sm font-bold text-white whitespace-nowrap ${
                    !showAprovarAction && ci === 0 ? "rounded-tl-lg rounded-bl-lg" : ""
                  }`}
                >
                  <div className="flex items-center gap-2">
                    {/* drag indicator */}
                    <svg className="size-5 shrink-0 opacity-60" fill="currentColor" viewBox="0 0 24 24">
                      <circle cx="9" cy="6" r="1.5" />
                      <circle cx="15" cy="6" r="1.5" />
                      <circle cx="9" cy="12" r="1.5" />
                      <circle cx="15" cy="12" r="1.5" />
                      <circle cx="9" cy="18" r="1.5" />
                      <circle cx="15" cy="18" r="1.5" />
                    </svg>
                    {col.label}
                  </div>
                </th>
              ))}
              {/* Status column */}
              <th
                ref={statusHeaderRef}
                className="bg-[#00842f] h-[54px] px-4 py-3 text-left text-sm font-bold text-white whitespace-nowrap cursor-pointer"
                onClick={() => {
                  const rect = statusHeaderRef.current?.getBoundingClientRect();
                  if (rect) onStatusFilterOpen(rect.left, rect.bottom + 4);
                }}
              >
                <div className="flex items-center gap-2">
                  Status
                  <svg className="size-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <polyline points="6,9 12,15 18,9" />
                  </svg>
                </div>
              </th>
              {/* Ações / Detalhes */}
              <th className="bg-[#00842f] h-[54px] px-4 py-3 text-left text-sm font-bold text-white whitespace-nowrap rounded-tr-lg rounded-br-lg">
                {showDetalhes ? "Detalhes" : "Ações"}
              </th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((row) => (
              <tr key={row.id} className="bg-[#f5f5f5]">
                {showAprovarAction && (
                  <td className="rounded-tl-lg rounded-bl-lg w-12 px-4 py-3 text-center">
                    <div
                      className={`relative shrink-0 size-[15px] cursor-pointer rounded-[3px] ${selectedIds.has(row.id) ? "bg-[#00842f]" : "border-[1.8px] border-[#909191]"}`}
                      onClick={() => onToggle(row.id)}
                    >
                      {selectedIds.has(row.id) && (
                        <svg className="absolute inset-[2px]" fill="none" stroke="white" strokeWidth={3} viewBox="0 0 12 12">
                          <polyline points="1,6 5,10 11,2" />
                        </svg>
                      )}
                    </div>
                  </td>
                )}
                {cols.map((col, ci) => (
                  <td
                    key={col.id}
                    className={`h-[54.67px] px-4 py-3 text-sm text-[#4b4b4b] whitespace-nowrap ${
                      !showAprovarAction && ci === 0 ? "rounded-tl-lg rounded-bl-lg" : ""
                    }`}
                  >
                    {getColumnValue(col, row)}
                  </td>
                ))}
                {/* Status */}
                <td className="h-[54px] px-4 py-3 text-center">
                  <StatusBadge status={row.status} />
                </td>
                {/* Ações / Detalhes */}
                <td className="h-[54px] px-4 py-3 text-center rounded-tr-lg rounded-br-lg">
                  <button
                    className="cursor-pointer text-[#4b4b4b] hover:text-[#00842f]"
                    onClick={(e) => {
                      const rect = (e.target as HTMLElement).getBoundingClientRect();
                      if (showDetalhes) {
                        onDetalhes(row.id, rect.left - 120, rect.bottom + 4);
                      } else {
                        onAcoes(row.id, rect.left - 160, rect.bottom + 4);
                      }
                    }}
                  >
                    <svg className="size-8" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                      <circle cx="12" cy="5" r="1" fill="currentColor" />
                      <circle cx="12" cy="12" r="1" fill="currentColor" />
                      <circle cx="12" cy="19" r="1" fill="currentColor" />
                    </svg>
                  </button>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr className="bg-[#f5f5f5]">
                <td
                  colSpan={cols.length + (showAprovarAction ? 1 : 0) + 2}
                  className="rounded-lg px-4 py-6 text-center text-sm text-[#8e8e8e]"
                >
                  Nenhum contrato encontrado.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
