import { formatFullDate } from "../campanhas/CalendarPopover";

export type TipoUsuario = "Gerente de Negócios" | "Gerente de Contas";
export type DelegacaoStatus = "Ativa" | "Agendada" | "Encerrada";

export interface Delegacao {
  id: string;
  tipo: TipoUsuario;
  titular: string;
  /** O primeiro nome é o exibido na tabela; os demais aparecem no chip "+N". */
  substitutos: string[];
  inicio: string; // ISO yyyy-mm-dd
  fim: string; // ISO yyyy-mm-dd
  motivo: string;
  observacao: string;
  status: DelegacaoStatus;
}

export const MOTIVOS = [
  "Férias",
  "Folga",
  "Atestado médico",
  "Licença maternidade/paternidade",
  "Viagem a trabalho",
  "Treinamento",
] as const;

export const USUARIOS = [
  "Anderson Golveia",
  "André Xavier",
  "Celso Coelho",
  "Emiliane Martins",
  "Felipe Henrique",
  "Izabela Oliveira",
  "João Carlos",
  "João Cristiano",
  "João Miguel",
  "José Aldo",
  "Juliano Mendes",
  "Kaique",
  "Leila Coelho",
  "Maria Eduarda",
] as const;

export const MOCK_DELEGACOES: Delegacao[] = [
  {
    id: "d1",
    tipo: "Gerente de Negócios",
    titular: "Felipe Henrique",
    substitutos: ["Emiliane Martins", "Leila Coelho", "André Xavier", "Celso Coelho"],
    inicio: "2026-05-05",
    fim: "2026-05-30",
    motivo: "Férias",
    observacao: "",
    status: "Encerrada",
  },
  {
    id: "d2",
    tipo: "Gerente de Negócios",
    titular: "Izabela Oliveira",
    substitutos: ["Anderson Golveia", "Leila Coelho", "André Xavier", "Celso Coelho"],
    inicio: "2026-05-05",
    fim: "2026-05-30",
    motivo: "Férias",
    observacao: "Férias + folgas",
    status: "Encerrada",
  },
  {
    id: "d3",
    tipo: "Gerente de Contas",
    titular: "Anderson Golveia",
    substitutos: ["Celso Coelho", "Leila Coelho", "André Xavier", "Juliano Mendes"],
    inicio: "2026-05-05",
    fim: "2026-05-30",
    motivo: "Viagem a trabalho",
    observacao: "",
    status: "Ativa",
  },
  {
    id: "d4",
    tipo: "Gerente de Contas",
    titular: "Emiliane Martins",
    substitutos: ["André Xavier", "Leila Coelho", "Celso Coelho", "João Carlos"],
    inicio: "2026-05-05",
    fim: "2026-05-30",
    motivo: "Treinamento",
    observacao: "",
    status: "Agendada",
  },
];

/** Remove os diacríticos (faixa U+0300–U+036F após decomposição NFD). */
const DIACRITICS_RE = new RegExp(
  `[${String.fromCharCode(0x0300)}-${String.fromCharCode(0x036f)}]`,
  "g"
);

/** Normaliza para busca sem acentos e sem diferenciar maiúsculas. */
export function normalize(text: string): string {
  return text.normalize("NFD").replace(DIACRITICS_RE, "").toLowerCase();
}

export function toIsoDate(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

/** Status derivado do período em relação à data atual. */
export function statusFromRange(inicio: string, fim: string): DelegacaoStatus {
  const hoje = toIsoDate(new Date());
  if (hoje < inicio) return "Agendada";
  if (hoje > fim) return "Encerrada";
  return "Ativa";
}

export function formatPeriodo(inicio: string, fim: string): string {
  return `${formatFullDate(inicio)} - ${formatFullDate(fim)}`;
}

/** "A", "A e B", "A, B e C" */
export function formatNomes(nomes: string[]): string {
  if (nomes.length === 0) return "";
  if (nomes.length === 1) return nomes[0];
  return `${nomes.slice(0, -1).join(", ")} e ${nomes[nomes.length - 1]}`;
}

/** Frase de sucesso: "<nomes> foram definidos como responsáveis substitutos." */
export function fraseSubstitutos(nomes: string[]): string {
  const lista = formatNomes(nomes);
  return nomes.length > 1
    ? `${lista} foram definidos como responsáveis substitutos.`
    : `${lista} foi definido como responsável substituto.`;
}
