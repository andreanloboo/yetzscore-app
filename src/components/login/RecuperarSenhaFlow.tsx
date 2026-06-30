import { useCallback, useState } from "react";
import ModalShell, { FadeSlideIn } from "./ModalShell";
import { CheckCircleIcon, EyeIcon, EyeOffIcon, LockIcon, XCircleIcon } from "./icons";
import {
  getPasswordChecks,
  hasInvalidPasswordChars,
  isEmailValid,
  isFuncionalValid,
} from "./validation";
import { inputBase, inputBorder, inputDisabled, primaryButton, secondaryButton } from "./ui";
import CodigoVerificacaoModal from "./CodigoVerificacaoModal";

type Step = "esqueci" | "codigo" | "redefinir" | "sucesso";

// ─── Fluxo completo de recuperação de senha ──────────────────────────────────
export default function RecuperarSenhaFlow({ onClose }: { onClose: () => void }) {
  const [step, setStep] = useState<Step>("esqueci");
  const [email, setEmail] = useState("");
  const [funcional, setFuncional] = useState("");

  const goCodigo = useCallback(() => setStep("codigo"), []);
  const goEsqueci = useCallback(() => setStep("esqueci"), []);
  const goRedefinir = useCallback(() => setStep("redefinir"), []);
  const goSucesso = useCallback(() => setStep("sucesso"), []);

  switch (step) {
    case "esqueci":
      return (
        <EsqueciSenhaModal
          email={email}
          funcional={funcional}
          onEmailChange={setEmail}
          onFuncionalChange={setFuncional}
          onContinuar={goCodigo}
          onClose={onClose}
        />
      );
    case "codigo":
      return (
        <CodigoVerificacaoModal
          email={email}
          onVerified={goRedefinir}
          onVoltar={goEsqueci}
          onClose={onClose}
        />
      );
    case "redefinir":
      return (
        <RedefinirSenhaModal
          email={email}
          funcional={funcional}
          onCriar={goSucesso}
          onClose={onClose}
        />
      );
    case "sucesso":
      return <SenhaRedefinidaModal onClose={onClose} />;
  }
}

// ─── Passo 1: Esqueci minha senha ─────────────────────────────────────────────
interface EsqueciSenhaModalProps {
  email: string;
  funcional: string;
  onEmailChange: (v: string) => void;
  onFuncionalChange: (v: string) => void;
  onContinuar: () => void;
  onClose: () => void;
}

function EsqueciSenhaModal({
  email,
  funcional,
  onEmailChange,
  onFuncionalChange,
  onContinuar,
  onClose,
}: EsqueciSenhaModalProps) {
  const [showError, setShowError] = useState(false);
  const emailOk = isEmailValid(email);
  const funcionalOk = isFuncionalValid(funcional);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (emailOk && funcionalOk) {
      onContinuar();
      return;
    }
    setShowError(true);
  }

  return (
    <ModalShell onClose={onClose}>
      <form className="flex flex-col items-center gap-6" onSubmit={handleSubmit} noValidate>
        <LockIcon className="size-10 shrink-0 text-[#00842f]" />
        <div className="flex flex-col items-center gap-2 text-center">
          <h2 className="text-[22px] font-bold leading-[26px] text-black">Esqueci minha senha</h2>
          <p className="w-[297px] text-sm leading-[17px] text-[#4b4b4b]">
            Digite o e-mail cadastrado para receber as instruções de recuperação de senha.
          </p>
        </div>
        <div className="flex w-full flex-col gap-2">
          <div className="flex flex-col gap-2">
            <label
              htmlFor="rec-email"
              className="flex h-6 items-center text-sm leading-[17px] text-black"
            >
              E-mail
            </label>
            <input
              id="rec-email"
              type="email"
              value={email}
              onChange={(e) => {
                onEmailChange(e.target.value);
                setShowError(false);
              }}
              placeholder="Insira seu e-mail"
              className={`${inputBase} ${inputBorder(showError && !emailOk)}`}
            />
          </div>
          <div className="flex flex-col gap-2">
            <label
              htmlFor="rec-funcional"
              className="flex h-6 items-center text-sm leading-[17px] text-black"
            >
              Funcional
            </label>
            <input
              id="rec-funcional"
              type="text"
              inputMode="numeric"
              value={funcional}
              onChange={(e) => {
                onFuncionalChange(e.target.value);
                setShowError(false);
              }}
              placeholder="Insira sua funcional"
              className={`${inputBase} ${inputBorder(showError && !funcionalOk)}`}
            />
          </div>
          {showError && (
            <FadeSlideIn>
              <p className="text-sm leading-[17px] text-[#cc0000]">
                Dados inválidos. Verifique e tente novamente.
              </p>
            </FadeSlideIn>
          )}
        </div>
        <div className="flex w-full flex-col gap-2">
          <button type="submit" className={`${primaryButton} w-full`}>
            Continuar
          </button>
          <button type="button" onClick={onClose} className={`${secondaryButton} w-full`}>
            Cancelar
          </button>
        </div>
      </form>
    </ModalShell>
  );
}

