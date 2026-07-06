import { useState } from "react";
import ModalShell from "../login/ModalShell";
import { CheckCircleIcon } from "../login/icons";
import { PencilIcon } from "./icons";
import { inputBase, inputBorder, inputDisabled, primaryButton } from "../login/ui";

type Tipo = "Gerente de Negócios" | "Gerente de Contas";

// ─── Radio de tipo de usuário ────────────────────────────────────────────────
function TipoRadios({
  value,
  onChange,
}: {
  value: Tipo;
  onChange: (t: Tipo) => void;
}) {
  const opts: Tipo[] = ["Gerente de Negócios", "Gerente de Contas"];
  return (
    <div className="flex flex-col gap-2">
      {opts.map((opt) => {
        const checked = value === opt;
        return (
          <button
            key={opt}
            type="button"
            onClick={() => onChange(opt)}
            className="flex items-center gap-2 text-left text-sm text-black"
          >
            <span
              className={`flex size-5 shrink-0 items-center justify-center rounded-full border ${
                checked ? "border-[#00842f]" : "border-[#cacaca]"
              }`}
            >
              {checked && <span className="size-2.5 rounded-full bg-[#00842f]" />}
            </span>
            {opt}
          </button>
        );
      })}
    </div>
  );
}

function Campo({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex w-full flex-col gap-2">
      <label className="text-sm leading-[17px] text-black">{label}</label>
      {children}
    </div>
  );
}

function ModalHeader({ title }: { title: string }) {
  return (
    <div className="flex items-center justify-center gap-2 text-[#00842f]">
      <PencilIcon className="size-5" />
      <h2 className="text-lg font-bold">{title}</h2>
    </div>
  );
}

// ─── Cadastrar Novo Usuário ──────────────────────────────────────────────────
export function CadastrarUsuarioModal({
  onSalvar,
  onClose,
}: {
  onSalvar: () => void;
  onClose: () => void;
}) {
  const [tipo, setTipo] = useState<Tipo>("Gerente de Negócios");
  const [nome, setNome] = useState("");
  const [funcional, setFuncional] = useState("");
  const [email, setEmail] = useState("");
  const podeSalvar = nome.trim() !== "" && funcional.trim() !== "" && email.trim() !== "";

  return (
    <ModalShell onClose={onClose} width={420}>
      <form
        className="flex flex-col gap-6"
        onSubmit={(e) => {
          e.preventDefault();
          if (podeSalvar) onSalvar();
        }}
      >
        <ModalHeader title="Cadastrar Novo Usuário" />
        <TipoRadios value={tipo} onChange={setTipo} />
        <Campo label="Nome Completo">
          <input
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            placeholder="Digite o nome completo do usuário"
            className={`${inputBase} ${inputBorder(false)}`}
          />
        </Campo>
        <Campo label="Funcional">
          <input
            value={funcional}
            onChange={(e) => setFuncional(e.target.value.replace(/\D/g, ""))}
            inputMode="numeric"
            placeholder="Digite a funcional do usuário"
            className={`${inputBase} ${inputBorder(false)}`}
          />
        </Campo>
        <Campo label="E-mail">
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            placeholder="alexandre.araujo@email.com"
            className={`${inputBase} ${inputBorder(false)}`}
          />
        </Campo>
        <div className="flex flex-col gap-2">
          <button type="submit" disabled={!podeSalvar} className={`${primaryButton} w-full`}>
            Salvar
          </button>
          <button type="button" onClick={onClose} className="cursor-pointer text-center text-base font-bold text-[#00842f] hover:underline">
            Voltar
          </button>
        </div>
      </form>
    </ModalShell>
  );
}

