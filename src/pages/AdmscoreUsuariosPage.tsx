import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import AdmscoreSidebar from "../components/admscore/AdmscoreSidebar";
import Footer from "../components/Footer";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  EyeIcon,
  PencilIcon,
  RefreshIcon,
  SearchIcon,
  UsuariosIcon,
} from "../components/admscore/icons";
import {
  AtencaoModal,
  CadastrarUsuarioModal,
  EditarUsuarioModal,
  MotivoInativacaoModal,
  SucessoModal,
} from "../components/admscore/UsuarioModals";

type Status = "Ativo" | "Inativo" | "Bloqueio";
type Tipo = "Gerente de Negócios" | "Gerente de Contas";

interface Usuario {
  id: number;
  funcional: string;
  nome: string;
  atualizacao: string;
  responsavel: string;
  status: Status;
  tipo: Tipo;
  email: string;
}

const DADOS: Usuario[] = [
  { id: 1, funcional: "006164842", nome: "Alexandre de Araujo", atualizacao: "09/09/2025, 09:30:10", responsavel: "Izabela", status: "Ativo", tipo: "Gerente de Negócios", email: "and*****@email.com" },
  { id: 2, funcional: "987295989", nome: "Bruna Carvalho", atualizacao: "09/09/2025, 09:30:10", responsavel: "Izabela", status: "Inativo", tipo: "Gerente de Contas", email: "bru*****@email.com" },
  { id: 3, funcional: "006164843", nome: "Carlos Mendes", atualizacao: "09/09/2025, 09:30:10", responsavel: "Izabela", status: "Ativo", tipo: "Gerente de Negócios", email: "car*****@email.com" },
  { id: 4, funcional: "987295990", nome: "Daniela Souza", atualizacao: "09/09/2025, 09:30:10", responsavel: "Izabela", status: "Inativo", tipo: "Gerente de Contas", email: "dan*****@email.com" },
  { id: 5, funcional: "006164844", nome: "Eduardo Lima", atualizacao: "09/09/2025, 09:30:10", responsavel: "Izabela", status: "Ativo", tipo: "Gerente de Negócios", email: "edu*****@email.com" },
  { id: 6, funcional: "987295991", nome: "Fernanda Rocha", atualizacao: "09/09/2025, 09:30:10", responsavel: "Izabela", status: "Inativo", tipo: "Gerente de Contas", email: "fer*****@email.com" },
  { id: 7, funcional: "006164845", nome: "Gabriel Nunes", atualizacao: "09/09/2025, 09:30:10", responsavel: "Izabela", status: "Bloqueio", tipo: "Gerente de Negócios", email: "gab*****@email.com" },
  { id: 8, funcional: "987295992", nome: "Helena Dias", atualizacao: "09/09/2025, 09:30:10", responsavel: "Izabela", status: "Inativo", tipo: "Gerente de Contas", email: "hel*****@email.com" },
];

const STATUS_STYLE: Record<Status, string> = {
  Ativo: "bg-[#e6f3ea] text-[#00842f]",
  Inativo: "bg-[#eeeeee] text-[#8e8e8e]",
  Bloqueio: "bg-[#fbe9df] text-[#c2571b]",
};

function StatusBadge({ status }: { status: Status }) {
  return (
    <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-bold ${STATUS_STYLE[status]}`}>
      {status}
    </span>
  );
}

function Toggle({ on, onToggle }: { on: boolean; onToggle: () => void }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      onClick={onToggle}
      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00842f] focus-visible:ring-offset-2 ${
        on ? "bg-[#00842f]" : "bg-[#cacaca]"
      }`}
    >
      <span
        className={`inline-block size-5 transform rounded-full bg-white shadow transition-transform duration-200 ${
          on ? "translate-x-[22px]" : "translate-x-[2px]"
        }`}
      />
    </button>
  );
}

type Modal =
  | { kind: "none" }
  | { kind: "cadastrar" }
  | { kind: "editar"; user: Usuario }
  | { kind: "motivo"; user: Usuario }
  | { kind: "confirmInativar"; user: Usuario }
  | { kind: "sucesso"; titulo: string };

