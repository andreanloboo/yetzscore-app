import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Footer from "../components/Footer";
import loginY from "../assets/login-y.svg";
import logoScore1 from "../assets/logo-score-1.svg";
import logoScore2 from "../assets/logo-score-2.svg";

export default function LoginPage() {
  const navigate = useNavigate();
  const [login, setLogin] = useState("");
  const [senha, setSenha] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    navigate("/campanhas");
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
              <form className="flex w-full flex-col items-center gap-6" onSubmit={handleSubmit}>
                <div className="flex w-full flex-col gap-6">
                  <div className="flex w-full flex-col gap-2">
                    <div className="flex flex-col gap-2">
                      <label htmlFor="login" className="flex h-6 items-center text-sm leading-[17px] text-black">
                        Login
                      </label>
                      <input
                        id="login"
                        type="text"
                        value={login}
                        onChange={(e) => setLogin(e.target.value)}
                        placeholder="Digite sua funcional"
                        className="w-full rounded-md border border-[#cacaca] bg-white p-4 text-base leading-4 text-black outline-none placeholder:text-[#4b4b4b] focus:border-[#00842f]"
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
                        onChange={(e) => setSenha(e.target.value)}
                        placeholder="Digite sua senha"
                        className="w-full rounded-md border border-[#cacaca] bg-white p-4 text-base leading-4 text-black outline-none placeholder:text-[#4b4b4b] focus:border-[#00842f]"
                      />
                    </div>
                  </div>
                  <button
                    type="submit"
                    className="flex h-12 w-full items-center justify-center gap-2 rounded-md bg-[#00842f] px-8 py-3 text-center text-base font-bold text-white transition-colors hover:bg-[#006b26]"
                  >
                    Entrar
                  </button>
                </div>
                <button type="button" className="text-center text-base font-bold leading-4 text-[#00842f]">
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
              <div className="h-px w-[327px] bg-[#cacaca]" />
              <p className="text-center text-xs leading-[17px] text-[#4b4b4b]">
                Para mais informações sobre como seus
                <br />
                dados são tratados{" "}
                <a href="#" className="font-bold text-[#00842f]">
                  clique aqui.
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
