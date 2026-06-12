import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Footer from "../components/Footer";
import loginY from "../assets/login-y.svg";
import logoScore1 from "../assets/logo-score-1.svg";
import logoScore2 from "../assets/logo-score-2.svg";
import { isLoginValid, isSenhaValid } from "../components/login/validation";
import { useCountdown } from "../components/login/useCountdown";
import { inputBase, inputBorder, primaryButton } from "../components/login/ui";
import { FadeSlideIn } from "../components/login/ModalShell";
import {
  BloqueioDefinitivoModal,
  BloqueioTemporarioModal,
} from "../components/login/BloqueioModals";
import RecuperarSenhaFlow from "../components/login/RecuperarSenhaFlow";

export default function LoginPage() {
  const navigate = useNavigate();
  const [login, setLogin] = useState("");
  const [senha, setSenha] = useState("");

  // ─── Máquina de estados das tentativas ──────────────────────────────────────
  // failCount: 0..2 livre | 3 → bloqueio temporário (59s) | 5 → bloqueio definitivo
  const [failCount, setFailCount] = useState(0);
  const [showError, setShowError] = useState(false);
  const [tempLockOpen, setTempLockOpen] = useState(false);
  const [permLocked, setPermLocked] = useState(false);
  const [permLockOpen, setPermLockOpen] = useState(false);
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

    if (isLoginValid(login) && isSenhaValid(senha)) {
      navigate("/campanhas");
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

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <div className="flex flex-1 items-stretch">
        {/* Painel institucional */}
        <div className="flex flex-1 items-center justify-center p-12">
          <div className="relative h-full min-h-[600px] w-full overflow-hidden rounded-xl bg-[#00842f]">
            <img
              src={loginY}
              alt=""
              className="pointer-events-none absolute -bottom-[31%] -left-[55%] -right-[72%] -top-[68%] h-[200%] w-[227%] max-w-none"
            />
            <div className="absolute left-[9.57%] top-[50px] flex w-[29.4%] items-center gap-[4%]">
              <img src={logoScore1} alt="" className="w-[24.6%]" />
              <img src={logoScore2} alt="score" className="w-[66%]" />
            </div>
          </div>
        </div>

        {/* Card de login */}
        <div className="flex flex-1 items-center justify-center p-12">
          <div className="flex w-[390px] flex-col items-center gap-16 rounded-3xl bg-white p-6">
            <div className="flex w-full flex-col gap-8">
              <div className="flex flex-col gap-1.5">
                <h1 className="text-[22px] font-bold leading-[26px] text-black">
                  Crie e acompanhe ações desenvolvidas para sua equipe
                </h1>
                <p className="text-base leading-6 text-[#4b4b4b]">
                  Para entrar, basta inserir seus dados de login
                </p>
              </div>
              <form className="flex w-full flex-col items-center gap-6" onSubmit={handleSubmit} noValidate>
                <div className="flex w-full flex-col gap-6">
                  <div className="flex w-full flex-col gap-2">
                    <div className="flex flex-col gap-2">
                      <label htmlFor="login" className="flex h-6 items-center text-sm leading-[17px] text-black">
                        Login
                      </label>
                      <input
                        id="login"
                        type="text"
                        inputMode="numeric"
                        value={login}
                        onChange={(e) => {
                          setLogin(e.target.value);
                          setShowError(false);
                        }}
                        placeholder="Digite sua funcional"
                        className={`${inputBase} ${inputBorder(showError)} placeholder:text-[#4b4b4b]`}
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <label htmlFor="senha" className="flex h-6 items-center text-sm leading-[17px] text-black">
                        Senha
                      </label>
                      <input
                        id="senha"
                        type="password"
                        value={senha}
                        onChange={(e) => {
                          setSenha(e.target.value);
                          setShowError(false);
                        }}
                        placeholder="Digite sua senha"
                        className={`${inputBase} ${inputBorder(showError)} placeholder:text-[#4b4b4b]`}
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
                  <button type="submit" disabled={entrarDisabled} className={`${primaryButton} w-full`}>
                    Entrar
                  </button>
                </div>
                <button
                  type="button"
                  onClick={() => setShowRecuperar(true)}
                  className="cursor-pointer rounded text-center text-base font-bold leading-4 text-[#00842f] transition-colors duration-150 hover:text-[#006b26] hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00842f] focus-visible:ring-offset-2"
                >
                  Esqueci minha senha
                </button>
              </form>
            </div>
            <div className="flex w-full flex-col items-center gap-4">
              <p className="text-center text-xs leading-[17px] text-[#4b4b4b]">
                Precisa de ajuda para criar ou redefinir sua senha?{" "}
                <a href="#" className="font-bold text-[#00842f]">
                  clique aqui.
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
      <Footer />

      {/* Bloqueio temporário (3ª falha): cronômetro ao vivo; Ok fecha, Entrar segue desabilitado */}
      {tempLockOpen && (
        <BloqueioTemporarioModal remaining={lockRemaining} onOk={() => setTempLockOpen(false)} />
      )}

      {/* Bloqueio definitivo (5ª falha): Entrar desabilitado até recarregar a página */}
      {permLockOpen && <BloqueioDefinitivoModal onOk={() => setPermLockOpen(false)} />}

      {/* Fluxo de recuperação de senha */}
      {showRecuperar && <RecuperarSenhaFlow onClose={() => setShowRecuperar(false)} />}
    </div>
  );
}
