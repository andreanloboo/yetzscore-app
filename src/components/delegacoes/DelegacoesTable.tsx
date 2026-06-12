import type { KeyboardEvent } from "react";
import { DelegacaoStatusBadge, TipoUsuarioBadge } from "./Badges";
import { EditSquareIcon, EyeIcon, TrashIcon } from "./icons";
import { formatPeriodo } from "./types";
import type { Delegacao } from "./types";

export type SortDirection = "asc" | "desc";

export interface SortState {
  columnId: string;
  direction: SortDirection;
}

interface DelegacoesTableProps {
  delegacoes: Delegacao[];
  sort: SortState | null;
  onSortChange: (sort: SortState | null) => void;
  onVisualizar: (delegacao: Delegacao) => void;
  onEditar: (delegacao: Delegacao) => void;
  onExcluir: (delegacao: Delegacao) => void;
}

const SORTABLE_COLUMNS = [
  { id: "tipo", label: "Tipo de usuário" },
  { id: "titular", label: "Responsável titular" },
  { id: "substituto", label: "Responsável Substituto" },
  { id: "periodo", label: "Período" },
  { id: "status", label: "Status" },
] as const;

function sortValue(columnId: string, d: Delegacao): string {
  switch (columnId) {
    case "tipo":
      return d.tipo;
    case "titular":
      return d.titular;
    case "substituto":
      return d.substitutos[0] ?? "";
    case "periodo":
      return d.inicio; // ISO ordena cronologicamente
    case "status":
      return d.status;
    default:
      return "";
  }
}

// Ciclo de ordenação (mesmo padrão do ContratosTable): none → asc → desc → none
export function nextSort(current: SortState | null, columnId: string): SortState | null {
  if (!current || current.columnId !== columnId) return { columnId, direction: "asc" };
  if (current.direction === "asc") return { columnId, direction: "desc" };
  return null;
}

/** Ordena a lista conforme o estado de ordenação (estável quando sort = null). */
export function sortDelegacoes(list: Delegacao[], sort: SortState | null): Delegacao[] {
  if (!sort) return list;
  return [...list].sort((a, b) => {
    const cmp = sortValue(sort.columnId, a).localeCompare(sortValue(sort.columnId, b), "pt-BR", {
      numeric: true,
    });
    return sort.direction === "asc" ? cmp : -cmp;
  });
}

function SortArrow({ direction }: { direction: SortDirection | null }) {
  return (
    <svg
      className={`size-4 shrink-0 transition-[opacity,transform] duration-200 ${
        direction ? "opacity-100" : "opacity-0 group-hover:opacity-40"
      } ${direction === "desc" ? "rotate-180" : ""}`}
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      viewBox="0 0 24 24"
    >
      <line x1="12" y1="19" x2="12" y2="5" />
      <polyline points="5,12 12,5 19,12" />
    </svg>
  );
}

function DragDots() {
  return (
    <svg className="size-5 shrink-0 opacity-60" fill="currentColor" viewBox="0 0 24 24">
      <circle cx="9" cy="6" r="1.5" />
      <circle cx="15" cy="6" r="1.5" />
      <circle cx="9" cy="12" r="1.5" />
      <circle cx="15" cy="12" r="1.5" />
      <circle cx="9" cy="18" r="1.5" />
      <circle cx="15" cy="18" r="1.5" />
    </svg>
  );
}

/** Nome do primeiro substituto + chip "+N" com tooltip listando os demais. */
function SubstitutoCell({ substitutos }: { substitutos: string[] }) {
  const [primeiro, ...demais] = substitutos;
  return (
    <span className="inline-flex items-center gap-2">
      <span>{primeiro ?? "—"}</span>
      {demais.length > 0 && (
        <span className="group relative inline-flex">
          <span
            tabIndex={0}
            aria-label={`Mais ${demais.length} substitutos: ${demais.join(", ")}`}
            className="inline-flex h-[21px] cursor-default items-center rounded-md bg-[#eeeeee] px-1.5 text-xs leading-[17px] text-[#4b4b4b] transition-colors duration-150 group-hover:bg-[#00842f] group-hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00842f]"
          >
            +{demais.length}
          </span>
          <span
            role="tooltip"
            className="pointer-events-none absolute left-1/2 top-[calc(100%+8px)] z-20 -translate-x-1/2 whitespace-nowrap rounded-md bg-[#00842f] px-3 py-2 text-sm leading-[17px] text-white opacity-0 shadow-lg transition-opacity duration-200 group-hover:opacity-100 group-focus-within:opacity-100"
          >
            <span className="absolute -top-1 left-1/2 size-2 -translate-x-1/2 rotate-45 bg-[#00842f]" />
            {demais.join(", ")}
          </span>
        </span>
      )}
    </span>
  );
}

