import { useCallback, useState } from "react";
import ModalShell, { FadeSlideIn } from "./ModalShell";
import { CheckCircleIcon, FileIcon, InfoIcon, LockIcon } from "./icons";
import { getPasswordChecks, hasInvalidPasswordChars } from "./validation";
import { inputDisabled, primaryButton, secondaryButton } from "./ui";
import { ChecklistItem, PasswordField } from "./RecuperarSenhaFlow";
import TokenVerificacaoModal from "./TokenVerificacaoModal";

const MOCK_EMAIL = "joao@yetz.com.br";

type Step = "info" | "criar" | "termos" | "codigo" | "sucesso";

// ─── Fluxo "Criação de nova senha" (ref Figma 8625:6313) ──────────────────────
// Iniciado quando o login é "00000000": senha ainda não criada → criar senha →
// código de verificação (números → sucesso; letra → inválido; expira → ajuda) →
// senha redefinida com sucesso.
export default function CriarNovaSenhaFlow({ onClose }: { onClose: () => void }) {
  const [step, setStep] = useState<Step>("info");
  const goCriar = useCallback(() => setStep("criar"), []);
  const goTermos = useCallback(() => setStep("termos"), []);
  const goCodigo = useCallback(() => setStep("codigo"), []);
  const goSucesso = useCallback(() => setStep("sucesso"), []);

  switch (step) {
    case "info":
      return <SenhaNaoCriadaModal onOk={goCriar} onClose={onClose} />;
    case "criar":
      return <CriarSenhaModal onCriar={goCodigo} onTermos={goTermos} onClose={onClose} />;
    case "termos":
      return <TermosModal onVoltar={goCriar} onClose={onClose} />;
    case "codigo":
      return <TokenVerificacaoModal onVerified={goSucesso} onVoltar={goCriar} onClose={onClose} />;
    case "sucesso":
      return <SenhaCriadaModal onClose={onClose} />;
  }
}

// ─── Passo 1: Senha ainda não criada ──────────────────────────────────────────
function SenhaNaoCriadaModal({ onOk, onClose }: { onOk: () => void; onClose: () => void }) {
  return (
    <ModalShell onClose={onClose}>
      <div className="flex flex-col items-center gap-6">
        <InfoIcon className="size-10 shrink-0 text-[#00842f]" />
        <div className="flex flex-col items-center gap-2 text-center">
          <h2 className="text-[22px] font-bold leading-[26px] text-black">Senha ainda não criada</h2>
          <p className="w-[297px] text-sm leading-[17px] text-[#4b4b4b]">
            Você será redirecionado para o fluxo de criação de senha.
          </p>
        </div>
        <button type="button" onClick={onOk} className={`${primaryButton} w-full`}>
          Ok
        </button>
      </div>
    </ModalShell>
  );
}

// ─── Passo 2: Criar senha ─────────────────────────────────────────────────────
function CheckboxRow({
  checked,
  onToggle,
  children,
}: {
  checked: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}) {
  return (
    <label className="flex w-full cursor-pointer items-start gap-2">
      <button
        type="button"
        role="checkbox"
        aria-checked={checked}
        onClick={onToggle}
        className={`relative mt-0.5 size-[15px] shrink-0 cursor-pointer rounded-[3px] ${
          checked ? "bg-[#00842f]" : "border-[1.8px] border-[#909191]"
        }`}
      >
        {checked && (
          <svg className="absolute inset-[2px]" fill="none" stroke="white" strokeWidth={3} viewBox="0 0 12 12">
            <polyline points="1,6 5,10 11,2" />
          </svg>
        )}
      </button>
      <span className="text-sm leading-[17px] text-black">{children}</span>
    </label>
  );
}

