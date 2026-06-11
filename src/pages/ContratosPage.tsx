import { useState, useMemo, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import Footer from "../components/Footer";
import AppSidebar from "../components/AppSidebar";
import ContratosTable from "../components/contratos/ContratosTable";
import type { SortState } from "../components/contratos/ContratosTable";
import GerenciarColunasPanel from "../components/contratos/GerenciarColunasPanel";
import DetalhesContratoPanel from "../components/contratos/DetalhesContratoPanel";
import {
  AtencaoModal,
  SucessoModal,
  ContratosSelecionadosModal,
} from "../components/contratos/Modals";
import {
  AcoesPopover,
  VincularPopover,
  StatusDropdown,
  GerentesDropdown,
} from "../components/contratos/Popovers";
import VincularWizard from "../components/contratos/vincular/VincularWizard";
import type { VincularRole } from "../components/contratos/vincular/VincularWizard";
import CalendarPopover from "../components/campanhas/CalendarPopover";
import type { DateRange } from "../components/campanhas/CalendarPopover";
import {
  MOCK_CONTRATOS,
  DEFAULT_COLUMNS,
  GERENTES,
  type Contrato,
  type ColumnConfig,
  type ContratoStatus,
} from "../components/contratos/types";

type StatusFilter = "Todos" | "Aguardando aprovação" | "Aprovado" | "Aguardando vínculo";

type ActiveOverlay =
  | { kind: "gerenciarColunas" }
  | { kind: "detalhes"; contratoId: string }
  | { kind: "contratosSelecionados" }
  | { kind: "atencaoAprovar"; ids: string[] }
  | { kind: "atencaoReprovar"; id: string }
  | { kind: "atencaoDesvincular"; id: string }
  | { kind: "sucessoAprovado" }
  | { kind: "sucessoReprovado" }
  | { kind: "sucessoDesvinculado" }
  | { kind: "acoes"; id: string; x: number; y: number }
  | { kind: "verDetalhes"; id: string; x: number; y: number }
  | { kind: "vincular"; id: string; entry: "alterar" | "confirmar" }
  | { kind: "statusDropdown"; tableGroup: string; x: number; y: number }
  | null;

const ITEMS_PER_PAGE = 10;

// Exactly one mock row of the "Vinculados - Confirmar Vendedor" table is
// treated as having cadastro incompleto (Confirmar vínculo flow F).
const CADASTRO_INCOMPLETO_ID = "v2";

export default function ContratosPage() {
  const navigate = useNavigate();

  // ─── Data state ────────────────────────────────────────────────────────────
  const [contratos, setContratos] = useState<Contrato[]>(MOCK_CONTRATOS);
  const [columns, setColumns] = useState<ColumnConfig[]>(DEFAULT_COLUMNS);

  // ─── Filter state ──────────────────────────────────────────────────────────
  const [selectedGerentes, setSelectedGerentes] = useState<string[]>(["kaique"]);
  const [pendingGerentes, setPendingGerentes] = useState<string[]>(["kaique"]);
  const [gerenteSearch, setGerenteSearch] = useState("");
  const [showGerentesDropdown, setShowGerentesDropdown] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [dateRange, setDateRange] = useState<DateRange>({ start: null, end: null });
  const [showCalendar, setShowCalendar] = useState(false);
  const [statusFilters, setStatusFilters] = useState<Record<string, StatusFilter>>({
    kaique: "Todos",
    vinculados: "Todos",
    maria: "Todos",
    joao: "Todos",
    junior: "Todos",
  });

  // ─── Sort state (independent per table group) ──────────────────────────────
  const [sortStates, setSortStates] = useState<Record<string, SortState | null>>({
    kaique: null,
    vinculados: null,
    maria: null,
    joao: null,
    junior: null,
  });

  // ─── Selection state ───────────────────────────────────────────────────────
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  // ─── Overlay / modal state ─────────────────────────────────────────────────
  const [overlay, setOverlay] = useState<ActiveOverlay>(null);

  // ─── Pagination ────────────────────────────────────────────────────────────
  const [page, setPage] = useState(1);

  // ─── Contratos selecionados modal internal selection ──────────────────────
  const [modalSelectedIds, setModalSelectedIds] = useState<Set<string>>(new Set());

  // ─── Close overlay on Escape ───────────────────────────────────────────────
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setOverlay(null);
        setShowGerentesDropdown(false);
        setShowCalendar(false);
      }
    }
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, []);

  // ─── Normalise for search ──────────────────────────────────────────────────
  const normalise = useCallback((s: string) =>
    s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase(), []);

  // ─── Filtered contratos ────────────────────────────────────────────────────
  const filteredByGroup = useCallback(
    (group: string) => {
      const q = normalise(searchQuery.trim());
      return contratos.filter((c) => {
        if (c.tableGroup !== group) return false;
        if (q) {
          const haystack = normalise(
            `${c.numeroProposta} ${c.grupoEconomico} ${c.codigoRevenda} ${c.nomeCliente ?? ""}`
          );
          if (!haystack.includes(q)) return false;
        }
        return true;
      });
    },
    [contratos, searchQuery, normalise]
  );

  const kaique = filteredByGroup("kaique");
  const vinculados = filteredByGroup("vinculados");
  const maria = filteredByGroup("maria");
  const joao = filteredByGroup("joao");
  const junior = filteredByGroup("junior");

  const showKaique = selectedGerentes.includes("kaique");
  const showMaria = selectedGerentes.includes("maria");
  const showJoao = selectedGerentes.includes("joao");
  const showJunior = selectedGerentes.includes("junior");

  const allVisible = useMemo(() => {
    const rows: Contrato[] = [];
    if (showKaique) rows.push(...kaique, ...vinculados);
    if (showMaria) rows.push(...maria);
    if (showJoao) rows.push(...joao);
    if (showJunior) rows.push(...junior);
    return rows;
  }, [showKaique, showMaria, showJoao, showJunior, kaique, vinculados, maria, joao, junior]);

  const totalPages = Math.max(1, Math.ceil(allVisible.length / ITEMS_PER_PAGE));

  // ─── Helpers ───────────────────────────────────────────────────────────────
  function toggleSelection(id: string) {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function toggleAllInGroup(rows: Contrato[]) {
    setSelectedIds((prev) => {
      const allSel = rows.every((r) => prev.has(r.id));
      const next = new Set(prev);
      rows.forEach((r) => (allSel ? next.delete(r.id) : next.add(r.id)));
      return next;
    });
  }

  function updateStatus(ids: string[], status: ContratoStatus) {
    setContratos((prev) =>
      prev.map((c) => (ids.includes(c.id) ? { ...c, status } : c))
    );
  }

  function removeContratos(ids: string[]) {
    setContratos((prev) => prev.filter((c) => !ids.includes(c.id)));
    setSelectedIds((prev) => {
      const next = new Set(prev);
      ids.forEach((id) => next.delete(id));
      return next;
    });
  }

  // ─── Overlay actions ───────────────────────────────────────────────────────
  function handleAprovarSelecionados() {
    const selectedContratos = kaique.filter((c) => selectedIds.has(c.id));
    setModalSelectedIds(new Set(selectedContratos.map((c) => c.id)));
    setOverlay({ kind: "contratosSelecionados" });
  }

  function confirmAprovar(ids: string[]) {
    updateStatus(ids, "Aprovado");
    setSelectedIds(new Set());
    setOverlay({ kind: "sucessoAprovado" });
  }

  function confirmReprovar(id: string) {
    updateStatus([id], "Reprovado");
    setOverlay({ kind: "sucessoReprovado" });
  }

  function confirmDesvincular(id: string) {
    removeContratos([id]);
    setOverlay({ kind: "sucessoDesvinculado" });
  }

  // ─── Vincular Vendedor flow ────────────────────────────────────────────────
  function vincularFuncionario(id: string, role: VincularRole, nome: string) {
    setContratos((prev) =>
      prev.map((c) =>
        c.id === id
          ? role === "Vendedor"
            ? { ...c, vendedor: nome, status: "Aguardando aprovação" as ContratoStatus }
            : { ...c, gerente: nome }
          : c
      )
    );
  }

  function atualizarDadosVendedor(id: string, nome: string, vincular: boolean) {
    setContratos((prev) =>
      prev.map((c) =>
        c.id === id
          ? {
              ...c,
              vendedor: nome,
              ...(vincular ? { status: "Aguardando aprovação" as ContratoStatus } : {}),
            }
          : c
      )
    );
  }

  function openStatusDropdown(group: string, x: number, y: number) {
    setOverlay({ kind: "statusDropdown", tableGroup: group, x, y });
  }

  function updateSort(group: string, sort: SortState | null) {
    setSortStates((prev) => ({ ...prev, [group]: sort }));
  }

  const findContrato = (id: string) => contratos.find((c) => c.id === id);

  // ─── Refs ──────────────────────────────────────────────────────────────────
  const calendarRef = useRef<HTMLDivElement>(null);

  return (
    <div className="flex min-h-screen w-full flex-col bg-white font-[Lato,sans-serif] text-[#4b4b4b]">
      <div className="flex flex-1 items-start">
        {/* Sidebar */}
        <AppSidebar />

        {/* Main content */}
        <main className="flex flex-1 flex-col min-w-0">
          {/* Page header */}
          <div className="flex items-center border-b border-[#e1e1e1] px-16 py-16">
            <div className="flex items-center gap-4">
              <svg className="size-6 text-[#00842f]" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
              </svg>
              <h1 className="text-xl font-bold leading-none text-[#00842f]">
                Gerenciamento de contratos
              </h1>
            </div>
          </div>

          <div className="flex flex-col items-start px-16 py-10">
            {/* Back link */}
            <div className="flex items-start py-6">
              <button
                onClick={() => navigate("/campanhas")}
                className="flex cursor-pointer items-center gap-2 text-base font-bold text-[#00842f] hover:underline"
              >
                <svg className="size-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <polyline points="15,18 9,12 15,6" />
                </svg>
                Voltar
              </button>
            </div>

            {/* Campaign info row */}
            <div className="flex w-full items-center justify-between border-b border-[#e1e1e1] p-6">
              {/* Campaign selector */}
              <div className="flex h-12 w-[400px] items-center justify-between rounded-md border border-[#cacaca] bg-white px-4 py-4">
                <div className="flex items-center gap-2">
                  <span className="text-base text-[#8e8e8e]">Campanha Dezembro</span>
                  <span className="rounded-md bg-[#dcfce7] px-2 py-1 text-sm leading-[17px] text-[#22c55e]">
                    Ativo
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <svg className="size-4 text-[#8e8e8e]" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                  <svg className="size-4 text-[#8e8e8e]" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <polyline points="6,9 12,15 18,9" />
                  </svg>
                </div>
              </div>

              {/* Summary cards */}
              <div className="flex items-center gap-2">
                {(
                  [
                    { label: "Total", value: "200", badge: "100 %", bg: "#eee", fg: "#4b4b4b" },
                    { label: "Vinculados", value: "50", badge: "25 %", bg: "#dcfce7", fg: "#22c55e" },
                    { label: "Aprovados", value: "5", badge: "10 %", bg: "#dcfce7", fg: "#22c55e" },
                    { label: "Não vinculados", value: "150", badge: "75 %", bg: "#ffedee", fg: "#cc0000" },
                  ] as { label: string; value: string; badge: string; bg: string; fg: string }[]
                ).map((card) => (
                  <div key={card.label} className="flex flex-col gap-2 rounded-lg border border-[#e1e1e1] px-2 py-3 min-w-[120px]">
                    <div className="flex items-center gap-2">
                      <div className="size-6" />
                      <span className="text-xs text-[#4b4b4b]">{card.label}</span>
                    </div>
                    <div className="flex w-full items-start justify-between">
                      <span className="text-[18px] font-black text-[#4b4b4b]">{card.value}</span>
                      <span
                        className="flex h-[21px] items-center justify-center rounded-md px-1 py-0.5 text-[11px] leading-[17px]"
                        style={{ backgroundColor: card.bg, color: card.fg }}
                      >
                        {card.badge}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Filters + tables section */}
            <div className="flex w-full flex-col gap-10 border-t border-[#efefef] pt-10">
              {/* Filter row */}
              <div className="flex w-full items-center justify-between">
                <div className="flex items-center gap-4">
                  {/* Gerentes dropdown */}
                  <div className="relative">
                    <button
                      onClick={() => setShowGerentesDropdown((v) => !v)}
                      className="flex h-12 w-[328px] items-center justify-between rounded-md border border-[#cacaca] bg-white px-3 py-3 text-base"
                    >
                      <span className="truncate text-[#8e8e8e]">
                        {selectedGerentes.length === 0
                          ? "Selecionar Gerentes de negócios"
                          : selectedGerentes
                              .map((id) => GERENTES.find((g) => g.id === id)?.label ?? id)
                              .join(", ")}
                      </span>
                      <svg
                        className={`ml-2 size-4 shrink-0 transition-transform ${showGerentesDropdown ? "rotate-180" : ""}`}
                        fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"
                      >
                        <polyline points="6,9 12,15 18,9" />
                      </svg>
                    </button>
                    {showGerentesDropdown && (
                      <GerentesDropdown
                        selected={pendingGerentes}
                        onToggle={(id) => {
                          setPendingGerentes((prev) =>
                            prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
                          );
                        }}
                        onSelecionar={() => {
                          setSelectedGerentes(pendingGerentes);
                          setShowGerentesDropdown(false);
                        }}
                        onClose={() => {
                          setShowGerentesDropdown(false);
                          setPendingGerentes(selectedGerentes);
                        }}
                        search={gerenteSearch}
                        onSearchChange={setGerenteSearch}
                      />
                    )}
                  </div>

                  {/* Search input */}
                  <div className="flex h-12 w-[500px] items-center justify-between rounded-md border border-[#cacaca] bg-white px-4 py-4">
                    <input
                      type="text"
                      placeholder="Digite o nº do contrato, grupo econômico ou código da revenda"
                      value={searchQuery}
                      onChange={(e) => { setSearchQuery(e.target.value); setPage(1); }}
                      className="flex-1 bg-transparent text-sm text-[#4b4b4b] placeholder-[#8e8e8e] outline-none"
                    />
                    <svg className="size-4 shrink-0 text-[#8e8e8e]" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                      <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
                    </svg>
                  </div>
                </div>

                {/* Right action buttons */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setOverlay({ kind: "gerenciarColunas" })}
                    className="flex h-10 items-center gap-2 rounded-md px-3 text-base font-bold text-[#00842f] hover:bg-[#e6f3ea]"
                  >
                    <svg className="size-4" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 4.5v15m6-15v15m-10.875 0h15.75c.621 0 1.125-.504 1.125-1.125V5.625c0-.621-.504-1.125-1.125-1.125H4.125C3.504 4.5 3 5.004 3 5.625v12.75c0 .621.504 1.125 1.125 1.125z" />
                    </svg>
                    Gerenciar colunas
                    <svg className="size-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                      <polyline points="6,9 12,15 18,9" />
                    </svg>
                  </button>

                  <button className="flex h-10 items-center gap-2 rounded-md px-3 text-base font-bold text-[#00842f] hover:bg-[#e6f3ea]">
                    <svg className="size-4" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
                    </svg>
                    Gerente
                    <svg className="size-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                      <polyline points="6,9 12,15 18,9" />
                    </svg>
                  </button>

                  <div ref={calendarRef} className="relative">
                    <button
                      onClick={() => setShowCalendar((v) => !v)}
                      className="flex h-10 items-center gap-2 rounded-md px-3 text-base font-bold text-[#00842f] hover:bg-[#e6f3ea]"
                    >
                      <svg className="size-4" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
                      </svg>
                      Período
                      <svg className="size-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                        <polyline points="6,9 12,15 18,9" />
                      </svg>
                    </button>
                    {showCalendar && (
                      <div className="absolute right-0 top-full z-50 mt-1">
                        <CalendarPopover
                          range={dateRange}
                          onChange={setDateRange}
                          onClear={() => setDateRange({ start: null, end: null })}
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Tables */}
              <div className="flex flex-col gap-10">
                {showKaique && (
                  <>
                    <ContratosTable
                      groupLabel="Kaique Atene GC"
                      contratos={kaique}
                      columns={columns}
                      selectedIds={selectedIds}
                      onToggle={toggleSelection}
                      onSelectAll={() => toggleAllInGroup(kaique)}
                      onAprovarSelected={handleAprovarSelecionados}
                      onAcoes={(id, x, y) => setOverlay({ kind: "acoes", id, x, y })}
                      onDetalhes={(id, x, y) => setOverlay({ kind: "verDetalhes", id, x, y })}
                      showAprovarAction
                      statusFilter={statusFilters.kaique}
                      onStatusFilterOpen={(x, y) => openStatusDropdown("kaique", x, y)}
                      sort={sortStates.kaique ?? null}
                      onSortChange={(s) => updateSort("kaique", s)}
                    />
                    <ContratosTable
                      groupLabel="Vinculados - Confirmar Vendedor"
                      contratos={vinculados}
                      columns={columns}
                      selectedIds={selectedIds}
                      onToggle={toggleSelection}
                      onSelectAll={() => toggleAllInGroup(vinculados)}
                      onAprovarSelected={() => {}}
                      onAcoes={(id, x, y) => setOverlay({ kind: "acoes", id, x, y })}
                      onDetalhes={(id, x, y) => setOverlay({ kind: "verDetalhes", id, x, y })}
                      showAprovarAction={false}
                      showDetalhes
                      statusFilter={statusFilters.vinculados}
                      onStatusFilterOpen={(x, y) => openStatusDropdown("vinculados", x, y)}
                      sort={sortStates.vinculados ?? null}
                      onSortChange={(s) => updateSort("vinculados", s)}
                    />
                  </>
                )}
                {showMaria && (
                  <ContratosTable
                    groupLabel="Maria GC"
                    contratos={maria}
                    columns={columns}
                    selectedIds={selectedIds}
                    onToggle={toggleSelection}
                    onSelectAll={() => toggleAllInGroup(maria)}
                    onAprovarSelected={handleAprovarSelecionados}
                    onAcoes={(id, x, y) => setOverlay({ kind: "acoes", id, x, y })}
                    onDetalhes={(id, x, y) => setOverlay({ kind: "verDetalhes", id, x, y })}
                    showAprovarAction
                    statusFilter={statusFilters.maria}
                    onStatusFilterOpen={(x, y) => openStatusDropdown("maria", x, y)}
                    sort={sortStates.maria ?? null}
                    onSortChange={(s) => updateSort("maria", s)}
                  />
                )}
                {showJoao && (
                  <ContratosTable
                    groupLabel="João GC"
                    contratos={joao}
                    columns={columns}
                    selectedIds={selectedIds}
                    onToggle={toggleSelection}
                    onSelectAll={() => toggleAllInGroup(joao)}
                    onAprovarSelected={handleAprovarSelecionados}
                    onAcoes={(id, x, y) => setOverlay({ kind: "acoes", id, x, y })}
                    onDetalhes={(id, x, y) => setOverlay({ kind: "verDetalhes", id, x, y })}
                    showAprovarAction
                    statusFilter={statusFilters.joao}
                    onStatusFilterOpen={(x, y) => openStatusDropdown("joao", x, y)}
                    sort={sortStates.joao ?? null}
                    onSortChange={(s) => updateSort("joao", s)}
                  />
                )}
                {showJunior && (
                  <ContratosTable
                    groupLabel="Junior GC"
                    contratos={junior}
                    columns={columns}
                    selectedIds={selectedIds}
                    onToggle={toggleSelection}
                    onSelectAll={() => toggleAllInGroup(junior)}
                    onAprovarSelected={handleAprovarSelecionados}
                    onAcoes={(id, x, y) => setOverlay({ kind: "acoes", id, x, y })}
                    onDetalhes={(id, x, y) => setOverlay({ kind: "verDetalhes", id, x, y })}
                    showAprovarAction
                    statusFilter={statusFilters.junior}
                    onStatusFilterOpen={(x, y) => openStatusDropdown("junior", x, y)}
                    sort={sortStates.junior ?? null}
                    onSortChange={(s) => updateSort("junior", s)}
                  />
                )}
              </div>

              {/* Pagination */}
              <div className="flex w-full items-center justify-between">
                <p className="text-sm text-[#5e5f5f]">
                  Mostrando 1 a {Math.min(ITEMS_PER_PAGE, allVisible.length)} de{" "}
                  {allVisible.length} campanhas
                </p>
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="flex size-8 items-center justify-center rounded-md border border-[#e1e1e1] disabled:opacity-40"
                  >
                    <svg className="size-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                      <polyline points="15,18 9,12 15,6" />
                    </svg>
                  </button>
                  <p className="text-sm text-[#5e5f5f]">Página {page} de {totalPages}</p>
                  <button
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                    className="flex size-8 items-center justify-center rounded-md border border-[#cacaca] disabled:opacity-40"
                  >
                    <svg className="size-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                      <polyline points="9,18 15,12 9,6" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>

          <Footer />
        </main>
      </div>

      {/* ── Overlays ── */}

      {/* Gerenciar colunas panel */}
      {overlay?.kind === "gerenciarColunas" && (
        <>
          <div className="fixed inset-0 z-30 bg-black/20" onClick={() => setOverlay(null)} />
          <GerenciarColunasPanel
            columns={columns}
            defaultColumns={DEFAULT_COLUMNS}
            onApply={(cols) => { setColumns(cols); setOverlay(null); }}
            onCancel={() => setOverlay(null)}
          />
        </>
      )}

      {/* Detalhes panel */}
      {overlay?.kind === "detalhes" && (() => {
        const c = findContrato(overlay.contratoId);
        return c ? (
          <>
            <div className="fixed inset-0 z-30 bg-black/20" onClick={() => setOverlay(null)} />
            <DetalhesContratoPanel contrato={c} onClose={() => setOverlay(null)} />
          </>
        ) : null;
      })()}

      {/* Contratos selecionados modal */}
      {overlay?.kind === "contratosSelecionados" && (
        <ContratosSelecionadosModal
          contratos={kaique.filter((c) => selectedIds.has(c.id))}
          selectedIds={modalSelectedIds}
          onToggle={(id) => {
            setModalSelectedIds((prev) => {
              const next = new Set(prev);
              if (next.has(id)) next.delete(id);
              else next.add(id);
              return next;
            });
          }}
          onToggleAll={() => {
            const visible = kaique.filter((c) => selectedIds.has(c.id));
            const allSel = visible.every((c) => modalSelectedIds.has(c.id));
            setModalSelectedIds(allSel ? new Set() : new Set(visible.map((c) => c.id)));
          }}
          onAprovar={() => setOverlay({ kind: "atencaoAprovar", ids: [...modalSelectedIds] })}
          onCancel={() => setOverlay(null)}
        />
      )}

      {overlay?.kind === "atencaoAprovar" && (
        <AtencaoModal
          question="Deseja aprovar este(s) contrato(s)?"
          onConfirm={() => confirmAprovar(overlay.ids)}
          onCancel={() => setOverlay(null)}
        />
      )}

      {overlay?.kind === "atencaoReprovar" && (
        <AtencaoModal
          question="Deseja reprovar este(s) contrato(s)?"
          onConfirm={() => confirmReprovar(overlay.id)}
          onCancel={() => setOverlay(null)}
        />
      )}

      {overlay?.kind === "atencaoDesvincular" && (
        <AtencaoModal
          question="Deseja desvincular este contrato?"
          onConfirm={() => confirmDesvincular(overlay.id)}
          onCancel={() => setOverlay(null)}
        />
      )}

      {overlay?.kind === "sucessoAprovado" && (
        <SucessoModal message={"Contrato aprovado\ncom sucesso!"} onOk={() => setOverlay(null)} />
      )}
      {overlay?.kind === "sucessoReprovado" && (
        <SucessoModal message={"Contrato reprovado\ncom sucesso!"} onOk={() => setOverlay(null)} />
      )}
      {overlay?.kind === "sucessoDesvinculado" && (
        <SucessoModal message={"Contrato desvinculado\ncom sucesso!"} onOk={() => setOverlay(null)} />
      )}

      {overlay?.kind === "acoes" && (
        <AcoesPopover
          x={overlay.x}
          y={overlay.y}
          onAprovar={() => setOverlay({ kind: "atencaoAprovar", ids: [overlay.id] })}
          onReprovar={() => setOverlay({ kind: "atencaoReprovar", id: overlay.id })}
          onDesvincular={() => setOverlay({ kind: "atencaoDesvincular", id: overlay.id })}
          onVerDetalhes={() => setOverlay({ kind: "detalhes", contratoId: overlay.id })}
          onClose={() => setOverlay(null)}
        />
      )}

      {overlay?.kind === "verDetalhes" && (
        <VincularPopover
          x={overlay.x}
          y={overlay.y}
          onAlterarVinculo={() => setOverlay({ kind: "vincular", id: overlay.id, entry: "alterar" })}
          onConfirmarVinculo={() => setOverlay({ kind: "vincular", id: overlay.id, entry: "confirmar" })}
          onVerDetalhes={() => setOverlay({ kind: "detalhes", contratoId: overlay.id })}
          onClose={() => setOverlay(null)}
        />
      )}

      {overlay?.kind === "vincular" && (
        <VincularWizard
          entry={overlay.entry}
          cadastroIncompleto={overlay.id === CADASTRO_INCOMPLETO_ID}
          onVincular={(role, nome) => vincularFuncionario(overlay.id, role, nome)}
          onConfirmarVinculo={() => updateStatus([overlay.id], "Aguardando aprovação")}
          onAtualizarDados={(nome, vincular) => atualizarDadosVendedor(overlay.id, nome, vincular)}
          onClose={() => setOverlay(null)}
        />
      )}

      {overlay?.kind === "statusDropdown" && (
        <StatusDropdown
          x={overlay.x}
          y={overlay.y}
          current={statusFilters[overlay.tableGroup] ?? "Todos"}
          onSelect={(s) => {
            setStatusFilters((prev) => ({ ...prev, [overlay.tableGroup]: s }));
          }}
          onClose={() => setOverlay(null)}
        />
      )}
    </div>
  );
}
