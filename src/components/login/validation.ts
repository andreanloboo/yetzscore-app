// ─── Validações e helpers do login / recuperação de senha ────────────────────

/**
 * Login: válido se for EXCLUSIVAMENTE números (mín. 8 dígitos) OU
 * EXCLUSIVAMENTE letras (mín. 8 letras). Conteúdo misto é inválido
 * (perfil Usuário Master, ainda não implementado).
 */
export function isLoginValid(login: string): boolean {
  return /^\d{8,}$/.test(login) || /^[A-Za-zÀ-ÿ]{8,}$/.test(login);
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

/** Mantém só dígitos e aplica a máscara de CPF (000.000.000-00) progressivamente. */
export function formatCpf(value: string): string {
  const d = value.replace(/\D/g, "").slice(0, 11);
  if (d.length <= 3) return d;
  if (d.length <= 6) return `${d.slice(0, 3)}.${d.slice(3)}`;
  if (d.length <= 9) return `${d.slice(0, 3)}.${d.slice(3, 6)}.${d.slice(6)}`;
  return `${d.slice(0, 3)}.${d.slice(3, 6)}.${d.slice(6, 9)}-${d.slice(9)}`;
}

/** CPF (login do admscore): válido quando tem 11 dígitos. */
export function isCpfValid(cpf: string): boolean {
  return cpf.replace(/\D/g, "").length === 11;
}

/** Login do admscore: somente números, com mais de 8 dígitos (9+). */
export function isAdmLoginValid(login: string): boolean {
  return /^\d{9,}$/.test(login);
}

/** Senha do admscore: mais de 8 caracteres, contendo ao menos 1 letra e 1 número. */
export function isAdmSenhaValid(senha: string): boolean {
  return senha.length > 8 && /[A-Za-z]/.test(senha) && /\d/.test(senha);
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
