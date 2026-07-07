import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import AdmscoreSidebar from "../components/admscore/AdmscoreSidebar";
import Footer from "../components/Footer";
import {
  CalendarIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  EyeIcon,
  EyeOffIcon,
  SearchIcon,
  SessoesIcon,
} from "../components/admscore/icons";

interface Sessao {
  id: number;
  funcional: string;
  campanha: string;
  acesso: string;
}

const DADOS: Sessao[] = [
  { id: 1, funcional: "153652", campanha: "Natal 2025", acesso: "30/06/25 14:05" },
  { id: 2, funcional: "153659", campanha: "Natal 2025", acesso: "30/06/25 14:05" },
  { id: 3, funcional: "153658", campanha: "Natal 2025", acesso: "30/06/25 14:05" },
  { id: 4, funcional: "153652", campanha: "Ano Novo 2026", acesso: "30/06/25 14:05" },
  { id: 5, funcional: "152569", campanha: "Ano Novo 2026", acesso: "30/06/25 14:05" },
  { id: 6, funcional: "153652", campanha: "Ano Novo 2026", acesso: "30/06/25 14:05" },
  { id: 7, funcional: "154463", campanha: "Páscoa 2025", acesso: "30/06/25 14:05" },
  { id: 8, funcional: "159056", campanha: "Páscoa 2025", acesso: "30/06/25 14:05" },
];

export default function AdmscoreSessoesPage() {
  const navigate = useNavigate();
  const [busca, setBusca] = useState("");
  const [periodo, setPeriodo] = useState("");
  const [filtroFuncional, setFiltroFuncional] = useState("");

  const filtradas = useMemo(() => {
    const q = filtroFuncional.trim();
    if (!q) return DADOS;
    return DADOS.filter((s) => s.funcional.includes(q));
  }, [filtroFuncional]);

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
              <SessoesIcon className="size-6 text-[#00842f]" />
              <h1 className="text-xl font-bold text-[#00842f]">Gerenciamento de sessões</h1>
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
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative w-full max-w-[280px]">
              <SearchIcon className="absolute left-3 top-1/2 size-5 -translate-y-1/2 text-[#8e8e8e]" />
              <input
                type="text"
                value={busca}
                onChange={(e) => setBusca(e.target.value.replace(/\D/g, ""))}
                placeholder="Busque por funcional"
                className="h-11 w-full rounded-md border border-[#cacaca] bg-white pl-10 pr-4 text-sm text-black outline-none transition-colors placeholder:text-[#8e8e8e] focus:border-[#00842f]"
              />
            </div>
            <div className="ml-auto flex flex-wrap items-center gap-3">
              <div className="relative w-[220px]">
                <input
                  type="text"
                  value={periodo}
                  onChange={(e) => setPeriodo(e.target.value)}
                  placeholder="Selecione o período"
                  className="h-11 w-full rounded-md border border-[#cacaca] bg-white pl-4 pr-10 text-sm text-black outline-none transition-colors placeholder:text-[#8e8e8e] focus:border-[#00842f]"
                />
                <CalendarIcon className="absolute right-3 top-1/2 size-5 -translate-y-1/2 text-[#4b4b4b]" />
              </div>
              <button
                type="button"
                onClick={() => setFiltroFuncional(busca)}
                className="flex h-11 items-center justify-center rounded-md bg-[#00842f] px-6 text-sm font-bold text-white transition-colors hover:bg-[#006b26]"
              >
                Filtrar
              </button>
              <button
                type="button"
                onClick={() => {
                  setBusca("");
                  setPeriodo("");
                  setFiltroFuncional("");
                }}
                className="text-sm font-bold text-[#00842f] transition-colors hover:text-[#006b26] hover:underline"
              >
                Limpar filtro
              </button>
            </div>
          </div>

          {/* Tabela ou estado vazio */}
          {filtradas.length > 0 ? (
            <>
              <div className="overflow-x-auto rounded-lg border border-[#e1e1e1]">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b border-[#e1e1e1]">
                      <th className={thClass}>Funcional</th>
                      <th className={thClass}>Campanha</th>
                      <th className={thClass}>Data/hora de acesso</th>
                      <th className={`${thClass} text-center`}>Clarity</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtradas.map((s) => (
                      <tr key={s.id} className="border-b border-[#f0f0f0] last:border-0 hover:bg-[#fafafa]">
                        <td className={tdClass}>{s.funcional}</td>
                        <td className={tdClass}>{s.campanha}</td>
                        <td className={`${tdClass} text-[#4b4b4b]`}>{s.acesso}</td>
                        <td className={`${tdClass} text-center`}>
                          <button
                            type="button"
                            className="mx-auto flex items-center gap-1 rounded px-2 py-1 text-sm text-[#00842f] transition-colors hover:text-[#006b26]"
                          >
                            <EyeIcon className="size-5" />
                            Ver
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <p className="text-center text-xs text-[#8e8e8e]">
                As gravações ficam disponíveis após 30 minutos. Antes disso, a consulta deve ser
                feita via "Live" no Clarity.
              </p>

              <div className="flex items-center justify-center gap-6 text-sm text-[#4b4b4b]">
                <span>1 - {filtradas.length} de 80 registros</span>
                <div className="flex items-center gap-1">
                  <button type="button" aria-label="Página anterior" className="flex size-8 items-center justify-center rounded text-[#8e8e8e] hover:bg-[#f0f0f0]">
                    <ChevronLeftIcon className="size-4" />
                  </button>
                  <button type="button" className="flex size-8 items-center justify-center rounded-full bg-[#00842f] text-sm font-bold text-white">1</button>
                  <button type="button" className="flex size-8 items-center justify-center rounded text-black hover:bg-[#f0f0f0]">2</button>
                  <button type="button" className="flex size-8 items-center justify-center rounded text-black hover:bg-[#f0f0f0]">3</button>
                  <span className="px-1 text-[#8e8e8e]">…</span>
                  <button type="button" className="flex size-8 items-center justify-center rounded text-black hover:bg-[#f0f0f0]">8</button>
                  <button type="button" aria-label="Próxima página" className="flex size-8 items-center justify-center rounded text-[#4b4b4b] hover:bg-[#f0f0f0]">
                    <ChevronRightIcon className="size-4" />
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center gap-3 py-24 text-center">
              <EyeOffIcon className="size-10 text-[#8e8e8e]" />
              <p className="text-sm text-[#8e8e8e]">Nenhum resultado encontrado</p>
            </div>
          )}
        </main>

        <Footer />
      </div>
    </div>
  );
}
