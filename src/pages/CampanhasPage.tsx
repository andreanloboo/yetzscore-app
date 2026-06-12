import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import Footer from "../components/Footer";
import AppSidebar from "../components/AppSidebar";
import CampaignCard from "../components/campanhas/CampaignCard";
import CalendarPopover, { formatFullDate } from "../components/campanhas/CalendarPopover";
import type { DateRange } from "../components/campanhas/CalendarPopover";
import FilterDropdown from "../components/campanhas/FilterDropdown";
import type { FilterOption } from "../components/campanhas/FilterDropdown";
import { CAMPAIGNS } from "../components/campanhas/data";
import type { CampaignStatus, CampaignValueType } from "../components/campanhas/data";
import { AvisoDelegacaoModal } from "../components/delegacoes/DelegacaoModals";
import {
  CalendarIcon,
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  DonutLargeIcon,
  LineChartIcon,
  SearchIcon,
} from "../components/campanhas/icons";

const PAGE_SIZE = 12;

/** Aviso de delegação ativa pós-login: exibido uma única vez por sessão. */
const AVISO_DELEGACAO_KEY = "yetzscore:aviso-delegacao-ativa";

type TypeFilterValue = "todos" | CampaignValueType;
type StatusFilterValue = "todos" | CampaignStatus;
type OpenPanel = "tipo" | "status" | "periodo" | null;

const TYPE_OPTIONS: FilterOption<TypeFilterValue>[] = [
  { value: "todos", label: "Todos" },
  { value: "fixo", label: "Valor Fixo" },
  { value: "variavel", label: "Valor variável" },
];

const STATUS_OPTIONS: FilterOption<StatusFilterValue>[] = [
  { value: "todos", label: "Todos" },
  { value: "ativo", label: "Ativos" },
  { value: "inativo", label: "Inativos" },
];

const TYPE_CHIPS: { value: CampaignValueType; label: string }[] = [
  { value: "fixo", label: "Valor fixo" },
  { value: "variavel", label: "Valor variável" },
];

const STATUS_CHIPS: { value: CampaignStatus; label: string }[] = [
  { value: "ativo", label: "Ativas" },
  { value: "inativo", label: "Inativas" },
];

/** Remove os diacríticos (faixa U+0300–U+036F após decomposição NFD). */
const DIACRITICS_RE = new RegExp(
  `[${String.fromCharCode(0x0300)}-${String.fromCharCode(0x036f)}]`,
  "g"
);

/** Normaliza para busca sem acentos e sem diferenciar maiúsculas. */
function normalize(text: string): string {
  return text.normalize("NFD").replace(DIACRITICS_RE, "").toLowerCase();
}

function toggleInSet<T>(set: Set<T>, value: T): Set<T> {
  const next = new Set(set);
  if (next.has(value)) {
    next.delete(value);
  } else {
    next.add(value);
  }
  return next;
}

