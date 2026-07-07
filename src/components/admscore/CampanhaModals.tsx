import { useState } from "react";
import ModalShell from "../login/ModalShell";
import { ChevronDownIcon } from "../login/icons";
import { CalendarIcon, PencilIcon } from "./icons";
import { inputBase, inputBorder, primaryButton } from "../login/ui";

export type TipoCampanha = "Campanha faturamento" | "Campanha valor" | "Campanha valor fixo";

export interface NovaCampanha {
  tipo: TipoCampanha;
  nome: string;
  descricao: string;
  inicio: string;
  termino: string;
  meta: string;
  pontuacao: string;
  publico: string;
  contrato: string;
}

const TIPOS: TipoCampanha[] = ["Campanha faturamento", "Campanha valor", "Campanha valor fixo"];

// Botões do fluxo de campanha são pill (raio total), conforme o design.
const pillButton = primaryButton.replace("rounded-md", "rounded-full");
export const PUBLICOS = ["Todos os participantes", "Gerentes de Negócios", "Gerentes de Contas"];
export const CONTRATOS = ["Contrato 0001/2025", "Contrato 0002/2025", "Contrato 0003/2026"];

/** Máscara progressiva de data DD/MM/AAAA. */
function maskData(value: string): string {
  const d = value.replace(/\D/g, "").slice(0, 8);
  if (d.length <= 2) return d;
  if (d.length <= 4) return `${d.slice(0, 2)}/${d.slice(2)}`;
  return `${d.slice(0, 2)}/${d.slice(2, 4)}/${d.slice(4)}`;
}

function Campo({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex w-full flex-col gap-2">
      <label className="text-sm font-bold leading-[17px] text-black">{label}</label>
      {children}
    </div>
  );
}

function WizardHeader({ etapa }: { etapa: string }) {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-center gap-2 text-[#00842f]">
        <PencilIcon className="size-5" />
        <h2 className="text-lg font-bold">Cadastrar Nova Campanha</h2>
      </div>
      <p className="text-sm text-[#8e8e8e]">{etapa}</p>
    </div>
  );
}

function SelectCampo({
  label,
  value,
  placeholder,
  options,
  onChange,
}: {
  label: string;
  value: string;
  placeholder: string;
  options: string[];
  onChange: (v: string) => void;
}) {
  return (
    <Campo label={label}>
      <div className="relative w-full">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`${inputBase} ${inputBorder(false)} appearance-none pr-12 ${
            value === "" ? "text-[#8e8e8e]" : ""
          }`}
        >
          <option value="" disabled>
            {placeholder}
          </option>
          {options.map((o) => (
            <option key={o} value={o}>
              {o}
            </option>
          ))}
        </select>
        <ChevronDownIcon className="pointer-events-none absolute right-4 top-1/2 size-5 -translate-y-1/2 text-[#4b4b4b]" />
      </div>
    </Campo>
  );
}

