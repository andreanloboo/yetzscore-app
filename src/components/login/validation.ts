// ─── Validações e helpers do login / recuperação de senha ────────────────────

/** Login: válido somente se for EXCLUSIVAMENTE números, com no mínimo 8 dígitos. */
export function isLoginValid(login: string): boolean {
  return /^\d{8,}$/.test(login);
}

/** Senha do login: válida somente se for EXCLUSIVAMENTE letras, com no mínimo 8 letras. */
export function isSenhaValid(senha: string): boolean {
  return /^\p{L}{8,}$/u.test(senha);
}

/** E-mail com formato válido (usuario@dominio.tld). */
export function isEmailValid(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

/** Funcional: somente números (não vazia). */
export function isFuncionalValid(funcional: string): boolean {
  return /^\d+$/.test(funcional.trim());
}

/**
 * Mascara o e-mail digitado: 2 primeiros caracteres do usuário + asteriscos,
 * 2 primeiros do domínio + asteriscos e o TLD. Ex.: joao@gmail.com.br → jo****@gm***.br
 */
export function maskEmail(email: string): string {
  const [user = "", domain = ""] = email.trim().split("@");
  const labels = domain.split(".");
  const tld = labels.length > 1 ? (labels[labels.length - 1] ?? "") : "";
  const domainName = labels[0] ?? "";
  return `${user.slice(0, 2)}****@${domainName.slice(0, 2)}***.${tld}`;
}

// ─── Checklist da nova senha ──────────────────────────────────────────────────
export interface PasswordChecks {
  minLength: boolean;
  hasNumber: boolean;
  hasUpper: boolean;
  hasLower: boolean;
  noTripleRepeat: boolean;
  hasSpecial: boolean;
}

export function getPasswordChecks(senha: string): PasswordChecks {
  return {
    minLength: senha.length >= 8,
    hasNumber: /\d/.test(senha),
    hasUpper: /[A-Z]/.test(senha),
    hasLower: /[a-z]/.test(senha),
    noTripleRepeat: senha.length > 0 && !/(.)\1\1/.test(senha),
    hasSpecial: /[!@#$%^*&]/.test(senha),
  };
}

/** Caracteres permitidos na nova senha: letras, números e !@#$%^*& */
export function hasInvalidPasswordChars(senha: string): boolean {
  return /[^A-Za-z0-9!@#$%^*&]/.test(senha);
}

/** Formata segundos como hh:mm:ss (ex.: 59 → "00:00:59"). */
export function formatCountdown(totalSeconds: number): string {
  const pad = (n: number) => String(n).padStart(2, "0");
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = totalSeconds % 60;
  return `${pad(h)}:${pad(m)}:${pad(s)}`;
}
