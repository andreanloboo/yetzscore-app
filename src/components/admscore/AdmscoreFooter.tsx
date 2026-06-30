import logoYetz from "../../assets/logo-yetz.svg";

// Rodapé do admscore: sobre o fundo verde, logo + textos em branco.
export default function AdmscoreFooter() {
  return (
    <footer className="flex w-full items-center justify-center gap-6 px-6 py-6">
      <img
        src={logoYetz}
        alt="Yetz"
        className="h-5 w-auto shrink-0 brightness-0 invert"
      />
      <div className="h-9 w-px bg-white/40" />
      <div className="text-xs leading-[17px] text-white/90">
        <p>YETZ LTDA | CNPJ: 28.325.166/0001-05</p>
        <p>2026 | Todos os direitos reservados</p>
      </div>
    </footer>
  );
}