// ─── Passo 3: Redefinir senha ─────────────────────────────────────────────────
interface RedefinirSenhaModalProps {
  email: string;
  funcional: string;
  onCriar: () => void;
  onClose: () => void;
}

function RedefinirSenhaModal({ email, funcional, onCriar, onClose }: RedefinirSenhaModalProps) {
  const [novaSenha, setNovaSenha] = useState("");
  const [confirmaSenha, setConfirmaSenha] = useState("");
  const [showNova, setShowNova] = useState(false);
  const [showConfirma, setShowConfirma] = useState(false);

  const checks = getPasswordChecks(novaSenha);
  const allChecksOk = Object.values(checks).every(Boolean);
  const invalidChars = hasInvalidPasswordChars(novaSenha);
  const mismatch = confirmaSenha.length > 0 && novaSenha !== confirmaSenha;
  const canSubmit = allChecksOk && !invalidChars && confirmaSenha.length > 0 && !mismatch;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (canSubmit) onCriar();
  }

  return (
    <ModalShell onClose={onClose}>
      <form className="flex flex-col items-center gap-6" onSubmit={handleSubmit} noValidate>
        <LockIcon className="size-10 shrink-0 text-[#00842f]" />
        <div className="flex flex-col items-center gap-2 text-center">
          <h2 className="text-[22px] font-bold leading-[26px] text-black">Redefinir senha</h2>
          <p className="w-[297px] text-sm leading-[17px] text-[#4b4b4b]">
            Digite nos campos abaixo a sua nova senha.
          </p>
        </div>

        {/* E-mail e Funcional preenchidos e desabilitados */}
        <div className="flex w-full flex-col gap-2">
          <span className="flex h-6 items-center text-sm leading-[17px] text-[#8e8e8e]">
            E-mail
          </span>
          <div className={`${inputDisabled} truncate`}>{email}</div>
        </div>
        <div className="flex w-full flex-col gap-2">
          <span className="flex h-6 items-center text-sm leading-[17px] text-[#8e8e8e]">
            Funcional
          </span>
          <div className={`${inputDisabled} truncate`}>{funcional}</div>
        </div>

        {/* Nova senha */}
        <PasswordField
          id="nova-senha"
          label="Digite sua nova senha"
          value={novaSenha}
          onChange={setNovaSenha}
          show={showNova}
          onToggleShow={() => setShowNova((s) => !s)}
          error={invalidChars}
        />

        {/* Confirmar nova senha */}
        <div className="flex w-full flex-col gap-2">
          <PasswordField
            id="confirma-senha"
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
            <ChecklistItem
              ok={checks.hasSpecial}
              label="No mínimo 1 caractere especial (!@#$%^*&)"
            />
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

interface PasswordFieldProps {
  id: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  show: boolean;
  onToggleShow: () => void;
  error: boolean;
}

function PasswordField({ id, label, value, onChange, show, onToggleShow, error }: PasswordFieldProps) {
  return (
    <div className="flex w-full flex-col gap-2">
      <label htmlFor={id} className="flex h-6 items-center text-sm leading-[17px] text-black">
        {label}
      </label>
      <div className="relative w-full">
        <input
          id={id}
          type={show ? "text" : "password"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Nova senha"
          className={`${inputBase} ${inputBorder(error)} pr-12`}
        />
        <button
          type="button"
          aria-label={show ? "Ocultar senha" : "Mostrar senha"}
          onClick={onToggleShow}
          className="absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer rounded p-0.5 text-[#4b4b4b] transition-colors duration-150 hover:text-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00842f]"
        >
          {show ? <EyeOffIcon className="size-4" /> : <EyeIcon className="size-4" />}
        </button>
      </div>
    </div>
  );
}

function ChecklistItem({ ok, label }: { ok: boolean; label: string }) {
  return (
    <div className="flex items-center gap-1">
      {ok ? (
        <CheckCircleIcon className="size-[13px] shrink-0 text-[#00842f]" />
      ) : (
        <XCircleIcon className="size-[13px] shrink-0 text-[#cc0000]" />
      )}
      <p
        className={`text-xs leading-[17px] transition-colors duration-200 ${
          ok ? "text-[#00842f]" : "text-black"
        }`}
      >
        {label}
      </p>
    </div>
  );
}

// ─── Passo 4: Senha redefinida com sucesso ───────────────────────────────────
function SenhaRedefinidaModal({ onClose }: { onClose: () => void }) {
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
