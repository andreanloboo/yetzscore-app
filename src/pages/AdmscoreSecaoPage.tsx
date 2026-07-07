import { useNavigate } from "react-router-dom";
import AdmscoreSidebar from "../components/admscore/AdmscoreSidebar";
import Footer from "../components/Footer";
import {
  CargasIcon,
  CatalogosIcon,
  ChevronLeftIcon,
  ClientesIcon,
} from "../components/admscore/icons";

// Seções da sidebar sem telas desenhadas no Figma (Cargas, Catálogos, Clientes).
// Mantém a navegação funcional com um estado "em construção" consistente.
const SECOES = {
  cargas: { titulo: "Cargas", Icon: CargasIcon },
  catalogos: { titulo: "Catálogos", Icon: CatalogosIcon },
  clientes: { titulo: "Clientes", Icon: ClientesIcon },
} as const;

export type SecaoKey = keyof typeof SECOES;

export default function AdmscoreSecaoPage({ secao }: { secao: SecaoKey }) {
  const navigate = useNavigate();
  const { titulo, Icon } = SECOES[secao];

  return (
    <div className="flex min-h-screen bg-white">
      <AdmscoreSidebar />

      <div className="flex min-w-0 flex-1 flex-col">
        <main className="flex flex-1 flex-col gap-6 p-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Icon className="size-6 text-[#00842f]" />
              <h1 className="text-xl font-bold text-[#00842f]">{titulo}</h1>
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

          <div className="flex flex-1 flex-col items-center justify-center gap-4 py-24 text-center">
            <span className="flex size-16 items-center justify-center rounded-full bg-[#e6f3ea]">
              <Icon className="size-8 text-[#00842f]" />
            </span>
            <div className="flex flex-col gap-1">
              <p className="text-lg font-bold text-black">Seção em construção</p>
              <p className="max-w-[380px] text-sm leading-[21px] text-[#4b4b4b]">
                As telas de {titulo} ainda não possuem design definido. Assim que estiverem
                disponíveis, serão implementadas aqui.
              </p>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </div>
  );
}
