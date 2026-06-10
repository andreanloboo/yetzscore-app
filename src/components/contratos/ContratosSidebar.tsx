import { useNavigate } from "react-router-dom";
import { useState } from "react";
import logoYetz from "../../assets/campanhas/logo-yetz-sidebar.svg";
import avatar from "../../assets/campanhas/avatar.svg";
import { UserMenuPopover } from "./Popovers";

export default function ContratosSidebar() {
  const navigate = useNavigate();
  const [showUserMenu, setShowUserMenu] = useState(false);

  return (
    <aside className="relative flex w-[240px] shrink-0 flex-col self-stretch border-r border-[#cacaca] bg-white p-4">
      <div className="flex flex-1 flex-col items-center justify-between w-full">
        {/* Top: logo + nav */}
        <div className="flex w-full flex-col gap-4">
          {/* Logo */}
          <div className="flex w-full items-center overflow-hidden py-4">
            <img src={logoYetz} alt="Yetz" className="h-8 w-[130px] object-contain" />
          </div>

          {/* Nav items */}
          <nav className="flex flex-col gap-1 w-full">
            {/* Campanhas */}
            <button
              onClick={() => navigate("/campanhas")}
              className="flex h-10 w-full cursor-pointer items-center gap-3 rounded-md px-2 py-3 text-sm text-black hover:bg-[#f5f5f5]"
            >
              <svg className="size-4 shrink-0" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
              </svg>
              Campanhas
            </button>

            {/* Contratos – active */}
            <button
              onClick={() => navigate("/contratos")}
              className="flex h-10 w-full cursor-pointer items-center gap-3 rounded-md px-2 py-3 text-sm text-black hover:bg-[#f5f5f5]"
            >
              <svg className="size-4 shrink-0" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
              </svg>
              Contratos
            </button>

            {/* Delegações – active per design (green background) */}
            <div className="flex h-10 w-full items-center gap-2 rounded-md bg-[#00842f] px-2 py-3">
              <svg className="size-4 shrink-0 text-[#dffbe8]" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
              </svg>
              <span className="flex-1 text-sm text-[#dffbe8]">Delegações</span>
            </div>
          </nav>
        </div>

        {/* Bottom: user area */}
        <div className="relative w-full border-t border-[#cacaca] pt-4">
          <button
            onClick={() => setShowUserMenu((v) => !v)}
            className="flex w-full cursor-pointer items-center gap-2 overflow-hidden"
          >
            <img src={avatar} alt="Avatar" className="size-8 shrink-0 rounded-full" />
            <div className="flex min-w-0 flex-col items-start gap-0.5 overflow-hidden">
              <p className="truncate text-sm font-bold text-black">Izabela</p>
              <p className="truncate text-xs text-[#8e8e8e]">Gerente de Negócios</p>
            </div>
          </button>
          {showUserMenu && (
            <UserMenuPopover
              onEditarPerfil={() => {}}
              onRecuperarSenha={() => {}}
              onSair={() => { navigate("/login"); }}
              onClose={() => setShowUserMenu(false)}
            />
          )}
        </div>
      </div>
    </aside>
  );
}
