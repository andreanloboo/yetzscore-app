export type ContratoStatus =
  | "Aguardando aprovação"
  | "Aprovado"
  | "Reprovado"
  | "Aguardando vínculo";

export interface Contrato {
  id: string;
  codigoRevenda: string;
  grupoEconomico: string;
  cnpjCliente: string;
  numeroProposta: string;
  vendedor: string;
  gerente: string;
  status: ContratoStatus;
  tableGroup: "kaique" | "vinculados" | "maria" | "joao" | "junior";
  // For detalhes panel
  valorContrato?: string;
  nomeCliente?: string;
  numeroContrato?: string;
  dataContrato?: string;
  chassi?: string;
  fornecedor?: string;
  gerenteNegocio?: string;
}

export type ActiveOverlay =
  | { type: "gerenciarColunas" }
  | { type: "detalhesContrato"; contratoId: string }
  | { type: "contratosSelecionados" }
  | { type: "atencaoAprovar"; contratoIds: string[] }
  | { type: "atencaoReprovar"; contratoId: string }
  | { type: "atencaoDesvincular"; contratoId: string }
  | { type: "sucessoAprovado" }
  | { type: "sucessoReprovado" }
  | { type: "sucessoDesvinculado" }
  | { type: "acoes"; contratoId: string; x: number; y: number }
  | { type: "verDetalhes"; contratoId: string; x: number; y: number }
  | { type: "statusDropdown"; tableGroup: string; x: number; y: number }
  | { type: "gerentesDropdown" }
  | { type: "userMenu" }
  | null;

export interface ColumnConfig {
  id: string;
  label: string;
  visible: boolean;
  order: number;
}

export const DEFAULT_COLUMNS: ColumnConfig[] = [
  { id: "codigoRevenda", label: "Código de revenda", visible: true, order: 0 },
  { id: "grupoEconomico", label: "Grupo econômico", visible: true, order: 1 },
  { id: "cnpjCliente", label: "CNPJ do Cliente", visible: true, order: 2 },
  { id: "numeroProposta", label: "Número da proposta", visible: true, order: 3 },
  { id: "vendedor", label: "Vendedor", visible: true, order: 4 },
  { id: "gerente", label: "Gerente", visible: true, order: 5 },
  // Extra optional columns from gerenciar-colunas ref
  { id: "valorContrato", label: "Valor do contrato", visible: false, order: 6 },
  { id: "nomeCliente", label: "Nome do cliente", visible: false, order: 7 },
  { id: "dataContrato", label: "Data do contrato", visible: false, order: 8 },
  { id: "numeroContrato", label: "Número do contrato", visible: false, order: 9 },
  { id: "chassi", label: "Chassi", visible: false, order: 10 },
  { id: "fornecedor", label: "Fornecedor", visible: false, order: 11 },
];

