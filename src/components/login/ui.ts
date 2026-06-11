// ─── Classes utilitárias compartilhadas do fluxo de login/recuperação ─────────

/** Botão primário verde (h-48, radius 6). Adicione `w-full` quando necessário. */
export const primaryButton =
  "flex h-12 cursor-pointer items-center justify-center gap-2 rounded-md bg-[#00842f] px-8 py-3 text-center text-base font-bold text-white transition-colors duration-200 hover:bg-[#006b26] active:bg-[#00591f] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00842f] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-[#00842f] disabled:active:bg-[#00842f]";

/** Botão secundário (borda verde, fundo transparente). */
export const secondaryButton =
  "flex h-12 cursor-pointer items-center justify-center gap-2 rounded-md border border-[#00842f] bg-transparent px-8 py-3 text-center text-base font-bold text-[#00842f] transition-colors duration-200 hover:bg-[#e6f3ea] active:bg-[#dffbe8] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00842f] focus-visible:ring-offset-2";

/** Base dos inputs de texto (borda controlada por `inputBorder`). */
export const inputBase =
  "w-full rounded-md border bg-white p-4 text-base leading-4 text-black outline-none transition-colors duration-200 placeholder:text-[#8e8e8e]";

/** Borda do input conforme estado de erro. */
export function inputBorder(error: boolean): string {
  return error
    ? "border-[#cc0000] focus:border-[#cc0000]"
    : "border-[#cacaca] focus:border-[#00842f]";
}

/** Input desabilitado (cinza). */
export const inputDisabled =
  "w-full rounded-md border border-[#e1e1e1] bg-[#f5f5f5] p-4 text-base leading-4 text-[#8e8e8e]";
