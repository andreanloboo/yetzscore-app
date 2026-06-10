import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import logoScoreY from "../assets/contratos/logo-score-y.svg";
import logoScoreText from "../assets/contratos/logo-score-text.svg";
import avatar from "../assets/campanhas/avatar.svg";
import { FileIcon, LineChartIcon } from "./campanhas/icons";
import { UserMenuPopover } from "./contratos/Popovers";

const STORAGE_KEY = "yetzscore:sidebar-expanded";

function UsersIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="24"
      height="24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z"
      />
    </svg>
  );
}

function MenuIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="20"
      height="20"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      viewBox="0 0 24 24"
    >
      <path strokeLinecap="round" d="M4 6h16M4 12h16M4 18h16" />
    </svg>
  );
}

function ChevronsLeftIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="20"
      height="20"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      viewBox="0 0 24 24"
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M11 17l-5-5 5-5M18 17l-5-5 5-5" />
    </svg>
  );
}

export default function AppSidebar() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [expanded, setExpanded] = useState<boolean>(
    () => localStorage.getItem(STORAGE_KEY) === "1",
  );
  const [showUserMenu, setShowUserMenu] = useState(false);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, expanded ? "1" : "0");
  }, [expanded]);

  const items = [
    { label: "Campanhas", path: "/campanhas", icon: <LineChartIcon size={24} /> },
    { label: "Contratos", path: "/contratos", icon: <FileIcon size={24} /> },
    { label: "Delegações", path: null, icon: <UsersIcon className="size-6" /> },
  ];

  return (
    <aside
      className={`relative flex shrink-0 flex-col self-stretch overflow-hidden border-r border-[#cacaca] bg-white p-4 transition-[width] duration-300 ease-in-out ${
        expanded ? "w-[240px]" : "w-[80px]"
      }`}
    >
      <div className="flex w-full flex-1 flex-col justify-between">
        <div className="flex w-full flex-col gap-4">
          {/* Logo + alternar expansão */}
          <div
            className={`flex w-full items-center py-4 ${
              expanded ? "justify-between" : "flex-col gap-3"
            }`}
          >
            <div className="flex items-center gap-1.5 overflow-hidden">
              <img src={logoScoreY} alt="" className="h-7 w-7 shrink-0" />
              <img
                src={logoScoreText}
                alt="score"
                className={`h-[17px] w-auto transition-opacity duration-300 ${
                  expanded ? "opacity-100" : "hidden opacity-0"
                }`}
              />
            </div>
            <button
              type="button"
              title={expanded ? "Recolher menu" : "Expandir menu"}
              aria-label={expanded ? "Recolher menu" : "Expandir menu"}
              aria-expanded={expanded}
              onClick={() => setExpanded((v) => !v)}
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-[#4b4b4b] transition-colors hover:bg-[#e6f3ea] hover:text-[#00842f]"
            >
              {expanded ? <ChevronsLeftIcon /> : <MenuIcon />}
            </button>
          </div>

          {/* Navegação */}
          <nav className={`flex w-full flex-col gap-1 ${expanded ? "" : "items-center"}`}>
            {items.map((item) => {
              const active = item.path !== null && pathname.startsWith(item.path);
              return (
                <button
                  key={item.label}
                  type="button"
                  title={item.label}
                  aria-label={item.label}
                  onClick={() => item.path && navigate(item.path)}
                  className={`flex h-12 items-center rounded-md transition-colors ${
                    expanded ? "w-full gap-3 px-3" : "w-12 justify-center p-3"
                  } ${
                    active
                      ? "bg-[#00842f] text-white hover:bg-[#006b26]"
                      : "text-black hover:bg-[#e6f3ea] hover:text-[#00842f]"
                  }`}
                >
                  <span className="shrink-0">{item.icon}</span>
                  {expanded && (
                    <span className="whitespace-nowrap text-sm leading-4">{item.label}</span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Área do usuário */}
        <div className="relative w-full border-t border-[#cacaca] pt-4">
          <button
            type="button"
            title="Perfil"
            onClick={() => setShowUserMenu((v) => !v)}
            className={`flex w-full items-center gap-2 overflow-hidden rounded-md transition-colors hover:bg-[#f5f5f5] ${
              expanded ? "p-1" : "justify-center p-1"
            }`}
          >
            <img src={avatar} alt="Avatar" className="size-8 shrink-0 rounded-full" />
            {expanded && (
              <span className="flex min-w-0 flex-col items-start gap-0.5 overflow-hidden">
                <span className="truncate text-sm font-bold text-black">Izabela</span>
                <span className="truncate text-xs text-[#8e8e8e]">Gerente de Negócios</span>
              </span>
            )}
          </button>
          {showUserMenu && (
            <UserMenuPopover
              onEditarPerfil={() => {}}
              onRecuperarSenha={() => {}}
              onSair={() => navigate("/login")}
              onClose={() => setShowUserMenu(false)}
            />
          )}
        </div>
      </div>
    </aside>
  );
}
