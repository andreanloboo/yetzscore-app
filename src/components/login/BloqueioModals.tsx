import ModalShell from "./ModalShell";
import { ClockIcon, XCircleIcon } from "./icons";
import { formatCountdown } from "./validation";
import { primaryButton } from "./ui";

// ─── Modal: acesso bloqueado com temporizador (3ª falha) ─────────────────────
interface BloqueioTemporarioModalProps {
  remaining: number;
  onOk: () => void;
}

export function BloqueioTemporarioModal({ remaining, onOk }: BloqueioTemporarioModalProps) {
  return (
    <ModalShell onClose={onOk}>
      <div className="flex flex-col items-center gap-6">
        <XCircleIcon className="size-8 shrink-0 text-[#cc0000]" />
        <p className="w-full text-center text-[22px] font-bold leading-[26px] text-black">
          Acesso temporariamente bloqueado.
        </p>
        <div className="flex flex-col items-center gap-4">
          <p className="w-[297px] text-center text-sm leading-[17px] text-[#4b4b4b]">
            Tempo restante para tentar novamente:
          </p>
          <div className="flex items-center justify-center gap-[7px]">
            <ClockIcon className="size-6 text-[#4b4b4b]" />
            <p className="text-center text-base leading-6 text-[#4b4b4b] tabular-nums">
              {formatCountdown(remaining)}
            </p>
          </div>
        </div>
        <button type="button" onClick={onOk} className={`${primaryButton} w-full`}>
          Ok
        </button>
      </div>
    </ModalShell>
  );
}

// ─── Modal: bloqueio definitivo (5ª falha) ────────────────────────────────────
interface BloqueioDefinitivoModalProps {
  onOk: () => void;
}

export function BloqueioDefinitivoModal({ onOk }: BloqueioDefinitivoModalProps) {
  return (
    <ModalShell onClose={onOk}>
      <div className="flex flex-col items-center gap-6">
        <XCircleIcon className="size-8 shrink-0 text-[#cc0000]" />
        <p className="w-full text-center text-[22px] font-bold leading-[26px] text-black">
          Acesso temporariamente bloqueado.
        </p>
        <p className="w-[297px] whitespace-pre-line text-center text-sm leading-[17px] text-[#4b4b4b]">
          {"Você excedeu o máximo de tentativas de Login e, por segurança, sua conta foi bloqueada.\n\nFale com o responsável pela campanha para efetuar o desbloqueio."}
        </p>
        <button type="button" onClick={onOk} className={`${primaryButton} w-full`}>
          Ok
        </button>
      </div>
    </ModalShell>
  );
}
