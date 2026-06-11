import logoYetz from "../assets/logo-yetz.svg";

export default function Footer() {
  return (
    <footer className="flex w-full flex-col items-center justify-center bg-white px-6 py-0.5">
      <div className="flex w-[672px] max-w-full items-center justify-center gap-12 rounded-xl py-3">
        <img src={logoYetz} alt="Yetz" className="h-6 w-auto shrink-0" />
        <div className="h-11 w-px bg-[#cacaca]" />
        <div className="text-xs leading-[17px] text-[#8e8e8e]">
          <p>YETZ LTDA | CNPJ: 28.325.166/0001-05</p>
          <p>2026 | Todos os direitos reservados</p>
        </div>
        <div className="h-11 w-px bg-[#cacaca]" />
        <div className="text-xs leading-[17px] text-[#8e8e8e]">
          <p>Para mais informações sobre como seus</p>
          <p>
            dados são tratados{" "}
            <a href="#" className="underline">
              clique aqui.
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
