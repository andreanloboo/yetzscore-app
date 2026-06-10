export type CampaignStatus = "ativo" | "inativo";
export type CampaignValueType = "fixo" | "variavel";

export interface Campaign {
  id: number;
  title: string;
  status: CampaignStatus;
  valueType: CampaignValueType;
  /** Data inicial (ISO yyyy-mm-dd) */
  start: string;
  /** Data final (ISO yyyy-mm-dd) */
  end: string;
}

export const VALUE_TYPE_LABEL: Record<CampaignValueType, string> = {
  fixo: "Valor Fixo",
  variavel: "Valor variável",
};

export function formatShortDate(iso: string): string {
  const [year, month, day] = iso.split("-");
  return `${day}/${month}/${year.slice(2)}`;
}

/** 24 campanhas mock — as 11 primeiras seguem o design (página 1). */
export const CAMPAIGNS: Campaign[] = [
  // Página 1 (ordem e dados do design Figma)
  { id: 1, title: "Líderes em vendas automotivas 2026", status: "ativo", valueType: "fixo", start: "2026-11-15", end: "2027-01-15" },
  { id: 2, title: "Top vendas de carros 2026", status: "ativo", valueType: "fixo", start: "2026-09-01", end: "2026-11-30" },
  { id: 3, title: "Campeões automotivos 2026", status: "inativo", valueType: "fixo", start: "2026-08-05", end: "2026-10-05" },
  { id: 4, title: "Vencedores em vendas de veículos 2026", status: "ativo", valueType: "fixo", start: "2026-07-20", end: "2026-09-20" },
  { id: 5, title: "Destaques em vendas automotivas 2026", status: "ativo", valueType: "variavel", start: "2026-06-10", end: "2026-08-10" },
  { id: 6, title: "Campeões de vendas de carros 2026", status: "ativo", valueType: "fixo", start: "2026-05-25", end: "2026-07-25" },
  { id: 7, title: "Líderes em vendas de automóveis 2026", status: "ativo", valueType: "fixo", start: "2026-04-15", end: "2026-06-15" },
  { id: 8, title: "Top vendedores automotivos 2026", status: "ativo", valueType: "fixo", start: "2026-03-01", end: "2026-05-01" },
  { id: 9, title: "Campeões em vendas de veículos 2026", status: "ativo", valueType: "fixo", start: "2026-02-10", end: "2026-04-10" },
  { id: 10, title: "Destaques em vendas de carros 2026", status: "inativo", valueType: "fixo", start: "2026-01-20", end: "2026-03-20" },
  { id: 11, title: "Vencedores em vendas automotivas 2026", status: "ativo", valueType: "variavel", start: "2026-12-05", end: "2027-02-05" },
  // Páginas 2 e 3 (variações geradas)
  { id: 12, title: "Top vendas de motos 2026", status: "ativo", valueType: "fixo", start: "2026-10-01", end: "2026-12-15" },
  { id: 13, title: "Líderes em vendas de utilitários 2026", status: "ativo", valueType: "variavel", start: "2026-09-10", end: "2026-11-10" },
  { id: 14, title: "Campeões de vendas de caminhões 2026", status: "inativo", valueType: "fixo", start: "2026-03-15", end: "2026-05-15" },
  { id: 15, title: "Destaques em vendas de SUVs 2026", status: "ativo", valueType: "fixo", start: "2026-08-20", end: "2026-10-20" },
  { id: 16, title: "Vencedores em vendas de motos 2026", status: "ativo", valueType: "variavel", start: "2026-07-01", end: "2026-09-01" },
  { id: 17, title: "Top vendas de seminovos 2026", status: "ativo", valueType: "fixo", start: "2026-06-25", end: "2026-08-25" },
  { id: 18, title: "Líderes em consórcios automotivos 2026", status: "inativo", valueType: "fixo", start: "2026-02-01", end: "2026-04-01" },
  { id: 19, title: "Campeões em financiamentos 2026", status: "ativo", valueType: "variavel", start: "2026-05-10", end: "2026-07-10" },
  { id: 20, title: "Destaques em vendas de picapes 2026", status: "ativo", valueType: "fixo", start: "2026-04-05", end: "2026-06-05" },
  { id: 21, title: "Top vendas de elétricos 2026", status: "ativo", valueType: "variavel", start: "2026-11-01", end: "2027-01-01" },
  { id: 22, title: "Vencedores em pós-venda 2026", status: "inativo", valueType: "fixo", start: "2026-01-05", end: "2026-03-05" },
  { id: 23, title: "Líderes em seguros automotivos 2026", status: "ativo", valueType: "fixo", start: "2026-10-15", end: "2026-12-15" },
  { id: 24, title: "Campeões de test-drives 2026", status: "ativo", valueType: "variavel", start: "2026-12-01", end: "2027-02-01" },
];
