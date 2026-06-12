import { useEffect, useMemo, useRef, useState } from "react";
import type { KeyboardEvent as ReactKeyboardEvent, ReactNode } from "react";
import CalendarPopover, { formatFullDate } from "../campanhas/CalendarPopover";
import type { DateRange } from "../campanhas/CalendarPopover";
import { CalendarIcon, ChevronDownIcon } from "../campanhas/icons";
import ModalShell, { DropdownPanel } from "./ModalShell";
import { EditSquareIcon, EyeIcon, XIcon } from "./icons";
import { MOTIVOS, USUARIOS, normalize } from "./types";
import type { Delegacao } from "./types";

export type DelegacaoFormMode = "cadastrar" | "editar" | "visualizar";

export interface DelegacaoFormData {
  titular: string;
  substitutos: string[];
  motivo: string;
  inicio: string; // ISO yyyy-mm-dd
  fim: string; // ISO yyyy-mm-dd
  observacao: string;
}

interface DelegacaoFormModalProps {
  mode: DelegacaoFormMode;
  initial?: Delegacao;
  onSave: (data: DelegacaoFormData) => void;
  onClose: () => void;
}

type OpenField = "titular" | "substituto" | "motivo" | "periodo" | null;

const TITLES: Record<DelegacaoFormMode, string> = {
  cadastrar: "Cadastrar Nova Delegação",
  editar: "Editar Delegação",
  visualizar: "Visualizar Delegação",
};

const fieldBase =
  "flex h-12 w-full items-center justify-between gap-2 rounded-md border bg-white px-4 text-left text-base leading-4 transition-colors duration-150";

function FieldLabel({ text, invalid }: { text: string; invalid: boolean }) {
  return (
    <span className="text-sm leading-[17px] text-black">
      {text}
      {invalid && <span className="font-bold text-[#cc0000]"> *</span>}
    </span>
  );
}

function SuggestionList({
  options,
  onPick,
}: {
  options: string[];
  onPick: (name: string) => void;
}) {
  return (
    <DropdownPanel className="left-0 top-[calc(100%+4px)] max-h-[180px] w-full overflow-y-auto">
      {options.map((name, i) => (
        <button
          key={name}
          type="button"
          onClick={() => onPick(name)}
          className={`flex h-[42px] w-full cursor-pointer items-center px-4 text-left text-sm leading-[17px] text-[#4b4b4b] transition-colors duration-150 hover:bg-[#e6f3ea] hover:text-[#00842f] ${
            i % 2 === 1 ? "bg-[#f5f5f5]" : "bg-white"
          }`}
        >
          {name}
        </button>
      ))}
    </DropdownPanel>
  );
}