function AcaoButton({
  label,
  onClick,
  children,
}: {
  label: string;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      onClick={onClick}
      className="inline-flex size-9 cursor-pointer items-center justify-center rounded-md text-[#00842f] transition-[background-color,transform] duration-150 hover:bg-[#e6f3ea] active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00842f]"
    >
      {children}
    </button>
  );
}

export default function DelegacoesTable({
  delegacoes,
  sort,
  onSortChange,
  onVisualizar,
  onEditar,
  onExcluir,
}: DelegacoesTableProps) {
  const sortDirectionOf = (columnId: string): SortDirection | null =>
    sort?.columnId === columnId ? sort.direction : null;

  const ariaSortOf = (columnId: string): "ascending" | "descending" | "none" => {
    const dir = sortDirectionOf(columnId);
    return dir === "asc" ? "ascending" : dir === "desc" ? "descending" : "none";
  };

  const handleSortKeyDown = (columnId: string) => (e: KeyboardEvent<HTMLTableCellElement>) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onSortChange(nextSort(sort, columnId));
    }
  };

  return (
    <div className="w-full overflow-x-auto rounded-lg">
      <table className="w-full border-separate border-spacing-y-px">
        <thead>
          <tr>
            {SORTABLE_COLUMNS.map((col, ci) => (
              <th
                key={col.id}
                aria-sort={ariaSortOf(col.id)}
                tabIndex={0}
                onClick={() => onSortChange(nextSort(sort, col.id))}
                onKeyDown={handleSortKeyDown(col.id)}
                className={`group h-[54px] cursor-pointer select-none whitespace-nowrap bg-[#00842f] px-4 py-3 text-left text-sm font-bold text-white ${
                  ci === 0 ? "rounded-bl-lg rounded-tl-lg" : ""
                }`}
              >
                <div className="flex items-center gap-2">
                  <DragDots />
                  {col.label}
                  <SortArrow direction={sortDirectionOf(col.id)} />
                </div>
              </th>
            ))}
            <th className="h-[54px] w-[96px] whitespace-nowrap bg-[#00842f] px-4 py-3 text-center text-sm font-bold text-white">
              Visualizar
            </th>
            <th className="h-[54px] w-[80px] whitespace-nowrap bg-[#00842f] px-4 py-3 text-center text-sm font-bold text-white">
              Editar
            </th>
            <th className="h-[54px] w-[80px] whitespace-nowrap rounded-br-lg rounded-tr-lg bg-[#00842f] px-4 py-3 text-center text-sm font-bold text-white">
              Excluir
            </th>
          </tr>
        </thead>
        <tbody>
          {delegacoes.map((d) => (
            <tr key={d.id} className="bg-[#f5f5f5] transition-colors duration-150 hover:bg-[#efefef]">
              <td className="h-[54px] whitespace-nowrap rounded-bl-lg rounded-tl-lg px-4 py-3 text-sm text-[#4b4b4b]">
                <TipoUsuarioBadge tipo={d.tipo} />
              </td>
              <td className="h-[54px] whitespace-nowrap px-4 py-3 text-sm text-[#4b4b4b]">
                {d.titular}
              </td>
              <td className="h-[54px] whitespace-nowrap px-4 py-3 text-sm text-[#4b4b4b]">
                <SubstitutoCell substitutos={d.substitutos} />
              </td>
              <td className="h-[54px] whitespace-nowrap px-4 py-3 text-sm text-[#4b4b4b]">
                {formatPeriodo(d.inicio, d.fim)}
              </td>
              <td className="h-[54px] whitespace-nowrap px-4 py-3 text-sm">
                <DelegacaoStatusBadge status={d.status} />
              </td>
              <td className="h-[54px] px-4 py-3 text-center">
                <AcaoButton label={`Visualizar delegação de ${d.titular}`} onClick={() => onVisualizar(d)}>
                  <EyeIcon size={20} />
                </AcaoButton>
              </td>
              <td className="h-[54px] px-4 py-3 text-center">
                <AcaoButton label={`Editar delegação de ${d.titular}`} onClick={() => onEditar(d)}>
                  <EditSquareIcon size={20} />
                </AcaoButton>
              </td>
              <td className="h-[54px] rounded-br-lg rounded-tr-lg px-4 py-3 text-center">
                <AcaoButton label={`Excluir delegação de ${d.titular}`} onClick={() => onExcluir(d)}>
                  <TrashIcon size={20} />
                </AcaoButton>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
