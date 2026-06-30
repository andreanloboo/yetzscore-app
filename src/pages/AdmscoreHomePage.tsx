import { useNavigate } from "react-router-dom";
import logoScore1 from "../assets/logo-score-1.svg";
import logoScore2 from "../assets/logo-score-2.svg";
import { CheckCircleIcon } from "../components/login/icons";
import { secondaryButton } from "../components/login/ui";

// Placeholder pós-login do admscore. As telas internas ainda serão implementadas.
export default function AdmscoreHomePage() {
  const navigate = useNavigate();
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-white p-12 text-center">
      <div className="flex items-center gap-2">
        <img src={logoScore1} alt="" className="w-9 [filter:brightness(0)]" />
        <img src={logoScore2} alt="score" className="w-28 [filter:brightness(0)]" />
      </div>
      <CheckCircleIcon className="size-10 text-[#00842f]" />
      <div className="flex max-w-md flex-col gap-2">
        <h1 className="text-[22px] font-bold leading-[26px] text-black">
          Login do admscore concluído
        </h1>
        <p className="text-sm leading-[17px] text-[#4b4b4b]">
          Acesso administrativo autenticado com sucesso (CPF + verificação por código). As telas
          internas do admscore ainda serão implementadas.
        </p>
      </div>
      <button type="button" onClick={() => navigate("/admscore/login")} className={secondaryButton}>
        Voltar ao login
      </button>
    </div>
  );
}