export const MOCK_CONTRATOS: Contrato[] = [
  // Kaique group – 3 rows per ref
  {
    id: "k1",
    codigoRevenda: "156898",
    grupoEconomico: "Sem grupo",
    cnpjCliente: "454**************",
    numeroProposta: "496884464644",
    vendedor: "Eduardo Gomes",
    gerente: "José Lourenço",
    status: "Aguardando aprovação",
    tableGroup: "kaique",
    valorContrato: "R$ 5.000,00",
    nomeCliente: "EDUARDO LTDA CLIENT 8",
    numeroContrato: "3030303340",
    dataContrato: "12/11/2024",
    chassi: "9BWZZZ1************",
    fornecedor: "ATENE FORNECEDOR VEICULOS 8",
    gerenteNegocio: "Kaique Atene GC",
  },
  {
    id: "k2",
    codigoRevenda: "156895",
    grupoEconomico: "Sem grupo",
    cnpjCliente: "454**************",
    numeroProposta: "496884464644",
    vendedor: "Eduardo Gomes",
    gerente: "José Lourenço",
    status: "Aguardando aprovação",
    tableGroup: "kaique",
    valorContrato: "R$ 3.200,00",
    nomeCliente: "CARLOS LTDA",
    numeroContrato: "3030303341",
    dataContrato: "15/11/2024",
    chassi: "9BWZZZ2************",
    fornecedor: "ATENE FORNECEDOR VEICULOS 9",
    gerenteNegocio: "Kaique Atene GC",
  },
  {
    id: "k3",
    codigoRevenda: "156898",
    grupoEconomico: "156895",
    cnpjCliente: "Sem grupo",
    numeroProposta: "454**************",
    vendedor: "Eduardo Gomes",
    gerente: "Eduardo Gomes",
    status: "Aprovado",
    tableGroup: "kaique",
    valorContrato: "R$ 7.800,00",
    nomeCliente: "ANA LTDA",
    numeroContrato: "3030303342",
    dataContrato: "18/11/2024",
    chassi: "9BWZZZ3************",
    fornecedor: "FORNECEDOR ABC",
    gerenteNegocio: "Kaique Atene GC",
  },
  // Vinculados group – 2 rows per ref
  {
    id: "v1",
    codigoRevenda: "156898",
    grupoEconomico: "Sem grupo",
    cnpjCliente: "454**************",
    numeroProposta: "496884464644",
    vendedor: "Eduardo Gomes",
    gerente: "José Lourenço",
    status: "Aguardando vínculo",
    tableGroup: "vinculados",
    valorContrato: "R$ 4.500,00",
    nomeCliente: "BETA LTDA",
    numeroContrato: "3113340000",
    dataContrato: "20/11/2024",
    chassi: "9BWZZZ4************",
    fornecedor: "FORNECEDOR BETA",
    gerenteNegocio: "Kaique Atene GC",
  },
  {
    id: "v2",
    codigoRevenda: "156895",
    grupoEconomico: "Sem grupo",
    cnpjCliente: "454**************",
    numeroProposta: "496884464644",
    vendedor: "Eduardo Gomes",
    gerente: "José Lourenço",
    status: "Aguardando vínculo",
    tableGroup: "vinculados",
    valorContrato: "R$ 2.100,00",
    nomeCliente: "GAMMA LTDA",
    numeroContrato: "3113340001",
    dataContrato: "22/11/2024",
    chassi: "9BWZZZ5************",
    fornecedor: "FORNECEDOR GAMMA",
    gerenteNegocio: "Kaique Atene GC",
  },
  // Maria GC group
  {
    id: "m1",
    codigoRevenda: "257001",
    grupoEconomico: "Grupo Alpha",
    cnpjCliente: "123**************",
    numeroProposta: "300111222333",
    vendedor: "Fernanda Costa",
    gerente: "Maria Santos",
    status: "Aguardando aprovação",
    tableGroup: "maria",
    valorContrato: "R$ 6.000,00",
    nomeCliente: "DELTA LTDA",
    numeroContrato: "4040404040",
    dataContrato: "05/12/2024",
    chassi: "9BWZZZ6************",
    fornecedor: "FORNECEDOR DELTA",
    gerenteNegocio: "Maria GC",
  },
  {
    id: "m2",
    codigoRevenda: "257002",
    grupoEconomico: "Grupo Alpha",
    cnpjCliente: "456**************",
    numeroProposta: "300111222334",
    vendedor: "Fernanda Costa",
    gerente: "Maria Santos",
    status: "Aprovado",
    tableGroup: "maria",
    valorContrato: "R$ 8.500,00",
    nomeCliente: "EPSILON LTDA",
    numeroContrato: "4040404041",
    dataContrato: "08/12/2024",
    chassi: "9BWZZZ7************",
    fornecedor: "FORNECEDOR EPSILON",
    gerenteNegocio: "Maria GC",
  },
  // João GC group
  {
    id: "j1",
    codigoRevenda: "358001",
    grupoEconomico: "Sem grupo",
    cnpjCliente: "789**************",
    numeroProposta: "400222333444",
    vendedor: "Roberto Lima",
    gerente: "João Pereira",
    status: "Aguardando aprovação",
    tableGroup: "joao",
    valorContrato: "R$ 3.300,00",
    nomeCliente: "ZETA LTDA",
    numeroContrato: "5050505050",
    dataContrato: "10/12/2024",
    chassi: "9BWZZZ8************",
    fornecedor: "FORNECEDOR ZETA",
    gerenteNegocio: "João GC",
  },
  // Junior GC group
  {
    id: "jr1",
    codigoRevenda: "459001",
    grupoEconomico: "Grupo Omega",
    cnpjCliente: "321**************",
    numeroProposta: "500333444555",
    vendedor: "Paulo Silva",
    gerente: "Junior Neves",
    status: "Aguardando aprovação",
    tableGroup: "junior",
    valorContrato: "R$ 9.100,00",
    nomeCliente: "ETA LTDA",
    numeroContrato: "6060606060",
    dataContrato: "12/12/2024",
    chassi: "9BWZZZ9************",
    fornecedor: "FORNECEDOR ETA",
    gerenteNegocio: "Junior GC",
  },
];

export const GERENTES = [
  { id: "kaique", label: "Kaique Atene GC" },
  { id: "maria", label: "Maria GC" },
  { id: "joao", label: "João GC" },
  { id: "junior", label: "Junior GC" },
] as const;
