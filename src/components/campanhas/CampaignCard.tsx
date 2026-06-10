import { useEffect, useRef } from "react";
import type { Campaign } from "./data";
import { formatShortDate, VALUE_TYPE_LABEL } from "./data";
import {
  CalendarIcon,
  CardLockIcon,
  CardUnlockIcon,
  LineChartIcon,
  MoreVerticalIcon,
} from "./icons";

interface CampaignCardProps {
  campaign: Campaign;
  menuOpen: boolean;
  onToggleMenu: () => void;
  onCloseMenu: () => void;
  onOpen: () => void;
}

export default function CampaignCard({
  campaign,
  menuOpen,
  onToggleMenu,
  onCloseMenu,
  onOpen,
}: CampaignCardProps) {
  const menuRef = useRef<HTMLDivElement>(null);
  const inactive = campaign.status === "inativo";

  useEffect(() => {
    if (!menuOpen) return;
    function handleClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        onCloseMenu();
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [menuOpen, onCloseMenu]);

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onOpen}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onOpen();
        }
      }}
      className={`flex min-h-[192px] cursor-pointer flex-col justify-between rounded-md px-6 py-6 text-left transition-shadow hover:shadow-md ${
        inactive
          ? "bg-[#f5f5f5]"
          : "border border-[#cacaca] bg-white"
      }`}
    >
      {/* Topo: badge de status + menu "..." */}
      <div className="flex h-[23px] w-full items-center justify-between">
        <div
          className={`flex items-center justify-center gap-1 ${
            inactive ? "text-[#8e8e8e]" : "text-[#22c55e]"
          }`}
        >
          <span className="h-2 w-2 rounded-full bg-current" />
          <span className="text-sm leading-[17px]">{inactive ? "Inativo" : "Ativo"}</span>
        </div>
        <div className="relative" ref={menuRef}>
          <button
            type="button"
            aria-label="Mais opções"
            onClick={(e) => {
              e.stopPropagation();
              onToggleMenu();
            }}
            className={`flex h-6 w-6 items-center justify-center rounded-md transition-colors hover:bg-black/5 ${
              inactive ? "text-[#8e8e8e]" : "text-[#00842f]"
            }`}
          >
            <MoreVerticalIcon size={18} />
          </button>
          {menuOpen && (
            <div className="absolute right-0 top-7 z-20 min-w-[160px] rounded-md border border-[#cacaca] bg-white py-1 shadow-lg">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onCloseMenu();
                  onOpen();
                }}
                className="flex w-full items-center px-4 py-2 text-left text-sm text-[#4b4b4b] transition-colors hover:bg-[#e6f3ea] hover:text-[#00842f]"
              >
                Ver detalhes
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Ícone + título */}
      <div className="flex w-full items-center gap-3">
        <div
          className={`flex h-[51px] w-[51px] shrink-0 items-center justify-center rounded-[7px] ${
            inactive ? "bg-[#e1e1e1] text-[#8e8e8e]" : "bg-[#f5f5f5] text-[#00842f]"
          }`}
        >
          <LineChartIcon size={22} />
        </div>
        <p
          className={`line-clamp-2 flex-1 text-[22px] font-bold leading-[26px] ${
            inactive ? "text-[#8e8e8e]" : "text-[#00842f]"
          }`}
        >
          {campaign.title}
        </p>
      </div>

      {/* Divisor */}
      <div className={`h-px w-full ${inactive ? "bg-[#cacaca]" : "bg-[#e1e1e1]"}`} />

      {/* Período + tipo de valor */}
      <div
        className={`flex w-full items-start justify-between text-sm leading-[17px] ${
          inactive ? "text-[#8e8e8e]" : "text-[#4b4b4b]"
        }`}
      >
        <div className="flex items-center gap-1.5">
          <CalendarIcon size={16} className={inactive ? "text-[#8e8e8e]" : "text-[#00842f]"} />
          <span>
            {formatShortDate(campaign.start)} - {formatShortDate(campaign.end)}
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          {campaign.valueType === "fixo" ? (
            <CardLockIcon size={16} className={inactive ? "text-[#8e8e8e]" : "text-[#00842f]"} />
          ) : (
            <CardUnlockIcon size={16} className={inactive ? "text-[#8e8e8e]" : "text-[#00842f]"} />
          )}
          <span>{VALUE_TYPE_LABEL[campaign.valueType]}</span>
        </div>
      </div>
    </div>
  );
}
