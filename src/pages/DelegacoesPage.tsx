import { useEffect, useMemo, useRef, useState } from "react";
import AppSidebar from "../components/AppSidebar";
import Footer from "../components/Footer";
import {
  CheckIcon,
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  SearchIcon,
} from "../components/campanhas/icons";
import DelegacaoFormModal from "../components/delegacoes/DelegacaoFormModal";
import type { DelegacaoFormData } from "../components/delegacoes/DelegacaoFormModal";
import {
  AtencaoDelegacaoModal,
  SucessoDelegacaoModal,
} from "../components/delegacoes/DelegacaoModals";
import DelegacoesTable, { sortDelegacoes } from "../components/delegacoes/DelegacoesTable";
import type { SortState } from "../components/delegacoes/DelegacoesTable";
import { PlusIcon, UsersIcon } from "../components/delegacoes/icons";
import { DropdownPanel } from "../components/delegacoes/ModalShell";
import {
  MOCK_DELEGACOES,
  fraseSubstitutos,
  normalize,
  statusFromRange,
} from "../components/delegacoes/types";
import type { Delegacao, DelegacaoStatus } from "../components/delegacoes/types";

const ITEMS_PER_PAGE = 10;

type StatusFilter = "Todos" | DelegacaoStatus;

const STATUS_OPTIONS: StatusFilter[] = ["Todos", "Ativa", "Agendada", "Encerrada"];

type Overlay =
  | { kind: "cadastrar" }
  | { kind: "editar"; delegacao: Delegacao }
  | { kind: "visualizar"; delegacao: Delegacao }
  | { kind: "excluir"; delegacao: Delegacao }
  | { kind: "sucesso"; title: string; message?: string }
  | null;