export default function AdmscoreUsuariosPage() {
  const navigate = useNavigate();
  const [busca, setBusca] = useState("");
  const [usuarios, setUsuarios] = useState<Usuario[]>(DADOS);
  const [modal, setModal] = useState<Modal>({ kind: "none" });

  const filtrados = useMemo(() => {
    const q = busca.trim().toLowerCase();
    if (!q) return usuarios;
    return usuarios.filter(
      (u) => u.nome.toLowerCase().includes(q) || u.funcional.includes(q),
    );
  }, [busca, usuarios]);

  function setStatus(id: number, status: Status) {
    setUsuarios((prev) => prev.map((u) => (u.id === id ? { ...u, status } : u)));
  }

  // Ativo → pede confirmação para inativar; caso contrário, ativa direto.
  function onToggle(user: Usuario) {
    if (user.status === "Ativo") {
      setModal({ kind: "confirmInativar", user });
    } else {
      setStatus(user.id, "Ativo");
    }
  }

  const tipoDe = (u: Usuario): "Gerente de Negócios" | "Gerente de Contas" => u.tipo;

  const thClass = "px-4 py-3 text-left text-xs font-bold text-[#4b4b4b] whitespace-nowrap";
  const tdClass = "px-4 py-4 text-sm text-black whitespace-nowrap";

  return (
    <div className="flex min-h-screen bg-white">
      <AdmscoreSidebar />

      <div className="flex min-w-0 flex-1 flex-col">
        <main className="flex flex-1 flex-col gap-6 p-8">
          {/* Cabeçalho */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <UsuariosIcon className="size-6 text-[#00842f]" />
              <h1 className="text-xl font-bold text-[#00842f]">Gerenciamento de usuários</h1>
            </div>
            <button
              type="button"
              onClick={() => navigate("/admscore/login")}
              className="flex items-center gap-1 text-sm text-[#4b4b4b] transition-colors hover:text-black"
            >
              <ChevronLeftIcon className="size-4" />
              Voltar
            </button>
          </div>

          {/* Barra de ferramentas */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="relative w-full max-w-[320px]">
              <SearchIcon className="absolute left-3 top-1/2 size-5 -translate-y-1/2 text-[#8e8e8e]" />
              <input
                type="text"
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
                placeholder="Buscar por Nome ou funcional"
                className="h-11 w-full rounded-md border border-[#cacaca] bg-white pl-10 pr-4 text-sm text-black outline-none transition-colors placeholder:text-[#8e8e8e] focus:border-[#00842f]"
              />
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                title="Atualizar"
                aria-label="Atualizar"
                onClick={() => setUsuarios(DADOS)}
                className="flex size-11 items-center justify-center rounded-md border border-[#cacaca] bg-[#f5f5f5] text-[#4b4b4b] transition-colors hover:bg-[#eeeeee]"
              >
                <RefreshIcon className="size-5" />
              </button>
              <button
                type="button"
                onClick={() => setModal({ kind: "cadastrar" })}
                className="flex h-11 items-center justify-center rounded-md bg-[#00842f] px-6 text-sm font-bold text-white transition-colors hover:bg-[#006b26]"
              >
                Cadastrar
              </button>
            </div>
          </div>

          {/* Tabela */}
          <div className="overflow-x-auto rounded-lg border border-[#e1e1e1]">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-[#e1e1e1]">
                  <th className={thClass}>Funcional</th>
                  <th className={thClass}>Nome Completo</th>
                  <th className={thClass}>Data / Hora da última atualização</th>
                  <th className={thClass}>Responsável</th>
                  <th className={thClass}>Status</th>
                  <th className={thClass}>Tipo de Usuário</th>
                  <th className={thClass}>E-mail</th>
                  <th className={`${thClass} text-center`}>Editar</th>
                  <th className={`${thClass} text-center`}>Motivo da Inativação</th>
                  <th className={`${thClass} text-center`}>Inativar/Ativar</th>
                </tr>
              </thead>
              <tbody>
                {filtrados.map((u) => {
                  const ativo = u.status === "Ativo";
                  return (
                    <tr key={u.id} className="border-b border-[#f0f0f0] last:border-0 hover:bg-[#fafafa]">
                      <td className={tdClass}>{u.funcional}</td>
                      <td className={tdClass}>{u.nome}</td>
                      <td className={`${tdClass} text-[#4b4b4b]`}>{u.atualizacao}</td>
                      <td className={tdClass}>{u.responsavel}</td>
                      <td className={tdClass}><StatusBadge status={u.status} /></td>
                      <td className={tdClass}>{u.tipo}</td>
                      <td className={`${tdClass} text-[#4b4b4b]`}>{u.email}</td>
                      <td className={`${tdClass} text-center`}>
                        <button
                          type="button"
                          aria-label={`Editar ${u.nome}`}
                          onClick={() => setModal({ kind: "editar", user: u })}
                          className="mx-auto flex size-8 items-center justify-center rounded text-[#00842f] transition-colors hover:bg-[#e6f3ea]"
                        >
                          <PencilIcon className="size-5" />
                        </button>
                      </td>
                      <td className={`${tdClass} text-center`}>
                        <button
                          type="button"
                          disabled={ativo}
                          onClick={() => setModal({ kind: "motivo", user: u })}
                          className={`mx-auto flex items-center gap-1 rounded px-2 py-1 text-sm transition-colors ${
                            ativo
                              ? "cursor-not-allowed text-[#cacaca]"
                              : "text-[#4b4b4b] hover:text-black"
                          }`}
                        >
                          <EyeIcon className="size-5" />
                          Ver
                        </button>
                      </td>
                      <td className={`${tdClass} text-center`}>
                        <div className="flex justify-center">
                          <Toggle on={ativo} onToggle={() => onToggle(u)} />
                        </div>
                      </td>
                    </tr>
                  );
                })}
                {filtrados.length === 0 && (
                  <tr>
                    <td colSpan={10} className="px-4 py-10 text-center text-sm text-[#8e8e8e]">
                      Nenhum usuário encontrado.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Paginação */}
          <div className="flex items-center justify-center gap-6 text-sm text-[#4b4b4b]">
            <span>1 - {filtrados.length} de 80 registros</span>
            <div className="flex items-center gap-1">
              <button type="button" aria-label="Página anterior" className="flex size-8 items-center justify-center rounded text-[#8e8e8e] hover:bg-[#f0f0f0]">
                <ChevronLeftIcon className="size-4" />
              </button>
              <button type="button" className="flex size-8 items-center justify-center rounded-full bg-[#00842f] text-sm font-bold text-white">1</button>
              <button type="button" className="flex size-8 items-center justify-center rounded text-black hover:bg-[#f0f0f0]">2</button>
              <button type="button" className="flex size-8 items-center justify-center rounded text-black hover:bg-[#f0f0f0]">3</button>
              <span className="px-1 text-[#8e8e8e]">…</span>
              <button type="button" className="flex size-8 items-center justify-center rounded text-black hover:bg-[#f0f0f0]">8</button>
              <button type="button" aria-label="Próxima página" className="flex size-8 items-center justify-center rounded text-[#4b4b4b] hover:bg-[#f0f0f0]">
                <ChevronRightIcon className="size-4" />
              </button>
            </div>
          </div>
        </main>

        <Footer />
      </div>

      {/* Modais */}
      {modal.kind === "cadastrar" && (
        <CadastrarUsuarioModal
          onClose={() => setModal({ kind: "none" })}
          onSalvar={() => setModal({ kind: "sucesso", titulo: "Usuário cadastrado com sucesso" })}
        />
      )}
      {modal.kind === "editar" && (
        <EditarUsuarioModal
          nomeInicial={modal.user.nome}
          emailInicial="alexandre.araujo@email.com"
          tipoInicial={tipoDe(modal.user)}
          onClose={() => setModal({ kind: "none" })}
          onSalvar={() => setModal({ kind: "sucesso", titulo: "Atualização realizada com sucesso" })}
        />
      )}
      {modal.kind === "motivo" && (
        <MotivoInativacaoModal
          funcional={modal.user.funcional}
          motivo="Funcionário foi desligado"
          observacao=""
          onClose={() => setModal({ kind: "none" })}
        />
      )}
      {modal.kind === "confirmInativar" && (
        <AtencaoModal
          onCancelar={() => setModal({ kind: "none" })}
          onConfirmar={() => {
            setStatus(modal.user.id, "Inativo");
            setModal({ kind: "sucesso", titulo: "Usuário desativado com sucesso" });
          }}
        />
      )}
      {modal.kind === "sucesso" && (
        <SucessoModal titulo={modal.titulo} onOk={() => setModal({ kind: "none" })} />
      )}
    </div>
  );
}
