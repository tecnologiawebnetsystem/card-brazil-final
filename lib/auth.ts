export interface UserProfile {
  name: string
  role: "admin" | "operadora" | "estipulante" | "subestipulante" | "usuario"
  avatar?: string
  email?: string
}

export interface UserPermissions {
  canViewFinanceiro: boolean
  canViewCadastros: boolean
  canViewContratos: boolean
  canViewCompliance: boolean
  canViewConfiguracoes: boolean
  canManageUsers: boolean
  canGenerateReports: boolean
  canViewAllData: boolean
}

export function getUserProfile(): UserProfile | null {
  return null
}

export function getUserPermissions(profile: UserProfile): UserPermissions {
  const restricted: UserPermissions = {
    canViewFinanceiro: false,
    canViewCadastros: false,
    canViewContratos: false,
    canViewCompliance: false,
    canViewConfiguracoes: false,
    canManageUsers: false,
    canGenerateReports: false,
    canViewAllData: false,
  }

  if (profile.role === "admin") {
    return Object.fromEntries(Object.keys(restricted).map((key) => [key, true])) as unknown as UserPermissions
  }

  if (profile.role === "operadora") {
    return { ...restricted, canViewFinanceiro: true, canViewCadastros: true, canViewContratos: true, canViewCompliance: true, canGenerateReports: true, canViewAllData: true }
  }

  if (profile.role === "estipulante" || profile.role === "subestipulante") {
    return { ...restricted, canViewContratos: true }
  }

  return restricted
}

export function isLoggedIn(): boolean {
  return false
}

export function logout(): void {
  // A sessão é encerrada pelo endpoint /api/auth/logout e pelo cookie HTTP-only.
}

export function saveUserProfile(_profile: UserProfile): void {
  // Perfil não é persistido no cliente; consulte /api/auth/me.
}