export default function DelegacaoFormModal({
  mode,
  initial,
  onSave,
  onClose,
}: DelegacaoFormModalProps) {
  const readonly = mode === "visualizar";

  const [titular, setTitular] = useState(initial?.titular ?? "");
  const [substitutos, setSubstitutos] = useState<string[]>(initial?.substitutos ?? []);
  const [subQuery, setSubQuery] = useState("");
  const [motivo, setMotivo] = useState(initial?.motivo ?? "");
  const [range, setRange] = useState<DateRange>(
    initial ? { start: initial.inicio, end: initial.fim } : { start: null, end: null }
  );
  const [observacao, setObservacao] = useState(initial?.observacao ?? "");
  const [openField, setOpenField] = useState<OpenField>(null);
  const [showErrors, setShowErrors] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);

  // Click-away fecha autocomplete/dropdown/calendário abertos dentro do modal
  useEffect(() => {
    if (!openField) return;
    function handleMouseDown(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpenField(null);
      }
    }
    document.addEventListener("mousedown", handleMouseDown);
    return () => document.removeEventListener("mousedown", handleMouseDown);
  }, [openField]);

  const titularSugestoes = useMemo(() => {
    const q = normalize(titular.trim());
    if (!q) return [];
    return USUARIOS.filter((u) => normalize(u).includes(q) && u !== titular);
  }, [titular]);

  const substitutoSugestoes = useMemo(() => {
    const q = normalize(subQuery.trim());
    if (!q) return [];
    return USUARIOS.filter(
      (u) => normalize(u).includes(q) && !substitutos.includes(u) && u !== titular
    );
  }, [subQuery, substitutos, titular]);

  const missing = {
    titular: titular.trim() === "",
    substitutos: substitutos.length === 0,
    motivo: motivo === "",
    periodo: !(range.start && range.end),
  };
  const hasMissing =
    missing.titular || missing.substitutos || missing.motivo || missing.periodo;
  const invalido = (campo: keyof typeof missing) => showErrors && missing[campo];

  function addSubstituto(nome: string) {
    setSubstitutos((prev) => (prev.includes(nome) ? prev : [...prev, nome]));
    setSubQuery("");
    setOpenField(null);
  }

  function removeSubstituto(nome: string) {
    setSubstitutos((prev) => prev.filter((n) => n !== nome));
  }

  function handleSubKeyDown(e: ReactKeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" && substitutoSugestoes.length > 0) {
      e.preventDefault();
      addSubstituto(substitutoSugestoes[0]);
    }
  }

  function handleRangeChange(next: DateRange) {
    setRange(next);
    if (next.start && next.end) setOpenField(null);
  }

  function handleSalvar() {
    if (hasMissing) {
      setShowErrors(true);
      return;
    }
    onSave({
      titular: titular.trim(),
      substitutos,
      motivo,
      inicio: range.start as string,
      fim: range.end as string,
      observacao: observacao.trim(),
    });
  }

  const borderOf = (campo: keyof typeof missing) =>
    invalido(campo) ? "border-[#cc0000]" : "border-[#cacaca] focus-within:border-[#00842f]";

  const readonlyField = readonly ? "bg-[#f5f5f5] text-[#8e8e8e]" : "";

  const titleIcon: ReactNode = readonly ? (
    <EyeIcon size={24} className="shrink-0 text-[#00842f]" />
  ) : (
    <EditSquareIcon size={24} className="shrink-0 text-[#00842f]" />
  );

  return (
    <ModalShell onClose={onClose} ariaLabel={TITLES[mode]}>
      <div ref={containerRef} className="flex w-full flex-col gap-6">
        {/* Título */}
        <div className="flex items-center justify-center gap-2">
          {titleIcon}
          <h2 className="text-center text-[22px] font-bold leading-[26px] text-[#00842f]">
            {TITLES[mode]}
          </h2>
        </div>

        {/* Campos */}
        <div className="flex flex-col gap-4">
          {/* Responsável titular */}
          <label className="flex flex-col gap-2">
            <FieldLabel text="Responsável titular" invalid={invalido("titular")} />
            <div className={`relative ${readonly ? "" : ""}`}>
              <div className={`${fieldBase} ${borderOf("titular")} ${readonlyField}`}>
                <input
                  type="text"
                  value={titular}
                  disabled={readonly}
                  placeholder="Buscar Usuário"
                  onChange={(e) => {
                    setTitular(e.target.value);
                    setOpenField("titular");
                  }}
                  onFocus={() => setOpenField("titular")}
                  className="w-full bg-transparent text-base leading-4 text-[#191919] outline-none placeholder:text-[#8e8e8e] disabled:cursor-default disabled:text-[#8e8e8e]"
                />
                <ChevronDownIcon size={16} className="shrink-0 text-[#4b4b4b]" />
              </div>
              {!readonly &&
                openField === "titular" &&
                titular.trim() !== "" &&
                titularSugestoes.length > 0 && (
                  <SuggestionList
                    options={titularSugestoes}
                    onPick={(nome) => {
                      setTitular(nome);
                      setOpenField(null);
                    }}
                  />
                )}
            </div>
          </label>

          {/* Responsável substituto */}
          <div className="flex flex-col gap-2">
            <FieldLabel text="Responsável substituto" invalid={invalido("substitutos")} />
            <div className="relative">
              <div className={`${fieldBase} ${borderOf("substitutos")} ${readonlyField}`}>
                <input
                  type="text"
                  value={subQuery}
                  disabled={readonly}
                  placeholder="Buscar Usuário"
                  onChange={(e) => {
                    setSubQuery(e.target.value);
                    setOpenField("substituto");
                  }}
                  onFocus={() => setOpenField("substituto")}
                  onKeyDown={handleSubKeyDown}
                  className="w-full bg-transparent text-base leading-4 text-[#191919] outline-none placeholder:text-[#8e8e8e] disabled:cursor-default disabled:text-[#8e8e8e]"
                />
                <ChevronDownIcon size={16} className="shrink-0 text-[#4b4b4b]" />
              </div>
              {!readonly &&
                openField === "substituto" &&
                subQuery.trim() !== "" &&
                substitutoSugestoes.length > 0 && (
                  <SuggestionList options={substitutoSugestoes} onPick={addSubstituto} />
                )}
            </div>
            {/* Chips removíveis */}
            {substitutos.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {substitutos.map((nome) => (
                  <span
                    key={nome}
                    className="inline-flex h-[21px] items-center gap-1 rounded-md bg-[#eeeeee] px-2 text-xs leading-[17px] text-[#4b4b4b]"
                  >
                    {nome}
                    {!readonly && (
                      <button
                        type="button"
                        aria-label={`Remover ${nome}`}
                        onClick={() => removeSubstituto(nome)}
                        className="cursor-pointer rounded-sm text-[#8e8e8e] transition-colors duration-150 hover:text-[#cc0000] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#00842f]"
                      >
                        <XIcon size={12} />
                      </button>
                    )}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Motivo */}
          <div className="flex flex-col gap-2">
            <FieldLabel text="Motivo" invalid={invalido("motivo")} />
            <div className="relative">
              <button
                type="button"
                disabled={readonly}
                onClick={() => setOpenField((f) => (f === "motivo" ? null : "motivo"))}
                className={`${fieldBase} ${borderOf("motivo")} ${readonlyField} ${
                  readonly ? "cursor-default" : "cursor-pointer"
                } focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00842f]`}
              >
                <span className={motivo ? "text-[#191919]" : "text-[#8e8e8e]"}>
                  {motivo || "Selecionar motivo"}
                </span>
                <ChevronDownIcon
                  size={16}
                  className={`shrink-0 text-[#4b4b4b] transition-transform duration-200 ${
                    openField === "motivo" ? "rotate-180" : ""
                  }`}
                />
              </button>
              {openField === "motivo" && (
                <DropdownPanel className="left-0 top-[calc(100%+4px)] w-full">
                  {MOTIVOS.map((m, i) => (
                    <button
                      key={m}
                      type="button"
                      onClick={() => {
                        setMotivo(m);
                        setOpenField(null);
                      }}
                      className={`flex h-[42px] w-full cursor-pointer items-center px-4 text-left text-sm leading-[17px] transition-colors duration-150 hover:bg-[#e6f3ea] hover:text-[#00842f] ${
                        i % 2 === 1 ? "bg-[#f5f5f5]" : "bg-white"
                      } ${m === motivo ? "font-bold text-[#00842f]" : "text-[#4b4b4b]"}`}
                    >
                      {m}
                    </button>
                  ))}
                </DropdownPanel>
              )}
            </div>
          </div>

          {/* Período */}
          <div className="flex flex-col gap-2">
            <FieldLabel text="Período" invalid={invalido("periodo")} />
            <div className="relative">
              <button
                type="button"
                disabled={readonly}
                onClick={() => setOpenField((f) => (f === "periodo" ? null : "periodo"))}
                className={`${fieldBase} ${borderOf("periodo")} ${readonlyField} ${
                  readonly ? "cursor-default" : "cursor-pointer"
                } focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00842f]`}
              >
                <span className={range.start && range.end ? "text-[#191919]" : "text-[#8e8e8e]"}>
                  {range.start && range.end
                    ? `${formatFullDate(range.start)} - ${formatFullDate(range.end)}`
                    : range.start
                      ? `${formatFullDate(range.start)} - --/--/----`
                      : "Selecionar período"}
                </span>
                <CalendarIcon size={16} className="shrink-0 text-[#4b4b4b]" />
              </button>
              {openField === "periodo" && (
                <CalendarPopover
                  range={range}
                  onChange={handleRangeChange}
                  onClear={() => setRange({ start: null, end: null })}
                />
              )}
            </div>
          </div>

          {/* Observação */}
          <label className="flex flex-col gap-2">
            <span className="text-sm leading-[17px] text-black">Observação (Opcional)</span>
            <textarea
              value={observacao}
              disabled={readonly}
              placeholder="Observação Adicional"
              onChange={(e) => setObservacao(e.target.value)}
              className={`h-[120px] w-full resize-none rounded-md border p-4 text-base leading-5 text-[#191919] outline-none transition-colors duration-150 placeholder:text-[#8e8e8e] ${
                readonly
                  ? "border-[#cacaca] bg-[#f5f5f5] text-[#8e8e8e]"
                  : "border-[#cacaca] focus:border-[#00842f]"
              }`}
            />
          </label>
        </div>

        {/* Validação */}
        {showErrors && hasMissing && (
          <p className="text-center text-sm leading-[17px] text-[#cc0000]">
            Preencha todas as informações para completar o cadastro.
          </p>
        )}

        {/* Botões */}
        <div className="flex flex-col gap-2">
          {!readonly && (
            <button
              type="button"
              onClick={handleSalvar}
              className="flex h-12 w-full cursor-pointer items-center justify-center rounded-md bg-[#00842f] text-base font-bold text-white transition-[background-color,transform] duration-150 hover:bg-[#006b26] active:scale-[0.99] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00842f] focus-visible:ring-offset-2"
            >
              Salvar
            </button>
          )}
          <button
            type="button"
            onClick={onClose}
            className="flex h-12 w-full cursor-pointer items-center justify-center rounded-md border border-[#00842f] text-base font-bold text-[#00842f] transition-[background-color,transform] duration-150 hover:bg-[#e6f3ea] active:scale-[0.99] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00842f] focus-visible:ring-offset-2"
          >
            Voltar
          </button>
        </div>
      </div>
    </ModalShell>
  );
}
