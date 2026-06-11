import { useState } from "react";
import type { ReactNode } from "react";
import { ModalBackdrop } from "../Modals";
import type { CampaignType } from "../types";

// ─── Types ───────────────────────────────────────────────────────────────────
export type VincularEntry = "vincular" | "alterar" | "confirmar";
export type VincularRole = "Vendedor" | "Gerente / F&I";

export interface Funcionario {
  nome: string;
  cpf: string;
}

// Mock directory used by the CPF search (per flow spec — financiamento)
const FUNCIONARIOS: Funcionario[] = [
  { nome: "Andrean Rafael Lobo", cpf: "893.470.130-72" },
  { nome: "Eduardo Gomes", cpf: "453.470.130-72" },
];

// Mock directory for valor-fixo / numero-sorte (per Figma 8435:10272 / 8428:18518)
const FUNCIONARIOS_VALOR: Funcionario[] = [
  { nome: "Jéssica Silva Luz", cpf: "893.470.130-72" },
];

const VALOR_FIXO = "R$ 300,00";

// ─── CPF / CNPJ mask helpers ─────────────────────────────────────────────────
const onlyDigits = (s: string) => s.replace(/\D/g, "");

function maskCpf(digits: string): string {
  const d = digits.slice(0, 11);
  let out = d.slice(0, 3);
  if (d.length > 3) out += "." + d.slice(3, 6);
  if (d.length > 6) out += "." + d.slice(6, 9);
  if (d.length > 9) out += "-" + d.slice(9, 11);
  return out;
}

function maskCpfCnpj(digits: string): string {
  if (digits.length <= 11) return maskCpf(digits);
  const d = digits.slice(0, 14);
  let out = d.slice(0, 2);
  if (d.length > 2) out += "." + d.slice(2, 5);
  if (d.length > 5) out += "." + d.slice(5, 8);
  if (d.length > 8) out += "/" + d.slice(8, 12);
  if (d.length > 12) out += "-" + d.slice(12, 14);
  return out;
}

// ─── Icons ───────────────────────────────────────────────────────────────────
function LinkIcon({ className = "size-6 text-[#00842f]" }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244"
      />
    </svg>
  );
}

function PlusIcon() {
  return (
    <svg className="size-6 text-[#00842f]" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
    </svg>
  );
}

function SuccessIcon() {
  return (
    <svg className="size-8 text-[#00842f]" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="10" />
      <polyline points="8,12 11,15 16,9" />
    </svg>
  );
}

function WarnIcon() {
  return (
    <svg className="size-8 text-[#f59e0b]" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="8" x2="12" y2="12" />
      <line x1="12" y1="16" x2="12.01" y2="16" strokeWidth={3} />
    </svg>
  );
}

function RefreshIcon() {
  return (
    <svg className="size-4 text-[#4b4b4b]" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
    </svg>
  );
}