export default function DelegacoesPage() {
  const [delegacoes, setDelegacoes] = useState<Delegacao[]>(MOCK_DELEGACOES);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("Todos");
  const [statusOpen, setStatusOpen] = useState(false);
  const [sort, setSort] = useState<SortState | null>(null);
  const [page, setPage] = useState(1);
  const [overlay, setOverlay] = useState<Overlay>(null);

  const statusRef = useRef<HTMLDivElement>(null);

  // Click-away + Escape fecham o dropdown de status
  useEffect(() => {
    if (!statusOpen) return;
    function handleMouseDown(e: MouseEvent) {
      if (statusRef.current && !statusRef.current.contains(e.target as Node)) {
        setStatusOpen(false);
      }
    }
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") setStatusOpen(false);
    }
    document.addEventListener("mousedown", handleMouseDown);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("mousedown", handleMouseDown);
      document.removeEventListener("keydown", handleKey);
    };
  }, [statusOpen]);

  const filtered = useMemo(() => {
    const term = normalize(search.trim());
    return delegacoes.filter((d) => {
      if (term && !normalize(d.titular).includes(term)) return false;
      if (statusFilter !== "Todos" && d.status !== statusFilter) return false;
      return true;
    });
  }, [delegacoes, search, statusFilter]);

  const sorted = useMemo(() => sortDelegacoes(filtered, sort), [filtered, sort]);

  const totalPages = Math.max(1, Math.ceil(sorted.length / ITEMS_PER_PAGE));
  const currentPage = Math.min(page, totalPages);
  const pageItems = sorted.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  function resetPage() {
    setPage(1);
  }

  function handleCadastrar(data: DelegacaoFormData) {
    const nova: Delegacao = {
      id: `d${Date.now()}`,
      // A delegação criada pela usuária logada (Gerente de Negócios)
      tipo: "Gerente de Negócios",
      titular: data.titular,
      substitutos: data.substitutos,
      inicio: data.inicio,
      fim: data.fim,
      motivo: data.motivo,
      observacao: data.observacao,
      status: statusFromRange(data.inicio, data.fim),
    };
    setDelegacoes((prev) => [...prev, nova]);
    setOverlay({
      kind: "sucesso",
      title: "Cadastro feito com sucesso!",
      message: fraseSubstitutos(data.substitutos),
    });
  }

  function handleEditar(original: Delegacao, data: DelegacaoFormData) {
    setDelegacoes((prev) =>
      prev.map((d) =>
        d.id === original.id
          ? {
              ...d,
              titular: data.titular,
              substitutos: data.substitutos,
              inicio: data.inicio,
              fim: data.fim,
              motivo: data.motivo,
              observacao: data.observacao,
              status: statusFromRange(data.inicio, data.fim),
            }
          : d
      )
    );
    setOverlay({
      kind: "sucesso",
      title: "Edição realizada com sucesso!",
      message: fraseSubstitutos(data.substitutos),
    });
  }

  function handleExcluir(delegacao: Delegacao) {
    setDelegacoes((prev) => prev.filter((d) => d.id !== delegacao.id));
    setOverlay({ kind: "sucesso", title: "Delegação excluída com sucesso" });
  }

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-white font-[Lato,sans-serif]">
      <div className="flex min-h-0 flex-1 items-stretch">
        <AppSidebar />

        <main className="flex min-h-0 min-w-0 flex-1 flex-col overflow-y-auto bg-white">
          {/* Cabeçalho */}
          <div className="flex w-full items-center border-b border-[#e1e1e1] p-16">
            <div className="flex items-center gap-4">
              <UsersIcon size={24} className="text-[#00842f]" />
              <h1 className="whitespace-nowrap text-[22px] font-bold leading-[26px] text-[#00842f]">
                Gerenciamento de Delegações
              </h1>
            </div>
          </div>

          {/* Conteúdo */}
          <div className="flex w-full flex-1 flex-col items-start gap-8 p-16">
            {/* Busca + filtro de status + nova delegação */}
            <div className="flex w-full items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                {/* Busca por responsável titular */}
                <div className="flex h-12 w-[400px] max-w-full items-center justify-between gap-2 rounded-md border border-[#cacaca] bg-white px-4 transition-colors duration-150 focus-within:border-[#00842f]">
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => {
                      setSearch(e.target.value);
                      resetPage();
                    }}
                    placeholder="Buscar por responsável titular"
                    className="w-full bg-transparent text-base leading-4 text-[#191919] outline-none placeholder:text-[#8e8e8e]"
                  />
                  <SearchIcon size={16} className="shrink-0 text-[#4b4b4b]" />
                </div>

                {/* Status das Delegações */}
                <div ref={statusRef} className="relative">
                  <button
                    type="button"
                    aria-haspopup="listbox"
                    aria-expanded={statusOpen}
                    onClick={() => setStatusOpen((v) => !v)}
                    className="flex h-12 w-[260px] cursor-pointer items-center justify-between gap-2 rounded-md border border-[#cacaca] bg-white px-4 text-base leading-4 transition-colors duration-150 hover:border-[#00842f] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00842f]"
                  >
                    <span className={statusFilter === "Todos" ? "text-[#8e8e8e]" : "text-[#191919]"}>
                      {statusFilter === "Todos" ? "Status das Delegações" : statusFilter}
                    </span>
                    <ChevronDownIcon
                      size={16}
                      className={`shrink-0 text-[#4b4b4b] transition-transform duration-200 ${
                        statusOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                  {statusOpen && (
                    <DropdownPanel className="left-0 top-[calc(100%+4px)] w-full">
                      {STATUS_OPTIONS.map((option, i) => {
                        const isSelected = option === statusFilter;
                        return (
                          <button
                            key={option}
                            type="button"
                            onClick={() => {
                              setStatusFilter(option);
                              setStatusOpen(false);
                              resetPage();
                            }}
                            className={`flex h-[45px] w-full cursor-pointer items-center justify-between gap-2 px-4 py-3 text-left text-sm leading-[17px] transition-colors duration-150 hover:bg-[#e6f3ea] ${
                              i % 2 === 1 ? "bg-[#f5f5f5]" : "bg-white"
                            } ${isSelected ? "font-bold text-[#00842f]" : "text-[#4b4b4b]"}`}
                          >
                            {option}
                            {isSelected && <CheckIcon size={16} className="text-[#00842f]" />}
                          </button>
                        );
                      })}
                    </DropdownPanel>
                  )}
                </div>
              </div>

              {/* Nova Delegação */}
              <button
                type="button"
                onClick={() => setOverlay({ kind: "cadastrar" })}
                className="flex h-12 shrink-0 cursor-pointer items-center gap-2 rounded-md bg-[#00842f] px-8 text-base font-bold text-white transition-[background-color,transform] duration-150 hover:bg-[#006b26] active:scale-[0.99] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00842f] focus-visible:ring-offset-2"
              >
                <PlusIcon size={16} />
                Nova Delegação
              </button>
            </div>

            {/* Tabela / estado vazio */}
            {pageItems.length > 0 ? (
              <>
                <DelegacoesTable
                  delegacoes={pageItems}
                  sort={sort}
                  onSortChange={setSort}
                  onVisualizar={(d) => setOverlay({ kind: "visualizar", delegacao: d })}
                  onEditar={(d) => setOverlay({ kind: "editar", delegacao: d })}
                  onExcluir={(d) => setOverlay({ kind: "excluir", delegacao: d })}
                />

                {/* Rodapé da tabela */}
                <div className="flex w-full items-center justify-between">
                  <p className="whitespace-nowrap text-sm font-medium text-[#5e5f5f]">
                    Mostrando {pageItems.length} {pageItems.length === 1 ? "item" : "itens"}
                  </p>
                  <div className="flex items-center gap-4">
                    <button
                      type="button"
                      aria-label="Página anterior"
                      disabled={currentPage <= 1}
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      className={`flex h-8 items-center justify-center rounded-md border p-2 transition-colors duration-150 ${
                        currentPage <= 1
                          ? "cursor-default border-[#e1e1e1] text-[#cacaca]"
                          : "cursor-pointer border-[#cacaca] text-[#4b4b4b] hover:border-[#00842f] hover:text-[#00842f]"
                      }`}
                    >
                      <ChevronLeftIcon size={16} />
                    </button>
                    <p className="whitespace-nowrap text-sm font-medium text-[#5e5f5f]">
                      Página {currentPage} de {totalPages}
                    </p>
                    <button
                      type="button"
                      aria-label="Próxima página"
                      disabled={currentPage >= totalPages}
                      onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                      className={`flex h-8 items-center justify-center rounded-md border p-2 transition-colors duration-150 ${
                        currentPage >= totalPages
                          ? "cursor-default border-[#e1e1e1] text-[#cacaca]"
                          : "cursor-pointer border-[#cacaca] text-[#4b4b4b] hover:border-[#00842f] hover:text-[#00842f]"
                      }`}
                    >
                      <ChevronRightIcon size={16} />
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex w-full flex-col items-center justify-center rounded-lg bg-[#f5f5f5] py-20">
                <p className="text-base text-[#8e8e8e]">Nenhum resultado encontrado</p>
              </div>
            )}
          </div>

          <Footer />
        </main>
      </div>

      {/* ── Overlays ── */}

      {overlay?.kind === "cadastrar" && (
        <DelegacaoFormModal
          mode="cadastrar"
          onSave={handleCadastrar}
          onClose={() => setOverlay(null)}
        />
      )}

      {overlay?.kind === "editar" && (
        <DelegacaoFormModal
          mode="editar"
          initial={overlay.delegacao}
          onSave={(data) => handleEditar(overlay.delegacao, data)}
          onClose={() => setOverlay(null)}
        />
      )}

      {overlay?.kind === "visualizar" && (
        <DelegacaoFormModal
          mode="visualizar"
          initial={overlay.delegacao}
          onSave={() => setOverlay(null)}
          onClose={() => setOverlay(null)}
        />
      )}

      {overlay?.kind === "excluir" && (
        <AtencaoDelegacaoModal
          question="Deseja realmente excluir essa delegação"
          onConfirm={() => handleExcluir(overlay.delegacao)}
          onCancel={() => setOverlay(null)}
        />
      )}

      {overlay?.kind === "sucesso" && (
        <SucessoDelegacaoModal
          title={overlay.title}
          message={overlay.message}
          onOk={() => setOverlay(null)}
        />
      )}
    </div>
  );
}
