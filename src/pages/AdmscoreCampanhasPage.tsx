import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import AdmscoreSidebar from "../components/admscore/AdmscoreSidebar";
import Footer from "../components/Footer";
import {
  CampanhasIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  SearchIcon,
} from "../components/admscore/icons";
import CadastrarCampanhaFlow, {
  type NovaCampanha,
  type TipoCampanha,
} from "../components/admscore/CampanhaModals";

type StatusCampanha = "Ativa" | "Encerrada";

interface Campanha {
  id: number;
  nome: string;
  tipo: TipoCampanha;
  periodo: string;
  meta: string;
  pontuacao: string;
  status: StatusCampanha;
}

const DADOS: Campanha[] = [
  { id: 1, nome: "Natal 2025", tipo: "Campanha faturamento", periodo: "01/12/2025 – 31/12/2025", meta: "R$ 250.000,00", pontuacao: "10 pontos", status: "Ativa" },
  { id: 2, nome: "Ano Novo 2026", tipo: "Campanha valor", periodo: "01/01/2026 – 31/01/2026", meta: "R$ 180.000,00", pontuacao: "15 pontos", status: "Ativa" },
  { id: 3, nome: "Páscoa 2025", tipo: "Campanha valor fixo", periodo: "01/04/2025 – 30/04/2025", meta: "R$ 90.000,00", pontuacao: "8 pontos", status: "Encerrada" },
  { id: 4, nome: "Dia das Mães 2025", tipo: "Campanha faturamento", periodo: "01/05/2025 – 15/05/2025", meta: "R$ 120.000,00", pontuacao: "12 pontos", status: "Encerrada" },
];

const STATUS_STYLE: Record<StatusCampanha, string> = {
  Ativa: "bg-[#e6f3ea] text-[#00842f]",
  Encerrada: "bg-[#eeeeee] text-[#8e8e8e]",
};

export default function AdmscoreCampanhasPage() {
  const navigate = useNavigate();
  const [busca, setBusca] = useState("");
  const [campanhas, setCampanhas] = useState<Campanha[]>(DADOS);
  const [showNova, setShowNova] = useState(false);

  const filtradas = useMemo(() => {
    const q = busca.trim().toLowerCase();
    if (!q) return campanhas;
    return campanhas.filter((c) => c.nome.toLowerCase().includes(q));
  }, [busca, campanhas]);

  function criarCampanha(nova: NovaCampanha) {
    setCampanhas((prev) => [
      {
        id: Math.max(0, ...prev.map((c) => c.id)) + 1,
        nome: nova.nome,
        tipo: nova.tipo,
        periodo: `${nova.inicio} – ${nova.termino}`,
        meta: nova.meta,
        pontuacao: nova.pontuacao,
        status: "Ativa",
      },
      ...prev,
    ]);
    setShowNova(false);
  }

  const thClass = "px-4 py-3 text-left text-xs font-bold text-[#4b4b4b] whitespace-nowrap";
  const tdClass = "px-4 py-4 text-sm text-black whitespace-nowrap";

  return (
    <div className="flex min-h-screen bg-white">
      <AdmscoreSidebar />

      <div className="flex min-w-0 flex-1 flex-col">
        <main className="flex flex-1 flex-col gap-6 p-8">
          {/* Cabeçalho */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CampanhasIcon className="size-6 text-[#00842f]" />
              <h1 className="text-xl font-bold text-[#00842f]">Gerenciamento de campanhas</h1>
            </div>
            <button
              type="button"
              onClick={() => navigate("/admscore/usuarios")}
              className="flex items-center gap-1 text-sm text-[#4b4b4b] transition-colors hover:text-black"
            >
              <ChevronLeftIcon className="size-4" />
              Voltar
            </button>
          </div>

          {/* Barra de ferramentas */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="relative w-full max-w-[320px]">
              <SearchIcon className="absolute left-3 top-1/2 size-5 -translate-y-1/2 text-[#8e8e8e]" />
              <input
                type="text"
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
                placeholder="Buscar por nome da campanha"
                className="h-11 w-full rounded-md border border-[#cacaca] bg-white pl-10 pr-4 text-sm text-black outline-none transition-colors placeholder:text-[#8e8e8e] focus:border-[#00842f]"
              />
            </div>
            <button
              type="button"
              onClick={() => setShowNova(true)}
              className="flex h-11 items-center justify-center rounded-md bg-[#00842f] px-6 text-sm font-bold text-white transition-colors hover:bg-[#006b26]"
            >
              Nova campanha
            </button>
          </div>

          {/* Tabela */}
          <div className="overflow-x-auto rounded-lg border border-[#e1e1e1]">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-[#e1e1e1]">
                  <th className={thClass}>Nome da campanha</th>
                  <th className={thClass}>Tipo</th>
                  <th className={thClass}>Período</th>
                  <th className={thClass}>Meta</th>
                  <th className={thClass}>Pontuação por venda</th>
                  <th className={thClass}>Status</th>
                </tr>
              </thead>
              <tbody>
                {filtradas.map((c) => (
                  <tr key={c.id} className="border-b border-[#f0f0f0] last:border-0 hover:bg-[#fafafa]">
                    <td className={`${tdClass} font-bold`}>{c.nome}</td>
                    <td className={tdClass}>{c.tipo}</td>
                    <td className={`${tdClass} text-[#4b4b4b]`}>{c.periodo}</td>
                    <td className={tdClass}>{c.meta}</td>
                    <td className={tdClass}>{c.pontuacao}</td>
                    <td className={tdClass}>
                      <span
                        className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-bold ${STATUS_STYLE[c.status]}`}
                      >
                        {c.status}
                      </span>
                    </td>
                  </tr>
                ))}
                {filtradas.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-4 py-10 text-center text-sm text-[#8e8e8e]">
                      Nenhuma campanha encontrada.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Paginação */}
          <div className="flex items-center justify-center gap-6 text-sm text-[#4b4b4b]">
            <span>
              1 - {filtradas.length} de {filtradas.length} registros
            </span>
            <div className="flex items-center gap-1">
              <button
                type="button"
                aria-label="Página anterior"
                className="flex size-8 items-center justify-center rounded text-[#8e8e8e] hover:bg-[#f0f0f0]"
              >
                <ChevronLeftIcon className="size-4" />
              </button>
              <button
                type="button"
                className="flex size-8 items-center justify-center rounded-full bg-[#00842f] text-sm font-bold text-white"
              >
                1
              </button>
              <button
                type="button"
                aria-label="Próxima página"
                className="flex size-8 items-center justify-center rounded text-[#4b4b4b] hover:bg-[#f0f0f0]"
              >
                <ChevronRightIcon className="size-4" />
              </button>
            </div>
          </div>
        </main>

        <Footer />
      </div>

      {/* Fluxo: Nova campanha (Etapa 1 → Etapa 2 → Confirmação → Sucesso) */}
      {showNova && <CadastrarCampanhaFlow onCriar={criarCampanha} onClose={() => setShowNova(false)} />}
    </div>
  );
}