// ─── Editar GN / GC ──────────────────────────────────────────────────────────
export function EditarUsuarioModal({
  nomeInicial,
  emailInicial,
  tipoInicial,
  onSalvar,
  onClose,
}: {
  nomeInicial: string;
  emailInicial: string;
  tipoInicial: Tipo;
  onSalvar: () => void;
  onClose: () => void;
}) {
  const [nome, setNome] = useState(nomeInicial);
  const [email, setEmail] = useState(emailInicial);
  const [tipo, setTipo] = useState<Tipo>(tipoInicial);
  const [justificativa, setJustificativa] = useState("");

  return (
    <ModalShell onClose={onClose} width={420}>
      <form
        className="flex flex-col gap-6"
        onSubmit={(e) => {
          e.preventDefault();
          onSalvar();
        }}
      >
        <ModalHeader title="Editar GN / GC" />
        <Campo label="Nome Completo">
          <input
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            className={`${inputBase} ${inputBorder(false)}`}
          />
        </Campo>
        <Campo label="E-mail">
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            className={`${inputBase} ${inputBorder(false)}`}
          />
        </Campo>
        <TipoRadios value={tipo} onChange={setTipo} />
        <Campo label="Justificativa da edição">
          <textarea
            value={justificativa}
            onChange={(e) => setJustificativa(e.target.value)}
            rows={3}
            placeholder="Insira o que foi alterado e quem solicitou a alteração..."
            className={`${inputBase} ${inputBorder(false)} resize-none`}
          />
        </Campo>
        <div className="flex flex-col gap-2">
          <button type="submit" className={`${primaryButton} w-full`}>
            Salvar
          </button>
          <button type="button" onClick={onClose} className="cursor-pointer text-center text-base font-bold text-[#00842f] hover:underline">
            Voltar
          </button>
        </div>
      </form>
    </ModalShell>
  );
}

// ─── Motivo da Inativação (visualização) ─────────────────────────────────────
export function MotivoInativacaoModal({
  funcional,
  motivo,
  observacao,
  onClose,
}: {
  funcional: string;
  motivo: string;
  observacao: string;
  onClose: () => void;
}) {
  return (
    <ModalShell onClose={onClose} width={420}>
      <div className="flex flex-col gap-6">
        <ModalHeader title="Motivo da Inativação" />
        <Campo label="Funcional / CPF">
          <div className={inputDisabled}>{funcional}</div>
        </Campo>
        <Campo label="Motivo">
          <div className={inputDisabled}>{motivo}</div>
        </Campo>
        <Campo label="Observação">
          <div className={`${inputDisabled} min-h-[80px] whitespace-pre-wrap`}>{observacao || "—"}</div>
        </Campo>
        <button type="button" onClick={onClose} className="cursor-pointer text-center text-base font-bold text-[#00842f] hover:underline">
          Voltar
        </button>
      </div>
    </ModalShell>
  );
}

// ─── Atenção (confirmação de inativação) ─────────────────────────────────────
export function AtencaoModal({
  onConfirmar,
  onCancelar,
}: {
  onConfirmar: () => void;
  onCancelar: () => void;
}) {
  return (
    <ModalShell onClose={onCancelar} width={391}>
      <div className="flex flex-col items-center gap-6 text-center">
        <svg className="size-10 text-[#00842f]" fill="none" stroke="currentColor" strokeWidth={1.7} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v4m0 4h.01M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0Z" />
        </svg>
        <h2 className="text-[22px] font-bold leading-[26px] text-black">Atenção</h2>
        <p className="w-[297px] text-sm leading-[17px] text-[#4b4b4b]">
          Todos os contratos associados a este funcionário voltarão ao estado de "Aguardando
          Vínculo". Essa ação é irreversível, deseja continuar?
        </p>
        <div className="flex w-full flex-col gap-2">
          <button type="button" onClick={onConfirmar} className={`${primaryButton} w-full`}>
            Sim
          </button>
          <button type="button" onClick={onCancelar} className="cursor-pointer text-center text-base font-bold text-[#00842f] hover:underline">
            Não
          </button>
        </div>
      </div>
    </ModalShell>
  );
}

// ─── Sucesso genérico ────────────────────────────────────────────────────────
export function SucessoModal({
  titulo,
  onOk,
}: {
  titulo: string;
  onOk: () => void;
}) {
  return (
    <ModalShell onClose={onOk} width={391}>
      <div className="flex flex-col items-center gap-6 text-center">
        <CheckCircleIcon className="size-10 text-[#00842f]" />
        <h2 className="text-[22px] font-bold leading-[26px] text-black">{titulo}</h2>
        <button type="button" onClick={onOk} className={`${primaryButton} w-full`}>
          Ok
        </button>
      </div>
    </ModalShell>
  );
}