function CriarSenhaModal({
  onCriar,
  onTermos,
  onClose,
}: {
  onCriar: () => void;
  onTermos: () => void;
  onClose: () => void;
}) {
  const [novaSenha, setNovaSenha] = useState("");
  const [confirmaSenha, setConfirmaSenha] = useState("");
  const [showNova, setShowNova] = useState(false);
  const [showConfirma, setShowConfirma] = useState(false);
  const [aceitaTermos, setAceitaTermos] = useState(false);
  const [aceitaComunicacoes, setAceitaComunicacoes] = useState(false);

  const checks = getPasswordChecks(novaSenha);
  const allChecksOk = Object.values(checks).every(Boolean);
  const invalidChars = hasInvalidPasswordChars(novaSenha);
  const mismatch = confirmaSenha.length > 0 && novaSenha !== confirmaSenha;
  const canSubmit =
    allChecksOk && !invalidChars && confirmaSenha.length > 0 && !mismatch && aceitaTermos;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (canSubmit) onCriar();
  }

  return (
    <ModalShell onClose={onClose}>
      <form className="flex flex-col items-center gap-6" onSubmit={handleSubmit} noValidate>
        <LockIcon className="size-10 shrink-0 text-[#00842f]" />
        <div className="flex flex-col items-center gap-2 text-center">
          <h2 className="text-[22px] font-bold leading-[26px] text-black">Criar senha</h2>
          <p className="w-[297px] text-sm leading-[17px] text-[#4b4b4b]">
            Digite nos campos abaixo a sua nova senha.
          </p>
        </div>

        {/* E-mail preenchido e desabilitado */}
        <div className="flex w-full flex-col gap-2">
          <span className="flex h-6 items-center text-sm leading-[17px] text-[#8e8e8e]">E-mail</span>
          <div className={`${inputDisabled} truncate`}>{MOCK_EMAIL}</div>
        </div>

        <PasswordField
          id="criar-nova-senha"
          label="Digite sua nova senha"
          value={novaSenha}
          onChange={setNovaSenha}
          show={showNova}
          onToggleShow={() => setShowNova((s) => !s)}
          error={invalidChars}
        />

        <div className="flex w-full flex-col gap-2">
          <PasswordField
            id="criar-confirma-senha"
            label="Confirme sua nova senha"
            value={confirmaSenha}
            onChange={setConfirmaSenha}
            show={showConfirma}
            onToggleShow={() => setShowConfirma((s) => !s)}
            error={mismatch}
          />
          {(mismatch || invalidChars) && (
            <FadeSlideIn className="flex flex-col gap-1">
              {mismatch && (
                <p className="text-sm leading-[17px] text-[#cc0000]">As senhas não conferem</p>
              )}
              {invalidChars && (
                <p className="text-sm leading-[17px] text-[#cc0000]">
                  Remova caracteres inválidos da senha
                </p>
              )}
            </FadeSlideIn>
          )}
        </div>

        {/* Aceites */}
        <div className="flex w-full flex-col gap-3">
          <CheckboxRow checked={aceitaTermos} onToggle={() => setAceitaTermos((v) => !v)}>
            Li, compreendi e concordo com as disposições contidas nos{" "}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onTermos();
              }}
              className="cursor-pointer font-bold text-[#00842f] underline"
            >
              Termos e condições
            </button>{" "}
            deste site.
          </CheckboxRow>
          <CheckboxRow
            checked={aceitaComunicacoes}
            onToggle={() => setAceitaComunicacoes((v) => !v)}
          >
            Aceito receber comunicações.
          </CheckboxRow>
        </div>

        {/* Checklist ao vivo */}
        <div className="flex w-full flex-col gap-3">
          <p className="text-sm text-black">
            <span className="font-bold leading-[21px]">Atenção! </span>
            <span className="leading-[17px]">A senha deve ter obrigatoriamente:</span>
          </p>
          <div className="flex flex-col gap-2">
            <ChecklistItem ok={checks.minLength} label="No mínimo 8 caracteres" />
            <ChecklistItem ok={checks.hasNumber} label="No mínimo 1 número" />
            <ChecklistItem ok={checks.hasUpper} label="No mínimo 1 letra maiúscula" />
            <ChecklistItem ok={checks.hasLower} label="No mínimo 1 letra minúscula" />
            <ChecklistItem
              ok={checks.noTripleRepeat}
              label="Não repetir 3 caracteres iguais em sequência"
            />
            <ChecklistItem ok={checks.hasSpecial} label="No mínimo 1 caractere especial (!@#$%^*&)" />
          </div>
        </div>

        <div className="flex w-full flex-col gap-2">
          <button type="submit" disabled={!canSubmit} className={`${primaryButton} w-full`}>
            Criar nova senha
          </button>
          <button type="button" onClick={onClose} className={`${secondaryButton} w-full`}>
            Cancelar
          </button>
        </div>
      </form>
    </ModalShell>
  );
}

// ─── Termos e condições ───────────────────────────────────────────────────────
function TermosModal({ onVoltar, onClose }: { onVoltar: () => void; onClose: () => void }) {
  return (
    <ModalShell onClose={onClose}>
      <div className="flex w-full flex-col items-center gap-6">
        <FileIcon className="size-10 shrink-0 text-[#00842f]" />
        <h2 className="text-[22px] font-bold leading-[26px] text-black">Termos e condições</h2>
        <div className="flex max-h-[320px] w-full flex-col gap-4 overflow-y-auto pr-2 text-sm leading-[21px] text-[#4b4b4b]">
          <div className="flex flex-col gap-1">
            <p className="font-bold text-black">1. Aceitação dos Termos</p>
            <p>
              Ao acessar e utilizar a plataforma YetzScore, você declara que leu, compreendeu e
              concorda com os presentes Termos e Condições de uso.
            </p>
          </div>
          <div className="flex flex-col gap-1">
            <p className="font-bold text-black">2. Licença de Uso</p>
            <p>
              É concedida uma licença limitada, não exclusiva e intransferível para uso da
              plataforma de acordo com as finalidades previstas neste documento.
            </p>
          </div>
          <div className="flex flex-col gap-1">
            <p className="font-bold text-black">3. Cadastro e Segurança</p>
            <p>
              Você é responsável por manter a confidencialidade das suas credenciais de acesso e por
              todas as atividades realizadas em sua conta.
            </p>
          </div>
        </div>
        <button type="button" onClick={onVoltar} className={`${primaryButton} w-full`}>
          Voltar
        </button>
      </div>
    </ModalShell>
  );
}

// ─── Senha criada com sucesso ─────────────────────────────────────────────────
function SenhaCriadaModal({ onClose }: { onClose: () => void }) {
  return (
    <ModalShell onClose={onClose}>
      <div className="flex flex-col items-center gap-6">
        <CheckCircleIcon className="size-8 shrink-0 text-[#00842f]" />
        <div className="flex flex-col items-center gap-2 text-center">
          <h2 className="text-[22px] font-bold leading-[26px] text-black">
            Senha redefinida com sucesso!
          </h2>
          <p className="w-[297px] text-sm leading-[17px] text-[#4b4b4b]">
            Uma nova senha foi redefinida, clique no botão abaixo para efetuar o login.
          </p>
        </div>
        <button type="button" onClick={onClose} className={`${primaryButton} w-full`}>
          Efetuar login
        </button>
      </div>
    </ModalShell>
  );
}