export default function CampanhasPage() {
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<Set<CampaignValueType>>(new Set());
  const [statusFilter, setStatusFilter] = useState<Set<CampaignStatus>>(new Set());
  const [range, setRange] = useState<DateRange>({ start: null, end: null });
  const [openPanel, setOpenPanel] = useState<OpenPanel>(null);
  const [openCardMenuId, setOpenCardMenuId] = useState<number | null>(null);
  const [page, setPage] = useState(1);
  const [showAvisoDelegacao, setShowAvisoDelegacao] = useState(
    () => sessionStorage.getItem(AVISO_DELEGACAO_KEY) === null
  );

  const filtersRef = useRef<HTMLDivElement>(null);

  // Marca o aviso como visto na sessão assim que a página monta
  useEffect(() => {
    sessionStorage.setItem(AVISO_DELEGACAO_KEY, "1");
  }, []);

  // Click-away fecha qualquer dropdown/popover aberto
  useEffect(() => {
    if (!openPanel) return;
    function handleClick(e: MouseEvent) {
      if (filtersRef.current && !filtersRef.current.contains(e.target as Node)) {
        setOpenPanel(null);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [openPanel]);

  // Dropdowns refletem os chips: 1 valor selecionado → valor; 0 ou 2 → "todos"
  const typeSelected: TypeFilterValue =
    typeFilter.size === 1 ? [...typeFilter][0] : "todos";
  const statusSelected: StatusFilterValue =
    statusFilter.size === 1 ? [...statusFilter][0] : "todos";

  const filtered = useMemo(() => {
    const term = normalize(search.trim());
    return CAMPAIGNS.filter((c) => {
      if (term && !normalize(c.title).includes(term)) return false;
      if (typeFilter.size > 0 && !typeFilter.has(c.valueType)) return false;
      if (statusFilter.size > 0 && !statusFilter.has(c.status)) return false;
      if (range.start && range.end) {
        // Sobreposição de períodos (comparação ISO funciona como string)
        if (c.end < range.start || c.start > range.end) return false;
      }
      return true;
    });
  }, [search, typeFilter, statusFilter, range]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const pageItems = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);
  const showingFrom = filtered.length === 0 ? 0 : (currentPage - 1) * PAGE_SIZE + 1;
  const showingTo = Math.min(currentPage * PAGE_SIZE, filtered.length);

  function resetPage() {
    setPage(1);
  }

  function togglePanel(panel: Exclude<OpenPanel, null>) {
    setOpenCardMenuId(null);
    setOpenPanel((current) => (current === panel ? null : panel));
  }

  function handleTypeChip(value: CampaignValueType) {
    setTypeFilter((current) => toggleInSet(current, value));
    resetPage();
  }

  function handleStatusChip(value: CampaignStatus) {
    setStatusFilter((current) => toggleInSet(current, value));
    resetPage();
  }

  function handleTypeSelect(value: TypeFilterValue) {
    setTypeFilter(value === "todos" ? new Set() : new Set([value]));
    setOpenPanel(null);
    resetPage();
  }

  function handleStatusSelect(value: StatusFilterValue) {
    setStatusFilter(value === "todos" ? new Set() : new Set([value]));
    setOpenPanel(null);
    resetPage();
  }

  function handleRangeChange(next: DateRange) {
    setRange(next);
    resetPage();
  }

  function handleRangeClear() {
    setRange({ start: null, end: null });
    resetPage();
  }

  const periodoLabel =
    range.start && range.end
      ? `${formatFullDate(range.start)} - ${formatFullDate(range.end)}`
      : "Período";

  const filterButtonClass = (active: boolean) =>
    `flex h-10 items-center justify-center gap-2 rounded-md px-3 py-3 text-base font-bold leading-4 text-[#00842f] transition-colors hover:bg-[#e6f3ea] ${
      active ? "bg-[#e6f3ea]" : ""
    }`;

  const chipClass = (selected: boolean) =>
    `flex items-center justify-center rounded-md border border-[#00842f] px-2 py-1 text-sm font-bold leading-4 transition-colors ${
      selected
        ? "bg-[#00842f] text-white"
        : "text-[#00842f] hover:bg-[#e6f3ea]"
    }`;

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <div className="flex min-h-0 flex-1 items-stretch">
        <AppSidebar />

        <main className="flex min-w-0 flex-1 flex-col bg-white">
          {/* Cabeçalho */}
          <div className="flex w-full items-center border-b border-[#e1e1e1] p-16">
            <div className="flex items-center gap-4">
              <LineChartIcon size={24} className="text-[#00842f]" />
              <h1 className="whitespace-nowrap text-[22px] font-bold leading-[26px] text-[#00842f]">
                Gerenciamento de campanhas
              </h1>
            </div>
          </div>

          {/* Conteúdo */}
          <div className="flex w-full flex-1 flex-col items-start gap-8 p-16">
            <div ref={filtersRef} className="flex w-full items-end justify-between gap-4">
              {/* Busca + chips */}
              <div className="flex flex-col items-start justify-center gap-3">
                <div className="flex w-[500px] max-w-full items-center justify-between gap-2 rounded-md border border-[#cacaca] bg-white px-4 py-4 transition-colors focus-within:border-[#00842f]">
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => {
                      setSearch(e.target.value);
                      resetPage();
                    }}
                    placeholder="Buscar pelo nome da campanha"
                    className="w-full bg-transparent text-base leading-4 text-[#191919] outline-none placeholder:text-[#8e8e8e]"
                  />
                  <SearchIcon size={16} className="shrink-0 text-[#4b4b4b]" />
                </div>
                <div className="flex items-center gap-1">
                  {TYPE_CHIPS.map((chip) => (
                    <button
                      key={chip.value}
                      type="button"
                      onClick={() => handleTypeChip(chip.value)}
                      className={chipClass(typeFilter.has(chip.value))}
                    >
                      {chip.label}
                    </button>
                  ))}
                  {STATUS_CHIPS.map((chip) => (
                    <button
                      key={chip.value}
                      type="button"
                      onClick={() => handleStatusChip(chip.value)}
                      className={chipClass(statusFilter.has(chip.value))}
                    >
                      {chip.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Botões de filtro */}
              <div className="flex items-end justify-end gap-2">
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => togglePanel("tipo")}
                    className={filterButtonClass(openPanel === "tipo" || typeSelected !== "todos")}
                  >
                    <LineChartIcon size={16} />
                    <span className="whitespace-nowrap">Tipo de campanha</span>
                    <ChevronDownIcon size={16} />
                  </button>
                  {openPanel === "tipo" && (
                    <FilterDropdown
                      options={TYPE_OPTIONS}
                      selected={typeSelected}
                      onSelect={handleTypeSelect}
                    />
                  )}
                </div>

                <div className="relative">
                  <button
                    type="button"
                    onClick={() => togglePanel("status")}
                    className={filterButtonClass(
                      openPanel === "status" || statusSelected !== "todos"
                    )}
                  >
                    <DonutLargeIcon size={16} />
                    <span className="whitespace-nowrap">Status</span>
                    <ChevronDownIcon size={16} />
                  </button>
                  {openPanel === "status" && (
                    <FilterDropdown
                      options={STATUS_OPTIONS}
                      selected={statusSelected}
                      onSelect={handleStatusSelect}
                    />
                  )}
                </div>

                <div className="relative">
                  <button
                    type="button"
                    onClick={() => togglePanel("periodo")}
                    className={filterButtonClass(
                      openPanel === "periodo" || Boolean(range.start && range.end)
                    )}
                  >
                    <CalendarIcon size={16} />
                    <span className="whitespace-nowrap">{periodoLabel}</span>
                    <ChevronDownIcon size={16} />
                  </button>
                  {openPanel === "periodo" && (
                    <CalendarPopover
                      range={range}
                      onChange={handleRangeChange}
                      onClear={handleRangeClear}
                    />
                  )}
                </div>
              </div>
            </div>

            {/* Grade de campanhas */}
            {pageItems.length > 0 ? (
              <div className="grid w-full grid-cols-4 gap-3">
                {pageItems.map((campaign) => (
                  <CampaignCard
                    key={campaign.id}
                    campaign={campaign}
                    menuOpen={openCardMenuId === campaign.id}
                    onToggleMenu={() => {
                      setOpenPanel(null);
                      setOpenCardMenuId((current) =>
                        current === campaign.id ? null : campaign.id
                      );
                    }}
                    onCloseMenu={() => setOpenCardMenuId(null)}
                    onOpen={() => navigate("/contratos")}
                  />
                ))}
              </div>
            ) : (
              <div className="flex w-full items-center justify-center py-16 text-base text-[#8e8e8e]">
                Nenhuma campanha encontrada.
              </div>
            )}

            {/* Paginação */}
            <div className="flex w-full items-center justify-between">
              <p className="whitespace-nowrap text-center text-sm font-medium text-[#5e5f5f]">
                Mostrando {showingFrom} a {showingTo} de {filtered.length} campanhas
              </p>
              <div className="flex items-center gap-4">
                <button
                  type="button"
                  aria-label="Página anterior"
                  disabled={currentPage <= 1}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  className={`flex h-8 items-center justify-center rounded-md border p-2 transition-colors ${
                    currentPage <= 1
                      ? "cursor-default border-[#e1e1e1] text-[#cacaca]"
                      : "border-[#cacaca] text-[#4b4b4b] hover:border-[#00842f] hover:text-[#00842f]"
                  }`}
                >
                  <ChevronLeftIcon size={16} />
                </button>
                <p className="whitespace-nowrap text-center text-sm font-medium text-[#5e5f5f]">
                  Página {currentPage} de {totalPages}
                </p>
                <button
                  type="button"
                  aria-label="Próxima página"
                  disabled={currentPage >= totalPages}
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  className={`flex h-8 items-center justify-center rounded-md border p-2 transition-colors ${
                    currentPage >= totalPages
                      ? "cursor-default border-[#e1e1e1] text-[#cacaca]"
                      : "border-[#cacaca] text-[#4b4b4b] hover:border-[#00842f] hover:text-[#00842f]"
                  }`}
                >
                  <ChevronRightIcon size={16} />
                </button>
              </div>
            </div>
          </div>

          <Footer />
        </main>
      </div>

      {/* Aviso pós-login: delegação ativa (ref 8241:16011) */}
      {showAvisoDelegacao && (
        <AvisoDelegacaoModal
          title="Você possui uma delegação ativa"
          message="Você designou como José Aldo responsável substituto por uma delegação até 20/06/2026."
          primaryLabel="Ver delegação"
          onPrimary={() => {
            setShowAvisoDelegacao(false);
            navigate("/delegacoes");
          }}
          onClose={() => setShowAvisoDelegacao(false)}
        />
      )}
    </div>
  );
}
