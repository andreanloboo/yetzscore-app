import type { DelegacaoStatus, TipoUsuario } from "./types";

/**
 * Badge da coluna "Tipo de usuário" (cores do get_design_context 8185:14224:
 * Gerente de Negócios #fef9c3/#f59e0b; Gerente de Contas #c1e9ff/#0369a1).
 */
export function TipoUsuarioBadge({ tipo }: { tipo: TipoUsuario }) {
  const styles =
    tipo === "Gerente de Negócios"
      ? "bg-[#fef9c3] text-[#f59e0b]"
      : "bg-[#c1e9ff] text-[#0369a1]";
  return (
    <span
      className={`inline-flex items-center justify-center whitespace-nowrap rounded-md px-1.5 py-0.5 text-[11px] leading-[17px] ${styles}`}
    >
      {tipo}
    </span>
  );
}

/**
 * Badge de status da delegação: Ativa (verde), Agendada (amarelo),
 * Encerrada (cinza) — paleta dos badges do design system.
 */
export function DelegacaoStatusBadge({ status }: { status: DelegacaoStatus }) {
  const styles =
    status === "Ativa"
      ? "bg-[#dcfce7] text-[#22c55e]"
      : status === "Agendada"
        ? "bg-[#fef9c3] text-[#f59e0b]"
        : "bg-[#eeeeee] text-[#4b4b4b]";
  return (
    <span
      className={`inline-flex items-center justify-center whitespace-nowrap rounded-md px-1.5 py-0.5 text-[11px] leading-[17px] ${styles}`}
    >
      {status}
    </span>
  );
}