// ─── Shared building blocks ──────────────────────────────────────────────────
function BtnPrimary({
  children,
  onClick,
  disabledLook = false,
}: {
  children: ReactNode;
  onClick: () => void;
  disabledLook?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex h-12 w-full cursor-pointer items-center justify-center rounded-md text-base font-bold ${
        disabledLook
          ? "bg-[#e1e1e1] text-[#8e8e8e]"
          : "bg-[#00842f] text-white hover:bg-[#006b25]"
      }`}
    >
      {children}
    </button>
  );
}

function BtnOutline({ children, onClick }: { children: ReactNode; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="flex h-12 w-full cursor-pointer items-center justify-center rounded-md border border-[#00842f] text-base font-bold text-[#00842f] hover:bg-[#e6f3ea]"
    >
      {children}
    </button>
  );
}

function BtnGhost({ children, onClick }: { children: ReactNode; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="flex h-12 w-full cursor-pointer items-center justify-center rounded-md text-base font-bold text-[#00842f] hover:bg-[#e6f3ea]"
    >
      {children}
    </button>
  );
}

function WizardHeader({ icon, title, titleClass = "text-[#00842f]" }: { icon: ReactNode; title: string; titleClass?: string }) {
  return (
    <div className="flex items-center justify-center gap-4">
      {icon}
      <p className={`text-center text-[22px] font-bold leading-[26px] ${titleClass}`}>{title}</p>
    </div>
  );
}

/** Green highlighted result row (name · cpf · badge), per refs 8433:18845 / 8433:13297 */
function ResultRow({ cells, onClick }: { cells: string[]; onClick?: () => void }) {
  return (
    <div
      onClick={onClick}
      className={`flex items-start bg-[#dffbe8] ${onClick ? "cursor-pointer hover:bg-[#c9f5d8]" : ""}`}
    >
      {cells.map((cell, i) => (
        <div key={i} className="flex h-[54.667px] items-center px-4 py-3">
          <p className="whitespace-nowrap text-sm leading-[17px] text-[#015e22]">{cell}</p>
        </div>
      ))}
    </div>
  );
}

/** Modal card shared by every wizard step (overlay + centered white card + X) */
function WizardCard({ onClose, children, align = "items-center" }: { onClose: () => void; children: ReactNode; align?: string }) {
  return (
    <ModalBackdrop onClose={onClose}>
      <div className={`relative flex w-[400px] flex-col gap-10 ${align} rounded-lg bg-white p-8 shadow-xl`}>
        <button
          onClick={onClose}
          aria-label="Fechar"
          className="absolute right-3 top-3 cursor-pointer text-[#8e8e8e] hover:text-[#4b4b4b]"
        >
          <svg className="size-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
        {children}
      </div>
    </ModalBackdrop>
  );
}

// ─── Step: Quem deseja vincular? (radios) ────────────────────────────────────
function QuemStep({ onSelecionar, onClose }: { onSelecionar: (role: VincularRole) => void; onClose: () => void }) {
  const [role, setRole] = useState<VincularRole | null>(null);
  const options: VincularRole[] = ["Vendedor", "Gerente / F&I"];

  return (
    <WizardCard onClose={onClose}>
      <WizardHeader icon={<LinkIcon />} title="Vincular" />
      <div className="flex w-full flex-col gap-2">
        <p className="text-sm leading-[17px] text-black">Seleciona o funcionário que deseja vincular</p>
        <div className="flex w-full flex-col rounded-md border border-[#cacaca] py-1">
          {options.map((opt) => (
            <label
              key={opt}
              className={`flex cursor-pointer items-center gap-3 rounded-md px-4 py-4 text-base text-[#4b4b4b] hover:bg-[#dffbe8] ${
                role === opt ? "bg-[#dffbe8]" : "bg-white"
              }`}
            >
              <input
                type="radio"
                name="vincular-role"
                checked={role === opt}
                onChange={() => setRole(opt)}
                className="size-4 accent-[#00842f]"
              />
              {opt}
            </label>
          ))}
        </div>
      </div>
      <div className="w-full">
        <BtnPrimary disabledLook={role === null} onClick={() => role && onSelecionar(role)}>
          Selecionar
        </BtnPrimary>
      </div>
    </WizardCard>
  );
}

// ─── Step: CPF search ────────────────────────────────────────────────────────
function CpfSearchStep({
  role,
  funcionarios,
  resultCells,
  onSelect,
  onAddFuncionario,
  onExit,
  onClose,
}: {
  role: VincularRole;
  funcionarios: Funcionario[];
  resultCells: (pessoa: Funcionario) => string[];
  onSelect: (pessoa: Funcionario) => void;
  onAddFuncionario: () => void;
  onExit: () => void; // Sair (Vendedor) / Pular (Gerente)
  onClose: () => void;
}) {
  const [value, setValue] = useState("");
  const [feedback, setFeedback] = useState<"none" | "vazio" | "invalido">("none");

  const isGerente = role !== "Vendedor";
  const digits = onlyDigits(value);
  const matches =
    digits.length >= 6
      ? funcionarios.filter((f) => onlyDigits(f.cpf).startsWith(digits))
      : [];
  const liveInvalid = digits.length === 11 && matches.length === 0;
  const showInvalid = liveInvalid || feedback === "invalido";

  function handleSelecionar() {
    if (matches.length > 0) {
      onSelect(matches[0]);
    } else if (digits.length < 6) {
      setFeedback("vazio");
    } else {
      setFeedback("invalido");
    }
  }

  return (
    <WizardCard onClose={onClose}>
      <WizardHeader icon={<LinkIcon />} title="Vincular" />
      <div className="flex w-full flex-col gap-2">
        <p className="text-sm leading-[17px] text-black">
          {isGerente ? "Vincule o Gerente / F&I" : "Vincule o Vendedor"}
        </p>
        <input
          type="text"
          value={value}
          onChange={(e) => {
            setValue(maskCpf(onlyDigits(e.target.value)));
            setFeedback("none");
          }}
          placeholder={isGerente ? "Digite o CPF do Gerente / F&I" : "Digite o CPF do vendedor"}
          className={`w-full rounded-md border bg-white px-4 py-4 text-base leading-4 text-black placeholder-[#8e8e8e] outline-none ${
            showInvalid ? "border-[#cc0000]" : "border-[#cacaca]"
          }`}
        />
        {showInvalid ? (
          <p className="text-xs leading-[17px] text-[#cc0000]">Dados inválidos, tenta novamente.</p>
        ) : feedback === "vazio" ? (
          <p className="text-xs leading-[17px] text-[#4b4b4b]">Nenhum resultado encontrado</p>
        ) : (
          <p className="text-xs leading-[17px] text-[#4b4b4b]">
            Digite pelo menos 6 digitos do CPF para buscar
          </p>
        )}
      </div>

      {matches.length > 0 && (
        <div className="flex flex-col gap-2">
          {matches.map((m) => (
            <ResultRow
              key={m.cpf}
              cells={resultCells(m)}
              onClick={() => onSelect(m)}
            />
          ))}
        </div>
      )}

      <div className="flex w-full flex-col gap-2">
        <BtnPrimary disabledLook={matches.length === 0} onClick={handleSelecionar}>
          Selecionar
        </BtnPrimary>
        <BtnOutline onClick={onAddFuncionario}>Adicionar novo funcionário</BtnOutline>
        <BtnGhost onClick={onExit}>{isGerente ? "Pular" : "Sair"}</BtnGhost>
      </div>
    </WizardCard>
  );
}

// ─── Step: selected person card (Vincular / Sair) ────────────────────────────
function CardStep({
  pessoa,
  onVincular,
  onRedo,
  onClose,
}: {
  pessoa: Funcionario;
  onVincular: () => void;
  onRedo: () => void;
  onClose: () => void;
}) {
  return (
    <WizardCard onClose={onClose}>
      <WizardHeader icon={<LinkIcon />} title="Vincular" />
      <div className="flex items-center gap-10 rounded-md border border-[#cacaca] bg-white px-4 py-4">
        <p className="whitespace-nowrap text-base leading-4 text-black">{pessoa.nome}</p>
        <p className="whitespace-nowrap text-base leading-4 text-black">{pessoa.cpf}</p>
        <button onClick={onRedo} aria-label="Refazer busca" className="cursor-pointer">
          <RefreshIcon />
        </button>
      </div>
      <div className="flex w-full flex-col gap-2">
        <BtnPrimary onClick={onVincular}>Vincular</BtnPrimary>
        <BtnOutline onClick={onClose}>Sair</BtnOutline>
      </div>
    </WizardCard>
  );
}

// ─── Step: selected person card — valor-fixo / numero-sorte ──────────────────
// Per Figma 8435:10285 (com valor) / 8428:18569 (sem valor): label "Vendedor"
// acima do card com nome + CPF + refresh; valor em campo desabilitado ao lado.
function CardStepValor({
  pessoa,
  valor,
  onVincular,
  onRedo,
  onClose,
}: {
  pessoa: Funcionario;
  valor: string | null;
  onVincular: () => void;
  onRedo: () => void;
  onClose: () => void;
}) {
  return (
    <WizardCard onClose={onClose}>
      <WizardHeader icon={<LinkIcon />} title="Vincular" />
      <div className="flex w-full items-end gap-4">
        <div className="flex min-w-0 flex-1 flex-col gap-2">
          <p className="text-sm leading-[17px] text-black">Vendedor</p>
          <div className="flex items-center justify-between gap-3 rounded-md border border-[#cacaca] bg-white px-4 py-4">
            <p className="truncate text-base leading-4 text-black">{pessoa.nome}</p>
            <p className="whitespace-nowrap text-base leading-4 text-black">{pessoa.cpf}</p>
            <button onClick={onRedo} aria-label="Refazer busca" className="cursor-pointer">
              <RefreshIcon />
            </button>
          </div>
        </div>
        {valor !== null && (
          <div className="rounded-md border border-[#e1e1e1] bg-[#f5f5f5] px-4 py-4">
            <p className="whitespace-nowrap text-base leading-4 text-[#8e8e8e]">{valor}</p>
          </div>
        )}
      </div>
      <div className="flex w-full flex-col gap-2">
        <BtnPrimary onClick={onVincular}>Vincular</BtnPrimary>
        <BtnOutline onClick={onClose}>Sair</BtnOutline>
      </div>
    </WizardCard>
  );
}

// ─── Step: confirm vínculo (Sim / Não) ───────────────────────────────────────
function ConfirmaStep({
  role,
  pessoa,
  valorLine,
  onSim,
  onNao,
  onClose,
}: {
  role: VincularRole;
  pessoa: Funcionario;
  /** 2ª linha "No valor: R$ 300,00" (apenas valor-fixo, ref 8435:10302) */
  valorLine?: string | null;
  onSim: () => void;
  onNao: () => void;
  onClose: () => void;
}) {
  return (
    <WizardCard onClose={onClose}>
      <WizardHeader icon={<LinkIcon />} title="Vincular" />
      <div className="text-center text-base font-bold text-black">
        <p>{pessoa.nome}</p>
        <p>Doc: {pessoa.cpf}</p>
      </div>
      <div className="w-[297px] text-center text-sm text-[#4b4b4b]">
        <p>
          {role === "Vendedor"
            ? "Deseja confirmar o vínculo do Vendedor?"
            : "Deseja confirmar o vínculo do Gerente/F&I?"}
        </p>
        {valorLine && <p>No valor: {valorLine}</p>}
      </div>
      <div className="flex w-full flex-col gap-2">
        <BtnPrimary onClick={onSim}>Sim</BtnPrimary>
        <BtnOutline onClick={onNao}>Não</BtnOutline>
      </div>
    </WizardCard>
  );
}

// ─── Step: success (vincular flow) ───────────────────────────────────────────
function SucessoVinculoStep({
  showVincularGerente,
  onFinalizar,
  onVincularGerente,
  onClose,
}: {
  showVincularGerente: boolean;
  onFinalizar: () => void;
  onVincularGerente: () => void;
  onClose: () => void;
}) {
  return (
    <WizardCard onClose={onClose}>
      <SuccessIcon />
      <div className="w-[297px] text-center text-base font-bold text-black">
        <p>Contrato vinculado</p>
        <p>com sucesso!</p>
      </div>
      <p className="w-[297px] text-center text-sm text-[#4b4b4b]">O contrato foi vinculado com êxito.</p>
      <div className="flex w-full flex-col gap-2">
        <BtnPrimary onClick={onFinalizar}>Finalizar</BtnPrimary>
        {showVincularGerente && <BtnOutline onClick={onVincularGerente}>Vincular gerente</BtnOutline>}
      </div>
    </WizardCard>
  );
}

// ─── Step: adicionar novo funcionário ────────────────────────────────────────
function AddFuncionarioStep({
  onAdicionar,
  onCancelar,
  onClose,
}: {
  onAdicionar: (pessoa: Funcionario) => void;
  onCancelar: () => void;
  onClose: () => void;
}) {
  const [nome, setNome] = useState("");
  const [doc, setDoc] = useState("");
  const valid = nome.trim().length > 0 && onlyDigits(doc).length > 0;

  return (
    <WizardCard onClose={onClose} align="items-start">
      <div className="flex items-center gap-4">
        <PlusIcon />
        <p className="text-[22px] font-bold leading-normal text-black">Adicionar novo funcionário</p>
      </div>
      <div className="flex w-full flex-col gap-2">
        <div className="flex w-full flex-col gap-2">
          <p className="text-sm leading-[17px] text-black">Adicionar funcionário</p>
          <input
            type="text"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            placeholder="Nome completo"
            className="w-full rounded-md border border-[#cacaca] bg-white px-4 py-4 text-base leading-4 text-black placeholder-[#8e8e8e] outline-none"
          />
        </div>
        <input
          type="text"
          value={doc}
          onChange={(e) => setDoc(maskCpfCnpj(onlyDigits(e.target.value)))}
          placeholder="CPF ou CNPJ"
          className="w-full rounded-md border border-[#cacaca] bg-white px-4 py-4 text-base leading-4 text-black placeholder-[#8e8e8e] outline-none"
        />
      </div>
      <div className="flex w-full flex-col gap-2">
        <BtnPrimary
          disabledLook={!valid}
          onClick={() => {
            if (valid) onAdicionar({ nome: nome.trim(), cpf: doc });
          }}
        >
          Adicionar
        </BtnPrimary>
        <BtnOutline onClick={onCancelar}>Cancelar</BtnOutline>
      </div>
    </WizardCard>
  );
}

// ─── Step: confirm cadastro do funcionário ───────────────────────────────────
function AddConfirmaStep({
  pessoa,
  onSim,
  onNao,
  onClose,
}: {
  pessoa: Funcionario;
  onSim: () => void;
  onNao: () => void;
  onClose: () => void;
}) {
  return (
    <WizardCard onClose={onClose}>
      <div className="flex items-center gap-4">
        <PlusIcon />
        <p className="text-center text-[22px] font-bold leading-normal text-black">
          Adicionar novo funcionário
        </p>
      </div>
      <div className="text-center text-base font-bold text-black">
        <p>{pessoa.nome}</p>
        <p>Doc: {pessoa.cpf}</p>
      </div>
      <p className="w-[297px] text-center text-sm text-[#4b4b4b]">Confirma o cadastro desse funcionário?</p>
      <div className="flex w-full flex-col gap-2">
        <BtnPrimary onClick={onSim}>Sim</BtnPrimary>
        <BtnOutline onClick={onNao}>Não</BtnOutline>
      </div>
    </WizardCard>
  );
}

// ─── Step: alterar vínculo ───────────────────────────────────────────────────
function AlterarStep({
  cells,
  onAlterar,
  onClose,
}: {
  /** Linha do vínculo atual (formato varia por tipo de campanha) */
  cells: string[];
  onAlterar: () => void;
  onClose: () => void;
}) {
  return (
    <WizardCard onClose={onClose}>
      <WizardHeader icon={<LinkIcon />} title="Alterar vinculo" />
      <ResultRow cells={cells} />
      <p className="w-[297px] text-center text-sm text-[#4b4b4b]">Deseja substituir o vinculo atual?</p>
      <div className="flex w-full flex-col gap-2">
        <BtnPrimary onClick={onAlterar}>Alterar</BtnPrimary>
        <BtnOutline onClick={onClose}>Sair</BtnOutline>
      </div>
    </WizardCard>
  );
}

// ─── Step: atenção (confirmar vínculo) ───────────────────────────────────────
function AtencaoConfirmarStep({
  onSim,
  onNao,
  onClose,
}: {
  onSim: () => void;
  onNao: () => void;
  onClose: () => void;
}) {
  return (
    <WizardCard onClose={onClose}>
      <div className="flex flex-col items-center gap-6">
        <WarnIcon />
        <p className="text-center text-[22px] font-bold leading-normal text-black">Atenção</p>
        <p className="w-[297px] text-center text-sm leading-normal text-[#4b4b4b]">
          Está ação não pode ser desfeita, deseja continuar?
        </p>
      </div>
      <div className="flex w-full flex-col gap-2">
        <BtnPrimary onClick={onSim}>Sim</BtnPrimary>
        <BtnOutline onClick={onNao}>Não</BtnOutline>
      </div>
    </WizardCard>
  );
}

// ─── Step: simple success with Ok ────────────────────────────────────────────
function SucessoOkStep({
  message,
  onOk,
  onClose,
}: {
  message: string;
  onOk: () => void;
  onClose: () => void;
}) {
  return (
    <WizardCard onClose={onClose}>
      <SuccessIcon />
      <p className="w-[297px] whitespace-pre-line text-center text-base font-bold text-black">{message}</p>
      <div className="w-full">
        <BtnPrimary onClick={onOk}>Ok</BtnPrimary>
      </div>
    </WizardCard>
  );
}

// ─── Step: completar dados do vendedor ───────────────────────────────────────
const COMPLETAR_CPF = "893.470.130-72";

function CompletarDadosStep({
  valor,
  onConfirmar,
  onClose,
}: {
  /** "R$ 300,00" (financiamento / valor-fixo) ou null (numero-sorte) */
  valor: string | null;
  onConfirmar: (nome: string) => void;
  onClose: () => void;
}) {
  const [nome, setNome] = useState("");
  const valid = nome.trim().length > 0;

  return (
    <WizardCard onClose={onClose}>
      <WizardHeader icon={<LinkIcon />} title="Completar dados do vendedor" />
      <div className="flex w-full items-start bg-[#dffbe8]">
        <div className="flex h-[54.667px] flex-1 items-center px-4 py-3">
          <p className="whitespace-nowrap text-sm leading-[17px] text-[#015e22]">{COMPLETAR_CPF}</p>
        </div>
        {valor !== null && (
          <div className="flex h-[54.667px] items-center px-4 py-3">
            <p className="whitespace-nowrap text-sm leading-[17px] text-[#015e22]">{valor}</p>
          </div>
        )}
      </div>
      <div className="flex w-full flex-col gap-2">
        <p className="text-sm leading-[17px] text-black">Nome do vendedor</p>
        <input
          type="text"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          placeholder="Jéssica"
          className="w-full rounded-md border border-[#cacaca] bg-white px-4 py-4 text-base leading-4 text-black placeholder-[#8e8e8e] outline-none"
        />
      </div>
      <div className="flex w-full flex-col gap-2">
        <BtnPrimary disabledLook={!valid} onClick={() => valid && onConfirmar(nome.trim())}>
          Confirmar
        </BtnPrimary>
        <BtnOutline onClick={onClose}>Sair</BtnOutline>
      </div>
    </WizardCard>
  );
}

// ─── Step: completar dados — painel de confirmação (3 botões) ────────────────
function CompletarConfirmaStep({
  nome,
  valor,
  onAtualizarEVincular,
  onAtualizarESair,
  onClose,
}: {
  nome: string;
  /** "R$ 300,00" (financiamento / valor-fixo) ou null (numero-sorte) */
  valor: string | null;
  onAtualizarEVincular: () => void;
  onAtualizarESair: () => void;
  onClose: () => void;
}) {
  return (
    <WizardCard onClose={onClose}>
      <WizardHeader icon={<LinkIcon />} title="Completar dados do vendedor" />
      <ResultRow cells={valor !== null ? [nome, COMPLETAR_CPF, valor] : [nome, COMPLETAR_CPF]} />
      <div className="w-[297px] text-center text-sm text-[#4b4b4b]">
        <p>Confirma a atualização dos dados do vendedor e deseja continuar para vinculação do contrato?</p>
        <p>&nbsp;</p>
        <p>A vinculação não pode ser desfeita, como deseja continuar?</p>
      </div>
      <div className="flex w-full flex-col gap-2">
        <BtnPrimary onClick={onAtualizarEVincular}>Atualizar e vincular</BtnPrimary>
        <BtnOutline onClick={onAtualizarESair}>Atualizar e sair</BtnOutline>
        <BtnGhost onClick={onClose}>Sair</BtnGhost>
      </div>
    </WizardCard>
  );
}

// ─── Wizard state machine ────────────────────────────────────────────────────
type Step =
  | { id: "quem" }
  | { id: "cpf"; role: VincularRole }
  | { id: "card"; role: VincularRole; pessoa: Funcionario }
  | { id: "confirma"; role: VincularRole; pessoa: Funcionario }
  | { id: "sucesso"; role: VincularRole; pessoa: Funcionario | null }
  | { id: "addFuncionario"; role: VincularRole }
  | { id: "addConfirma"; role: VincularRole; pessoa: Funcionario }
  | { id: "alterar" }
  | { id: "atencaoConfirmar" }
  | { id: "confirmadoSucesso" }
  | { id: "completarDados" }
  | { id: "completarConfirma"; nome: string }
  | { id: "atualizadoSucesso"; nome: string; vinculado: boolean };

export interface VincularWizardProps {
  entry: VincularEntry;
  /** Tipo da campanha selecionada — muda as particularidades do fluxo */
  campaignType?: CampaignType;
  /** Current link shown in the "Alterar vinculo" step */
  vinculoAtual?: Funcionario;
  /** Marks the contract as having an incomplete cadastro (Confirmar vínculo flow) */
  cadastroIncompleto?: boolean;
  /** Apply the link to the row (vendedor/gerente name + status update) */
  onVincular: (role: VincularRole, nome: string) => void;
  /** Confirmar vínculo with complete cadastro — confirmed via Ok */
  onConfirmarVinculo: () => void;
  /** Completar dados flow: update vendedor name; `vincular` also links the contract */
  onAtualizarDados: (nome: string, vincular: boolean) => void;
  onClose: () => void;
}

export default function VincularWizard({
  entry,
  campaignType = "financiamento",
  vinculoAtual,
  cadastroIncompleto = false,
  onVincular,
  onConfirmarVinculo,
  onAtualizarDados,
  onClose,
}: VincularWizardProps) {
  // ── Particularidades por tipo ──────────────────────────────────────────────
  const isFinanciamento = campaignType === "financiamento";
  // Valor exibido nas etapas (card / confirmação): apenas valor-fixo
  const valorEtapas = campaignType === "valor-fixo" ? VALOR_FIXO : null;
  // Valor do "Completar dados": financiamento e valor-fixo têm R$; numero-sorte não
  const valorCompletar = campaignType === "numero-sorte" ? null : VALOR_FIXO;
  const funcionarios = isFinanciamento ? FUNCIONARIOS : FUNCIONARIOS_VALOR;
  const vinculoAtualResolved = vinculoAtual ?? funcionarios[0];

  // Linha de resultado da busca / vínculo atual:
  // financiamento: nome + CPF + badge "Não cadastrado"
  // valor-fixo:    nome + CPF + "R$ 300,00"
  // numero-sorte:  nome + CPF
  const resultCells = (pessoa: Funcionario): string[] => {
    if (isFinanciamento) return [pessoa.nome, pessoa.cpf, "Não cadastrado"];
    if (campaignType === "valor-fixo") return [pessoa.nome, pessoa.cpf, VALOR_FIXO];
    return [pessoa.nome, pessoa.cpf];
  };

  const [step, setStep] = useState<Step>(() => {
    if (entry === "alterar") return { id: "alterar" };
    if (entry === "confirmar") return { id: "atencaoConfirmar" };
    // valor-fixo / numero-sorte: sem "Quem deseja vincular?" — direto ao Vendedor
    if (campaignType !== "financiamento") return { id: "cpf", role: "Vendedor" };
    return { id: "quem" };
  });

  switch (step.id) {
    case "quem":
      return (
        <QuemStep
          onSelecionar={(role) => setStep({ id: "cpf", role })}
          onClose={onClose}
        />
      );

    case "cpf":
      return (
        <CpfSearchStep
          key={step.role}
          role={step.role}
          funcionarios={funcionarios}
          resultCells={resultCells}
          onSelect={(pessoa) => setStep({ id: "card", role: step.role, pessoa })}
          onAddFuncionario={() => setStep({ id: "addFuncionario", role: step.role })}
          onExit={
            step.role === "Vendedor"
              ? onClose // Sair
              : () => setStep({ id: "sucesso", role: step.role, pessoa: null }) // Pular
          }
          onClose={onClose}
        />
      );

    case "card":
      return isFinanciamento ? (
        <CardStep
          pessoa={step.pessoa}
          onVincular={() => setStep({ id: "confirma", role: step.role, pessoa: step.pessoa })}
          onRedo={() => setStep({ id: "cpf", role: step.role })}
          onClose={onClose}
        />
      ) : (
        <CardStepValor
          pessoa={step.pessoa}
          valor={valorEtapas}
          onVincular={() => setStep({ id: "confirma", role: step.role, pessoa: step.pessoa })}
          onRedo={() => setStep({ id: "cpf", role: step.role })}
          onClose={onClose}
        />
      );

    case "confirma":
      return (
        <ConfirmaStep
          role={step.role}
          pessoa={step.pessoa}
          valorLine={valorEtapas}
          onSim={() => setStep({ id: "sucesso", role: step.role, pessoa: step.pessoa })}
          onNao={() => setStep({ id: "card", role: step.role, pessoa: step.pessoa })}
          onClose={onClose}
        />
      );

    case "sucesso":
      return (
        <SucessoVinculoStep
          showVincularGerente={isFinanciamento && step.role === "Vendedor" && step.pessoa !== null}
          onFinalizar={() => {
            if (step.pessoa) onVincular(step.role, step.pessoa.nome);
            onClose();
          }}
          onVincularGerente={() => {
            // Apply the vendedor link, then jump to the Gerente/F&I CPF step
            if (step.pessoa) onVincular(step.role, step.pessoa.nome);
            setStep({ id: "cpf", role: "Gerente / F&I" });
          }}
          onClose={onClose}
        />
      );

    case "addFuncionario":
      return (
        <AddFuncionarioStep
          onAdicionar={(pessoa) => setStep({ id: "addConfirma", role: step.role, pessoa })}
          onCancelar={() => setStep({ id: "cpf", role: step.role })}
          onClose={onClose}
        />
      );

    case "addConfirma":
      return (
        <AddConfirmaStep
          pessoa={step.pessoa}
          onSim={() => setStep({ id: "card", role: step.role, pessoa: step.pessoa })}
          onNao={() => setStep({ id: "addFuncionario", role: step.role })}
          onClose={onClose}
        />
      );

    case "alterar":
      return (
        <AlterarStep
          cells={resultCells(vinculoAtualResolved)}
          onAlterar={() => setStep({ id: "cpf", role: "Vendedor" })}
          onClose={onClose}
        />
      );

    case "atencaoConfirmar":
      return (
        <AtencaoConfirmarStep
          onSim={() =>
            setStep(cadastroIncompleto ? { id: "completarDados" } : { id: "confirmadoSucesso" })
          }
          onNao={onClose}
          onClose={onClose}
        />
      );

    case "confirmadoSucesso":
      return (
        <SucessoOkStep
          message={"Contrato vinculado\ncom sucesso!"}
          onOk={() => {
            onConfirmarVinculo();
            onClose();
          }}
          onClose={onClose}
        />
      );

    case "completarDados":
      return (
        <CompletarDadosStep
          valor={valorCompletar}
          onConfirmar={(nome) => setStep({ id: "completarConfirma", nome })}
          onClose={onClose}
        />
      );

    case "completarConfirma":
      return (
        <CompletarConfirmaStep
          nome={step.nome}
          valor={valorCompletar}
          onAtualizarEVincular={() =>
            setStep({ id: "atualizadoSucesso", nome: step.nome, vinculado: true })
          }
          onAtualizarESair={() =>
            setStep({ id: "atualizadoSucesso", nome: step.nome, vinculado: false })
          }
          onClose={onClose}
        />
      );

    case "atualizadoSucesso":
      return (
        <SucessoOkStep
          message={
            step.vinculado
              ? "Contrato atualizado e vinculado\ncom sucesso!"
              : "Contrato atualizado\ncom sucesso!"
          }
          onOk={() => {
            onAtualizarDados(step.nome, step.vinculado);
            onClose();
          }}
          onClose={onClose}
        />
      );
  }
}
