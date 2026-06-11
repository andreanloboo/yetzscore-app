import { useCallback, useEffect, useRef, useState } from "react";
import ModalShell, { FadeSlideIn } from "./ModalShell";
import {
  CheckCircleIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  ClockIcon,
  EyeIcon,
  EyeOffIcon,
  HelpCircleIcon,
  LockIcon,
  MailIcon,
  XCircleIcon,
} from "./icons";
import {
  formatCountdown,
  getPasswordChecks,
  hasInvalidPasswordChars,
  isEmailValid,
  isFuncionalValid,
  maskEmail,
} from "./validation";
import { useCountdown } from "./useCountdown";
import { inputBase, inputBorder, inputDisabled, primaryButton, secondaryButton } from "./ui";
import logoYetz from "../../assets/logo-yetz.svg";

const MOCK_CODIGO = "123456";

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

// ─── Passo 2: Código de verificação ───────────────────────────────────────────
interface CodigoVerificacaoModalProps {
  email: string;
  onVerified: () => void;
  onVoltar: () => void;
  onClose: () => void;
}

function CodigoVerificacaoModal({
  email,
  onVerified,
  onVoltar,
  onClose,
}: CodigoVerificacaoModalProps) {
  const [digits, setDigits] = useState<string[]>(Array(6).fill(""));
  const [codeError, setCodeError] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);
  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);
  const { remaining, restart } = useCountdown(59);
  const expired = remaining === 0;
  const masked = maskEmail(email);

  useEffect(() => {
    inputsRef.current[0]?.focus();
  }, []);

  // Verifica automaticamente quando os 6 dígitos estiverem preenchidos
  useEffect(() => {
    if (digits.every((d) => d !== "")) {
      if (digits.join("") === MOCK_CODIGO) onVerified();
      else setCodeError(true);
    }
  }, [digits, onVerified]);

  function setDigit(index: number, value: string) {
    setCodeError(false);
    setDigits((prev) => {
      const next = [...prev];
      next[index] = value;
      return next;
    });
  }

  function handleChange(index: number, raw: string) {
    const v = raw.replace(/\D/g, "").slice(-1);
    setDigit(index, v);
    if (v && index < 5) inputsRef.current[index + 1]?.focus();
  }

  function handleKeyDown(index: number, e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Backspace" && !digits[index] && index > 0) {
      e.preventDefault();
      setDigit(index - 1, "");
      inputsRef.current[index - 1]?.focus();
    }
  }

  function handlePaste(e: React.ClipboardEvent<HTMLInputElement>) {
    const text = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (!text) return;
    e.preventDefault();
    setCodeError(false);
    setDigits(Array.from({ length: 6 }, (_, i) => text[i] ?? ""));
    inputsRef.current[Math.min(text.length, 5)]?.focus();
  }

  function handleReenviar() {
    setDigits(Array(6).fill(""));
    setCodeError(false);
    setHelpOpen(false);
    restart(59);
    requestAnimationFrame(() => inputsRef.current[0]?.focus());
  }

  return (
    <ModalShell onClose={onClose} width={390}>
      <div className="flex w-full flex-col items-center gap-12">
        {/* Header: logo Yetz + divisor (gap 48px até o conteúdo, conforme ref 7929:36494) */}
        <div className="flex w-full flex-col items-center gap-[19px]">
          <img src={logoYetz} alt="Yetz" className="h-8" />
          <div className="h-px w-full max-w-[309px] bg-[#cacaca]" />
        </div>

        <div className="flex w-full flex-col items-center gap-6">
        <div className="flex flex-col items-center gap-2 text-center">
          <h2 className="text-[22px] font-bold leading-[31px] text-black">
            Código de verificação
          </h2>
          <p className="text-sm leading-[21px] text-[#4b4b4b]">
            <span className="font-bold">Preencha com o código de verificação</span>
            <br />
            enviado para o seu e-mail.
          </p>
        </div>

        {/* E-mail mascarado (desabilitado) */}
        <div className={`${inputDisabled} text-center`}>{masked}</div>

        {/* 6 dígitos */}
        <div className="flex flex-col items-center gap-2">
          <div className="flex items-center gap-1">
            {digits.map((d, i) => (
              <input
                key={i}
                ref={(el) => {
                  inputsRef.current[i] = el;
                }}
                type="text"
                inputMode="numeric"
                autoComplete="one-time-code"
                maxLength={1}
                value={d}
                disabled={expired}
                aria-label={`Dígito ${i + 1} do código`}
                onChange={(e) => handleChange(i, e.target.value)}
                onKeyDown={(e) => handleKeyDown(i, e)}
                onPaste={handlePaste}
                className={`size-[51px] rounded border bg-white text-center text-[22px] font-bold text-black outline-none transition-colors duration-200 disabled:cursor-not-allowed disabled:bg-[#f5f5f5] ${
                  codeError
                    ? "border-[#cc0000] focus:border-[#cc0000]"
                    : "border-[#cacaca] focus:border-[#00842f]"
                }`}
              />
            ))}
          </div>
          {codeError && (
            <FadeSlideIn>
              <p className="text-center text-sm leading-normal text-[#cc0000]">
                Código inválido
              </p>
            </FadeSlideIn>
          )}
        </div>

        {/* Cronômetro */}
        <div className="flex items-center justify-center gap-[7px]">
          <ClockIcon className={`size-6 ${expired ? "text-[#cc0000]" : "text-[#4b4b4b]"}`} />
          <p
            className={`text-center text-base leading-6 tabular-nums ${
              expired ? "text-[#cc0000]" : "text-[#4b4b4b]"
            }`}
          >
            {formatCountdown(remaining)}
          </p>
        </div>

        {/* Código expirado: Voltar + ajuda */}
        {expired && (
          <FadeSlideIn className="flex w-full flex-col gap-2">
            <button type="button" onClick={onVoltar} className={`${primaryButton} w-full`}>
              Voltar
            </button>
            <button
              type="button"
              aria-expanded={helpOpen}
              onClick={() => setHelpOpen((o) => !o)}
              className="flex w-full cursor-pointer items-center justify-between rounded-md px-1 py-2 transition-colors duration-150 hover:bg-[#e6f3ea]/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00842f]"
            >
              <span className="flex items-center gap-2">
                <HelpCircleIcon className="size-6 shrink-0 text-[#4b4b4b]" />
                <span className="text-left text-sm leading-[21px] text-black">
                  <span className="font-bold">Clique aqui</span>
                  <br />
                  Se não receber o código
                </span>
              </span>
              <ChevronDownIcon
                className={`size-6 shrink-0 text-[#4b4b4b] transition-transform duration-200 ${
                  helpOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {helpOpen && (
              <FadeSlideIn className="flex w-full flex-col gap-6 pt-2">
                <div className="flex w-full items-center justify-between border-b border-[#cacaca] pb-6">
                  <div className="flex items-center gap-3">
                    <MailIcon className="size-6 shrink-0 text-[#4b4b4b]" />
                    <p className="text-sm leading-[21px] text-black">
                      Não recebeu o email?
                      <br />
                      <span className="font-bold">Veja o que fazer.</span>
                    </p>
                  </div>
                  <ChevronRightIcon className="size-6 shrink-0 text-[#4b4b4b]" />
                </div>
                <div className="flex w-full items-end gap-4">
                  <div className="flex min-w-0 flex-1 items-center gap-3">
                    <MailIcon className="mb-3 size-6 shrink-0 text-[#4b4b4b]" />
                    <div className="flex min-w-0 flex-1 flex-col gap-2">
                      <p className="text-sm leading-normal text-black">Receber por E-mail</p>
                      <div className={`${inputDisabled} truncate`}>{masked}</div>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={handleReenviar}
                    className={`${primaryButton} w-[100px] shrink-0 px-0`}
                  >
                    Reenviar
                  </button>
                </div>
              </FadeSlideIn>
            )}
          </FadeSlideIn>
        )}
        </div>
      </div>
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
