import { useNavigate, useLocation } from "react-router-dom";
import logoScoreY from "../../assets/contratos/logo-score-y.svg";
import logoScoreText from "../../assets/contratos/logo-score-text.svg";
import avatar from "../../assets/campanhas/avatar.svg";
import {
  CampanhasIcon,
  CargasIcon,
  CatalogosIcon,
  ClientesIcon,
  SessoesIcon,
  UsuariosIcon,
} from "./icons";

interface NavItem {
  label: string;
  icon: React.ReactNode;
  path?: string;
}

// Sidebar da sessão do administrador.
export default function AdmscoreSidebar({ forceActive }: { forceActive?: string }) {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const items: NavItem[] = [
    { label: "Campanhas", icon: <CampanhasIcon className="size-6" />, path: "/admscore/campanhas" },
    { label: "Cargas", icon: <CargasIcon className="size-6" />, path: "/admscore/cargas" },
    { label: "Catálogos", icon: <CatalogosIcon className="size-6" />, path: "/admscore/catalogos" },
    { label: "Clientes", icon: <ClientesIcon className="size-6" />, path: "/admscore/clientes" },
    { label: "Usuários", icon: <UsuariosIcon className="size-6" />, path: "/admscore/usuarios" },
    { label: "Sessões", icon: <SessoesIcon className="size-6" />, path: "/admscore/sessoes" },
  ];

  return (
    <aside className="flex w-[220px] shrink-0 flex-col justify-between self-stretch border-r border-[#cacaca] bg-white p-4">
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-1.5 py-4 pl-2">
          <img src={logoScoreY} alt="" className="h-7 w-7 shrink-0" />
          <img src={logoScoreText} alt="score" className="h-[17px]" />
        </div>

        <nav className="flex flex-col gap-1">
          {items.map((item) => {
            const active = forceActive
              ? item.label === forceActive
              : item.path != null && pathname.startsWith(item.path);
            return (
              <button
                key={item.label}
                type="button"
                title={item.label}
                onClick={() => item.path && navigate(item.path)}
                className={`flex h-12 w-full items-center gap-3 rounded-md px-3 text-sm leading-4 transition-colors ${
                  active
                    ? "bg-[#00842f] text-white hover:bg-[#006b26]"
                    : "text-black hover:bg-[#e6f3ea] hover:text-[#00842f]"
                }`}
              >
                <span className="shrink-0">{item.icon}</span>
                <span className="whitespace-nowrap">{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      <div className="flex items-center gap-2 border-t border-[#cacaca] p-1 pt-4">
        <img src={avatar} alt="Avatar" className="size-8 shrink-0 rounded-full" />
        <span className="flex min-w-0 flex-col gap-0.5">
          <span className="truncate text-sm font-bold text-black">Izabela</span>
          <span className="truncate text-xs text-[#8e8e8e]">Administrador</span>
        </span>
      </div>
    </aside>
  );
}
