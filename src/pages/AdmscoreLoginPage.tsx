import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import loginY from "../assets/login-y.svg";
import logoScore1 from "../assets/logo-score-1.svg";
import logoScore2 from "../assets/logo-score-2.svg";
import { formatCpf, isCpfValid } from "../components/login/validation";
import { useCountdown } from "../components/login/useCountdown";
import { inputBase, inputBorder, primaryButton } from "../components/login/ui";
import { FadeSlideIn } from "../components/login/ModalShell";
import {
  BloqueioDefinitivoModal,
  BloqueioTemporarioModal,
} from "../components/login/BloqueioModals";
import CodigoVerificacaoModal from "../components/login/CodigoVerificacaoModal";
import RecuperarSenhaFlow from "../components/login/RecuperarSenhaFlow";
import { EyeIcon, EyeOffIcon } from "../components/login/icons";
import AdmscoreFooter from "../components/admscore/AdmscoreFooter";

// E-mail (mock) usado na verificação 2FA após o login por CPF.
const MOCK_EMAIL = "joao@gmail.com.br";

// Senha do login: mínimo de 8 caracteres.
const isSenhaValid = (senha: string) => senha.length >= 8;

export default function AdmscoreLoginPage() {
  const navigate = useNavigate();
  const [login, setLogin] = useState("");
  const [senha, setSenha] = useState("");
  const [showSenha, setShowSenha] = useState(false);

  // ─── Máquina de estados das tentativas ──────────────────────────────────────
  // failCount: 0..2 livre | 3 → bloqueio temporário (59s) | 5 → bloqueio definitivo
  const [failCount, setFailCount] = useState(0);
  const [showError, setShowError] = useState(false);
  const [tempLockOpen, setTempLockOpen] = useState(false);
  const [permLocked, setPermLocked] = useState(false);
  const [permLockOpen, setPermLockOpen] = useState(false);
  const [show2fa, setShow2fa] = useState(false);
  const [showRecuperar, setShowRecuperar] = useState(false);

  const { remaining: lockRemaining, restart: startLock } = useCountdown(0);
  const tempLocked = lockRemaining > 0;
  const entrarDisabled = tempLocked || permLocked;

  // Fecha o modal de bloqueio temporário automaticamente quando o cronômetro zera
  useEffect(() => {
    if (lockRemaining === 0 && tempLockOpen) setTempLockOpen(false);
  }, [lockRemaining, tempLockOpen]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (entrarDisabled) return;

    if (isCpfValid(login) && isSenhaValid(senha)) {
      setShowError(false);
      setShow2fa(true);
      return;
    }

    const next = failCount + 1;
    setFailCount(next);
    setShowError(true);
    if (next === 3) {
      startLock(59);
      setTempLockOpen(true);
    } else if (next >= 5) {
      setPermLocked(true);
      setPermLockOpen(true);
    }
  }

  const labelClass = (error: boolean) =>
    `flex h-6 items-center text-sm leading-[17px] ${error ? "text-[#cc0000]" : "text-black"}`;

  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden bg-[#00842f]">
      {/* Marca d'água "Y" */}
      <img
        src={loginY}
        alt=""
        className="pointer-events-none absolute -left-[12%] top-1/2 h-[130%] w-auto max-w-none -translate-y-1/2 select-none"
      />

      {/* Logo Y score */}
      <div className="absolute left-[4%] top-12 z-10 flex w-[220px] items-center gap-2">
        <img src={logoScore1} alt="" className="w-9" />
        <img src={logoScore2} alt="score" className="w-[112px]" />
      </div>

      {/* Card de login flutuante */}
      <div className="relative z-10 flex flex-1 items-center justify-end px-6 py-24 md:pr-[10%]">
        <div className="flex w-[360px] max-w-full flex-col gap-8 rounded-2xl bg-white p-8 shadow-xl">
          <div className="flex flex-col gap-1.5">
            <h1 className="text-[22px] font-bold leading-[26px] text-black">
              Acesso administrativo
            </h1>
            <p className="text-sm leading-[17px] text-[#4b4b4b]">
              Para entrar, basta inserir seus dados de login.
            </p>
          </div>

          <form className="flex w-full flex-col gap-6" onSubmit={handleSubmit} noValidate>
            <div className="flex w-full flex-col gap-2">
              <div className="flex flex-col gap-2">
                <label htmlFor="adm-login" className={labelClass(showError)}>
                  Login
                </label>
                <input
                  id="adm-login"
                  type="text"
                  inputMode="numeric"
                  value={login}
                  onChange={(e) => {
                    setLogin(formatCpf(e.target.value));
                    setShowError(false);
                  }}
                  placeholder="111.111.111-11"
                  className={`${inputBase} ${inputBorder(showError)} placeholder:text-[#8e8e8e]`}
                />
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="adm-senha" className={labelClass(showError)}>
                  Senha
                </label>
                <div className="relative w-full">
                  <input
                    id="adm-senha"
                    type={showSenha ? "text" : "password"}
                    value={senha}
                    onChange={(e) => {
                      setSenha(e.target.value);
                      setShowError(false);
                    }}
                    placeholder="Digite sua senha"
                    className={`${inputBase} ${inputBorder(showError)} pr-12 placeholder:text-[#8e8e8e]`}
                  />
                  <button
                    type="button"
                    aria-label={showSenha ? "Ocultar senha" : "Mostrar senha"}
                    onClick={() => setShowSenha((v) => !v)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer rounded p-0.5 text-[#4b4b4b] transition-colors duration-150 hover:text-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00842f]"
                  >
                    {showSenha ? <EyeOffIcon className="size-4" /> : <EyeIcon className="size-4" />}
                  </button>
                </div>
              </div>

              {showError && (
                <FadeSlideIn>
                  <p className="text-sm leading-[17px] text-[#cc0000]">
                    Dados inválidos. Verifique e tente novamente.
                  </p>
                </FadeSlideIn>
              )}
            </div>

            <div className="flex w-full flex-col gap-4">
              <button type="submit" disabled={entrarDisabled} className={`${primaryButton} w-full`}>
                Entrar
              </button>
              <button
                type="button"
                onClick={() => setShowRecuperar(true)}
                className="cursor-pointer rounded text-center text-base font-bold leading-4 text-[#00842f] transition-colors duration-150 hover:text-[#006b26] hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00842f] focus-visible:ring-offset-2"
              >
                Esqueci minha senha
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Rodapé sobre o verde */}
      <div className="relative z-10">
        <AdmscoreFooter />
      </div>

      {/* Bloqueio temporário (3ª falha) */}
      {tempLockOpen && (
        <BloqueioTemporarioModal remaining={lockRemaining} onOk={() => setTempLockOpen(false)} />
      )}

      {/* Bloqueio definitivo (5ª falha) */}
      {permLockOpen && (
        <BloqueioDefinitivoModal title="Acesso bloqueado." onOk={() => setPermLockOpen(false)} />
      )}

      {/* Verificação 2FA por código enviado ao e-mail */}
      {show2fa && (
        <CodigoVerificacaoModal
          email={MOCK_EMAIL}
          onVerified={() => navigate("/admscore")}
          onVoltar={() => setShow2fa(false)}
          onClose={() => setShow2fa(false)}
        />
      )}

      {/* Fluxo de recuperação de senha */}
      {showRecuperar && <RecuperarSenhaFlow onClose={() => setShowRecuperar(false)} />}
    </div>
  );
}
