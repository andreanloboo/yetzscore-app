import { useEffect, useRef, useState } from "react";
import type { KeyboardEvent as ReactKeyboardEvent, PointerEvent as ReactPointerEvent } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import logoScoreY from "../assets/contratos/logo-score-y.svg";
import logoScoreText from "../assets/contratos/logo-score-text.svg";
import avatar from "../assets/campanhas/avatar.svg";
import { FileIcon, LineChartIcon } from "./campanhas/icons";
import { UserMenuPopover } from "./contratos/Popovers";
import { PROFILE_LABELS, getProfile } from "../lib/profile";

const WIDTH_STORAGE_KEY = "yetzscore:sidebar-width";
const LEGACY_STORAGE_KEY = "yetzscore:sidebar-expanded";

const MIN_WIDTH = 80;
const MAX_WIDTH = 320;
const EXPANDED_WIDTH = 240;
const COLLAPSE_THRESHOLD = 140;
const KEYBOARD_STEP = 16;

function clampWidth(value: number): number {
  return Math.min(MAX_WIDTH, Math.max(MIN_WIDTH, value));
}

function readStoredWidth(): number {
  const raw = localStorage.getItem(WIDTH_STORAGE_KEY);
  if (raw !== null) {
    const parsed = Number(raw);
    if (Number.isFinite(parsed)) return clampWidth(parsed);
  }
  // Migração da chave booleana antiga
  const legacy = localStorage.getItem(LEGACY_STORAGE_KEY);
  if (legacy !== null) return legacy === "1" ? EXPANDED_WIDTH : MIN_WIDTH;
  return MIN_WIDTH;
}

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

export default function AppSidebar() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [width, setWidth] = useState<number>(readStoredWidth);
  const [dragging, setDragging] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const dragStateRef = useRef<{ startX: number; startWidth: number } | null>(null);

  const collapsed = width < COLLAPSE_THRESHOLD;

  useEffect(() => {
    if (dragging) return;
    localStorage.setItem(WIDTH_STORAGE_KEY, String(width));
    localStorage.removeItem(LEGACY_STORAGE_KEY);
  }, [width, dragging]);

  useEffect(() => {
    if (!dragging) return;

    const handlePointerMove = (event: PointerEvent) => {
      const state = dragStateRef.current;
      if (!state) return;
      setWidth(clampWidth(state.startWidth + (event.clientX - state.startX)));
    };

    const handlePointerUp = () => {
      dragStateRef.current = null;
      setDragging(false);
    };

    document.addEventListener("pointermove", handlePointerMove);
    document.addEventListener("pointerup", handlePointerUp);
    const previousCursor = document.body.style.cursor;
    const previousUserSelect = document.body.style.userSelect;
    document.body.style.cursor = "col-resize";
    document.body.style.userSelect = "none";

    return () => {
      document.removeEventListener("pointermove", handlePointerMove);
      document.removeEventListener("pointerup", handlePointerUp);
      document.body.style.cursor = previousCursor;
      document.body.style.userSelect = previousUserSelect;
    };
  }, [dragging]);

  const handleResizePointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (event.button !== 0) return;
    event.preventDefault();
    dragStateRef.current = { startX: event.clientX, startWidth: width };
    setDragging(true);
  };

  const handleResizeKeyDown = (event: ReactKeyboardEvent<HTMLDivElement>) => {
    if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
    event.preventDefault();
    const delta = event.key === "ArrowLeft" ? -KEYBOARD_STEP : KEYBOARD_STEP;
    setWidth((w) => clampWidth(w + delta));
  };

  const toggleWidth = () => {
    setWidth((w) => (w < COLLAPSE_THRESHOLD ? EXPANDED_WIDTH : MIN_WIDTH));
  };

  const items = [
    { label: "Campanhas", path: "/campanhas", icon: <LineChartIcon size={24} /> },
    { label: "Contratos", path: "/contratos", icon: <FileIcon size={24} /> },
    { label: "Delegações", path: "/delegacoes", icon: <UsersIcon className="size-6" /> },
  ];

  return (
    <aside
      className="relative flex shrink-0 flex-col self-stretch overflow-hidden border-r border-[#cacaca] bg-white p-4"
      style={{ width, transition: dragging ? "none" : "width 0.25s ease" }}
    >
      <div className="flex w-full flex-1 flex-col justify-between">
        <div className="flex w-full flex-col gap-4">
          {/* Logo (retração via arraste/duplo clique no handle da borda).
              Colapsado, o Y ocupa o mesmo footprint de 48px dos botões de nav. */}
          <div className={`flex w-full items-center py-4 ${collapsed ? "justify-center" : ""}`}>
            <div className="flex items-center gap-1.5 overflow-hidden">
              <img
                src={logoScoreY}
                alt=""
                className={`shrink-0 transition-all duration-200 ${
                  collapsed ? "h-12 w-12" : "h-7 w-7"
                }`}
              />
              <img
                src={logoScoreText}
                alt="score"
                className={`h-[17px] transition-opacity duration-200 ${
                  collapsed ? "w-0 opacity-0" : "w-auto opacity-100"
                }`}
              />
            </div>
          </div>

          {/* Navegação */}
          <nav className={`flex w-full flex-col gap-1 ${collapsed ? "items-center" : ""}`}>
            {items.map((item) => {
              const active = item.path !== null && pathname.startsWith(item.path);
              return (
                <button
                  key={item.label}
                  type="button"
                  title={item.label}
                  aria-label={item.label}
                  onClick={() => item.path && navigate(item.path)}
                  className={`flex h-12 items-center overflow-hidden rounded-md transition-colors ${
                    collapsed ? "w-12 justify-center p-3" : "w-full gap-3 px-3"
                  } ${
                    active
                      ? "bg-[#00842f] text-white hover:bg-[#006b26]"
                      : "text-black hover:bg-[#e6f3ea] hover:text-[#00842f]"
                  }`}
                >
                  <span className="shrink-0">{item.icon}</span>
                  <span
                    className={`overflow-hidden whitespace-nowrap text-sm leading-4 transition-opacity duration-200 ${
                      collapsed ? "w-0 opacity-0" : "opacity-100"
                    }`}
                  >
                    {item.label}
                  </span>
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
              collapsed ? "justify-center p-1" : "p-1"
            }`}
          >
            <img src={avatar} alt="Avatar" className="size-8 shrink-0 rounded-full" />
            {!collapsed && (
              <span className="flex min-w-0 flex-col items-start gap-0.5 overflow-hidden">
                <span className="truncate text-sm font-bold text-black">Izabela</span>
                <span className="truncate text-xs text-[#8e8e8e]">{PROFILE_LABELS[getProfile()]}</span>
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

      {/* Handle de redimensionamento */}
      <div
        role="separator"
        aria-orientation="vertical"
        aria-label="Redimensionar menu lateral"
        aria-valuemin={MIN_WIDTH}
        aria-valuemax={MAX_WIDTH}
        aria-valuenow={width}
        tabIndex={0}
        onPointerDown={handleResizePointerDown}
        onDoubleClick={toggleWidth}
        onKeyDown={handleResizeKeyDown}
        className={`absolute inset-y-0 right-0 z-10 w-[5px] cursor-col-resize touch-none transition-colors outline-none ${
          dragging
            ? "bg-[rgba(0,132,47,0.25)]"
            : "bg-transparent hover:bg-[rgba(0,132,47,0.25)] focus-visible:bg-[rgba(0,132,47,0.25)]"
        }`}
      />
    </aside>
  );
}
