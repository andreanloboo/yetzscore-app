// Perfil do usuário derivado do conteúdo do campo de login:
// só números → Gerente de Negócios | só letras → Gerente de Contas |
// alfanumérico → Usuário Master (cenário ainda não implementado).
export type UserProfile = "gerente-negocios" | "gerente-contas" | "master";

const KEY = "yetzscore:profile";

export const PROFILE_LABELS: Record<UserProfile, string> = {
  "gerente-negocios": "Gerente de Negócios",
  "gerente-contas": "Gerente de Contas",
  master: "Usuário Master",
};

export function setProfile(profile: UserProfile): void {
  sessionStorage.setItem(KEY, profile);
}

export function getProfile(): UserProfile {
  const v = sessionStorage.getItem(KEY);
  return v === "gerente-contas" || v === "master" ? v : "gerente-negocios";
}

/** Perfil correspondente ao login digitado, ou null se não mapear para nenhum. */
export function profileFromLogin(login: string): UserProfile | null {
  if (/^\d{8,}$/.test(login)) return "gerente-negocios";
  if (/^[A-Za-zÀ-ÿ]{8,}$/.test(login)) return "gerente-contas";
  return null;
}
