import { useEffect, useRef, useState } from "react";
import ModalShell, { FadeSlideIn } from "./ModalShell";
import {
  ChevronDownIcon,
  ChevronRightIcon,
  ClockIcon,
  HelpCircleIcon,
  MailIcon,
} from "./icons";
import { formatCountdown, maskEmail } from "./validation";
import { useCountdown } from "./useCountdown";
import { inputDisabled, primaryButton } from "./ui";
import logoYetz from "../../assets/logo-yetz.svg";

const DEFAULT_CODIGO = "123456";

interface CodigoVerificacaoModalProps {
  email: string;
  onVerified: () => void;
  onVoltar: () => void;
  onClose: () => void;
  /** Código esperado (mock). Padrão: "123456". */
  expectedCode?: string;
  /** Quando true, qualquer código numérico completo (6 dígitos) é aceito. */
  acceptAny?: boolean;
}

// ─── Verificação por código (6 dígitos) enviado ao e-mail ─────────────────────
// Compartilhado entre o fluxo de recuperação de senha e o 2FA do login.
export default function CodigoVerificacaoModal({
  email,
  onVerified,
  onVoltar,
  onClose,
  expectedCode = DEFAULT_CODIGO,
  acceptAny = false,
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
      if (acceptAny || digits.join("") === expectedCode) onVerified();
      else setCodeError(true);
    }
  }, [digits, onVerified, expectedCode, acceptAny]);

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
