import type { Contrato } from "./types";

interface DetalhesContratoPanelProps {
  contrato: Contrato;
  onClose: () => void;
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-2">
      <span className="text-sm text-[#8e8e8e]">{label}</span>
      <div className="rounded-md border border-[#e1e1e1] bg-[#f5f5f5] px-4 py-4 text-base text-[#8e8e8e]">
        {value}
      </div>
    </div>
  );
}

export default function DetalhesContratoPanel({
  contrato,
  onClose,
}: DetalhesContratoPanelProps) {
  return (
    <div className="fixed inset-y-0 right-0 z-40 flex w-[720px] max-w-full flex-col overflow-y-auto bg-white shadow-xl">
      <div className="flex items-center justify-between border-b border-[#cacaca] px-8 py-6">
        <div className="flex items-center gap-4">
          <svg className="size-10 text-[#00842f]" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
          </svg>
          <p className="text-[22px] font-bold leading-[26px] text-[#00842f]">Detalhes do contrato</p>
        </div>
        <button onClick={onClose} className="text-[#8e8e8e] hover:text-[#4b4b4b]">
          <svg className="size-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </div>

      <div className="flex flex-1 flex-col gap-8 px-8 py-8">
        <div className="grid grid-cols-2 gap-x-8 gap-y-2">
          {/* Left column */}
          <div className="flex flex-col gap-2">
            <Field label="Vendedor" value={contrato.vendedor} />
            <Field label="Código de revenda" value={contrato.codigoRevenda} />
            <Field label="Data do contrato" value={contrato.dataContrato ?? "00/00/0000"} />
            <Field label="Gerente de negócios" value={contrato.gerenteNegocio ?? "—"} />
            <Field label="Grupo econômico" value={contrato.grupoEconomico} />
            <Field label="CNPJ do cliente" value={contrato.cnpjCliente} />
          </div>
          {/* Right column */}
          <div className="flex flex-col gap-2">
            <Field label="Valor do contrato" value={contrato.valorContrato ?? "—"} />
            <Field label="Nome do cliente" value={contrato.nomeCliente ?? "—"} />
            <Field label="Número da proposta" value={contrato.numeroProposta} />
            <Field label="Número do contrato" value={contrato.numeroContrato ?? "—"} />
            <Field label="Chassi" value={contrato.chassi ?? "—"} />
            <Field label="Fornecedor" value={contrato.fornecedor ?? "—"} />
          </div>
        </div>

        <button
          onClick={onClose}
          className="flex h-12 w-full cursor-pointer items-center justify-center rounded-md border border-[#00842f] text-base font-bold text-[#00842f] hover:bg-[#e6f3ea]"
        >
          Fechar
        </button>
      </div>
    </div>
  );
}