// ─── Wizard: Cadastrar Nova Campanha (2 etapas + confirmação + sucesso) ───────
// Fluxo conforme Figma 9275:1003 → 9275:15829 → 9275:15889 → 9275:15898.
export default function CadastrarCampanhaFlow({
  onCriar,
  onClose,
}: {
  onCriar: (c: NovaCampanha) => void;
  onClose: () => void;
}) {
  const [step, setStep] = useState<"etapa1" | "etapa2" | "confirmacao" | "sucesso">("etapa1");
  const [tipo, setTipo] = useState<TipoCampanha>("Campanha faturamento");
  const [nome, setNome] = useState("");
  const [descricao, setDescricao] = useState("");
  const [inicio, setInicio] = useState("");
  const [termino, setTermino] = useState("");
  const [meta, setMeta] = useState("");
  const [pontuacao, setPontuacao] = useState("");
  const [publico, setPublico] = useState("");
  const [contrato, setContrato] = useState("");

  const etapa1Ok = nome.trim() !== "" && inicio.length === 10 && termino.length === 10;
  const etapa2Ok = meta.trim() !== "" && pontuacao.trim() !== "" && publico !== "" && contrato !== "";

  const campanha: NovaCampanha = {
    tipo,
    nome: nome.trim(),
    descricao: descricao.trim(),
    inicio,
    termino,
    meta: meta.trim(),
    pontuacao: pontuacao.trim(),
    publico,
    contrato,
  };

  if (step === "etapa1") {
    return (
      <ModalShell onClose={onClose} width={480}>
        <form
          className="flex flex-col gap-6"
          onSubmit={(e) => {
            e.preventDefault();
            if (etapa1Ok) setStep("etapa2");
          }}
          noValidate
        >
          <WizardHeader etapa="Etapa 1 de 2 · Informações" />

          <Campo label="Tipo de campanha">
            <div className="flex flex-col gap-2">
              {TIPOS.map((t) => {
                const checked = tipo === t;
                return (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setTipo(t)}
                    className="flex items-center gap-2 text-left text-base text-[#4b4b4b]"
                  >
                    <span
                      className={`flex size-5 shrink-0 items-center justify-center rounded-full border-2 ${
                        checked ? "border-[#00842f]" : "border-[#8e8e8e]"
                      }`}
                    >
                      {checked && <span className="size-2.5 rounded-full bg-[#00842f]" />}
                    </span>
                    {t}
                  </button>
                );
              })}
            </div>
          </Campo>

          <Campo label="Nome da campanha">
            <input
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              placeholder="Ex: Líderes em vendas automotivas 2026"
              className={`${inputBase} ${inputBorder(false)}`}
            />
          </Campo>

          <Campo label="Descrição">
            <textarea
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              rows={2}
              placeholder="Descreva o objetivo da campanha"
              className={`${inputBase} ${inputBorder(false)} resize-none`}
            />
          </Campo>

          <div className="flex w-full gap-4">
            {(
              [
                ["Data de início", inicio, setInicio],
                ["Data de término", termino, setTermino],
              ] as const
            ).map(([label, value, setValue]) => (
              <Campo key={label} label={label}>
                <div className="relative w-full">
                  <input
                    value={value}
                    onChange={(e) => setValue(maskData(e.target.value))}
                    inputMode="numeric"
                    placeholder="DD/MM/AAAA"
                    className={`${inputBase} ${inputBorder(false)} pr-11`}
                  />
                  <CalendarIcon className="pointer-events-none absolute right-3 top-1/2 size-5 -translate-y-1/2 text-[#4b4b4b]" />
                </div>
              </Campo>
            ))}
          </div>

          <div className="flex flex-col gap-2 pt-2">
            <button type="submit" disabled={!etapa1Ok} className={`${pillButton} w-full`}>
              Continuar
            </button>
            <button
              type="button"
              onClick={onClose}
              className="cursor-pointer py-2 text-center text-base font-bold text-black hover:underline"
            >
              Cancelar
            </button>
          </div>
        </form>
      </ModalShell>
    );
  }

  if (step === "etapa2") {
    return (
      <ModalShell onClose={onClose} width={480}>
        <form
          className="flex flex-col gap-6"
          onSubmit={(e) => {
            e.preventDefault();
            if (etapa2Ok) setStep("confirmacao");
          }}
          noValidate
        >
          <WizardHeader etapa="Etapa 2 de 2 · Regras e premiação" />

          <Campo label="Meta da campanha">
            <input
              value={meta}
              onChange={(e) => setMeta(e.target.value)}
              placeholder="R$ 0,00"
              className={`${inputBase} ${inputBorder(false)}`}
            />
          </Campo>

          <Campo label="Pontuação por venda">
            <input
              value={pontuacao}
              onChange={(e) => setPontuacao(e.target.value)}
              placeholder="Ex: 10 pontos"
              className={`${inputBase} ${inputBorder(false)}`}
            />
          </Campo>

          <SelectCampo
            label="Público-alvo"
            value={publico}
            placeholder="Selecione o público"
            options={PUBLICOS}
            onChange={setPublico}
          />

          <SelectCampo
            label="Contrato vinculado"
            value={contrato}
            placeholder="Selecione o contrato"
            options={CONTRATOS}
            onChange={setContrato}
          />

          <div className="flex flex-col gap-2 pt-2">
            <button type="submit" disabled={!etapa2Ok} className={`${pillButton} w-full`}>
              Criar campanha
            </button>
            <button
              type="button"
              onClick={() => setStep("etapa1")}
              className="cursor-pointer py-2 text-center text-base font-bold text-black hover:underline"
            >
              Voltar
            </button>
          </div>
        </form>
      </ModalShell>
    );
  }

  if (step === "confirmacao") {
    return (
      <ModalShell onClose={onClose} width={392}>
        <div className="flex flex-col gap-6 text-center">
          <h2 className="text-[22px] font-bold leading-[26px] text-[#00842f]">Criar campanha</h2>
          <p className="text-sm leading-[21px] text-black">
            Deseja criar esta campanha? Após a confirmação ela ficará disponível para os
            participantes.
          </p>
          <div className="flex flex-col gap-2">
            <button
              type="button"
              onClick={() => setStep("sucesso")}
              className={`${pillButton} w-full`}
            >
              Confirmar
            </button>
            <button
              type="button"
              onClick={onClose}
              className="cursor-pointer py-2 text-center text-base font-bold text-black hover:underline"
            >
              Cancelar
            </button>
          </div>
        </div>
      </ModalShell>
    );
  }

  // sucesso
  return (
    <ModalShell onClose={() => onCriar(campanha)} width={392}>
      <div className="flex flex-col items-center gap-6 text-center">
        <svg className="size-14 text-[#4caf50]" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            d="M21 12a9 9 0 1 1-2.6-6.3"
          />
          <path strokeLinecap="round" strokeLinejoin="round" d="m9 12.5 2.3 2.3L16 10" />
        </svg>
        <h2 className="text-lg font-bold text-black">Campanha criada com sucesso</h2>
        <button
          type="button"
          onClick={() => onCriar(campanha)}
          className={`${pillButton} w-full`}
        >
          Concluir
        </button>
      </div>
    </ModalShell>
  );
}
