import type { ContratoStatus } from "./types";

interface StatusBadgeProps {
  status: ContratoStatus;
}

export default function StatusBadge({ status }: StatusBadgeProps) {
  switch (status) {
    case "Aguardando aprovação":
      return (
        <span className="inline-flex items-center justify-center rounded-md bg-[#fef9c3] px-1.5 py-0.5 text-[11px] leading-[17px] text-[#f59e0b] whitespace-nowrap">
          Aguardando aprovação
        </span>
      );
    case "Aprovado":
      return (
        <span className="inline-flex items-center justify-center rounded-md bg-[#dcfce7] px-1.5 py-0.5 text-[11px] leading-[17px] text-[#22c55e] whitespace-nowrap">
          Aprovado
        </span>
      );
    case "Reprovado":
      return (
        <span className="inline-flex items-center justify-center rounded-md bg-[#ffedee] px-1.5 py-0.5 text-[11px] leading-[17px] text-[#cc0000] whitespace-nowrap">
          Reprovado
        </span>
      );
    case "Aguardando vínculo":
      return (
        <span className="inline-flex items-center justify-center rounded-md bg-[#ffedee] px-1.5 py-0.5 text-[11px] leading-[17px] text-[#cc0000] whitespace-nowrap">
          Aguardando vínculo
        </span>
      );
  }
}
