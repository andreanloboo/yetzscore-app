import ModalShell from "./ModalShell";
import { CheckCircleIcon, InfoCircleIcon } from "./icons";

const primaryButton =
  "flex h-12 w-full cursor-pointer items-center justify-center rounded-md bg-[#00842f] text-base font-bold text-white transition-[background-color,transform] duration-150 hover:bg-[#006b26] active:scale-[0.99] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00842f] focus-visible:ring-offset-2";

const outlineButton =
  "flex h-12 w-full cursor-pointer items-center justify-center rounded-md border border-[#00842f] text-base font-bold text-[#00842f] transition-[background-color,transform] duration-150 hover:bg-[#e6f3ea] active:scale-[0.99] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00842f] focus-visible:ring-offset-2";

// ─── Modal Atenção (confirmar/cancelar) ──────────────────────────────────────
interface AtencaoDelegacaoModalProps {
  question: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export function AtencaoDelegacaoModal({
  question,
  onConfirm,
  onCancel,
}: AtencaoDelegacaoModalProps) {
  return (
    <ModalShell onClose={onCancel} ariaLabel="Atenção">
      <div className="flex w-full flex-col items-center gap-10">
        <div className="flex flex-col items-center gap-6">
          <InfoCircleIcon size={32} className="text-[#f59e0b]" />
          <p className="text-center text-[22px] font-bold leading-normal text-black">Atenção</p>
          <p className="text-center text-sm leading-normal text-[#4b4b4b]">{question}</p>
        </div>
        <div className="flex w-full flex-col gap-2">
          <button type="button" onClick={onConfirm} className={primaryButton}>
            Confirmar
          </button>
          <button type="button" onClick={onCancel} className={outlineButton}>
            Cancelar
          </button>
        </div>
      </div>
    </ModalShell>
  );
}

// ─── Modal de sucesso (título + mensagem opcional + Ok) ──────────────────────
interface SucessoDelegacaoModalProps {
  title: string;
  message?: string;
  onOk: () => void;
}

export function SucessoDelegacaoModal({ title, message, onOk }: SucessoDelegacaoModalProps) {
  return (
    <ModalShell onClose={onOk} ariaLabel={title}>
      <div className="flex w-full flex-col items-center gap-10">
        <div className="flex flex-col items-center gap-6">
          <CheckCircleIcon size={32} className="text-[#00842f]" />
          <p className="whitespace-pre-line text-center text-[22px] font-bold leading-normal text-black">
            {title}
          </p>
          {message && (
            <p className="text-center text-sm leading-normal text-[#4b4b4b]">{message}</p>
          )}
        </div>
        <button type="button" onClick={onOk} className={primaryButton}>
          Ok
        </button>
      </div>
    </ModalShell>
  );
}

// ─── Modal genérico de aviso de delegação (pós-login, ref 8241:16011) ────────
interface AvisoDelegacaoModalProps {
  title: string;
  message: string;
  primaryLabel: string;
  onPrimary: () => void;
  onClose: () => void;
}

export function AvisoDelegacaoModal({
  title,
  message,
  primaryLabel,
  onPrimary,
  onClose,
}: AvisoDelegacaoModalProps) {
  return (
    <ModalShell onClose={onClose} ariaLabel={title}>
      <div className="flex w-full flex-col items-center gap-10">
        <div className="flex flex-col items-center gap-6">
          <InfoCircleIcon size={32} className="text-[#00842f]" />
          <p className="text-center text-lg font-bold leading-normal text-black">{title}</p>
          <p className="text-center text-sm leading-normal text-[#4b4b4b]">{message}</p>
        </div>
        <div className="flex w-full flex-col items-center gap-4">
          <button type="button" onClick={onPrimary} className={primaryButton}>
            {primaryLabel}
          </button>
          <button
            type="button"
            onClick={onClose}
            className="cursor-pointer rounded-md px-3 py-1 text-base leading-4 text-black transition-colors duration-150 hover:text-[#00842f] hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00842f]"
          >
            Fechar
          </button>
        </div>
      </div>
    </ModalShell>
  );
}
