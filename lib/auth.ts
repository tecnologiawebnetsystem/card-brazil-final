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
  if (typeof window === "undefined") return null

  const storedProfile = localStorage.getItem("userProfile")
  const storedName = localStorage.getItem("userName") || "Usuário"

  if (!storedProfile) return null

  // Se for string simples (compatibilidade), converter para objeto
  if (typeof storedProfile === "string" && !storedProfile.startsWith("{")) {
    return {
      name: storedName,
      role: storedProfile as UserProfile["role"],
      avatar: undefined,
      email: undefined,
    }
  }

  try {
    return JSON.parse(storedProfile) as UserProfile
  } catch {
    // Fallback para compatibilidade
    return {
      name: storedName,
      role: storedProfile as UserProfile["role"],
      avatar: undefined,
      email: undefined,
    }
  }
}

export function getUserPermissions(profile: UserProfile): UserPermissions {
  const permissions: Record<UserProfile["role"], UserPermissions> = {
    admin: {
      canViewFinanceiro: true,
      canViewCadastros: true,
      canViewContratos: true,
      canViewCompliance: true,
      canViewConfiguracoes: true,
      canManageUsers: true,
      canGenerateReports: true,
      canViewAllData: true,
    },
    operadora: {
      canViewFinanceiro: true,
      canViewCadastros: true,
      canViewContratos: true,
      canViewCompliance: true,
      canViewConfiguracoes: false,
      canManageUsers: false,
      canGenerateReports: true,
      canViewAllData: true,
    },
    estipulante: {
      canViewFinanceiro: false,
      canViewCadastros: false,
      canViewContratos: true,
      canViewCompliance: false,
      canViewConfiguracoes: false,
      canManageUsers: false,
      canGenerateReports: false,
      canViewAllData: false,
    },
    subestipulante: {
      canViewFinanceiro: false,
      canViewCadastros: false,
      canViewContratos: true,
      canViewCompliance: false,
      canViewConfiguracoes: false,
      canManageUsers: false,
      canGenerateReports: false,
      canViewAllData: false,
    },
    usuario: {
      canViewFinanceiro: false,
      canViewCadastros: false,
      canViewContratos: false,
      canViewCompliance: false,
      canViewConfiguracoes: false,
      canManageUsers: false,
      canGenerateReports: false,
      canViewAllData: false,
    },
  }

  return permissions[profile.role]
}

export function isLoggedIn(): boolean {
  if (typeof window === "undefined") return false
  return localStorage.getItem("isLoggedIn") === "true"
}

export function logout(): void {
  if (typeof window === "undefined") return
  localStorage.removeItem("userProfile")
  localStorage.removeItem("userName")
  localStorage.removeItem("isLoggedIn")
  localStorage.removeItem("loginTime")
  localStorage.removeItem("isDemoMode")
}

export function saveUserProfile(profile: UserProfile): void {
  if (typeof window === "undefined") return
  localStorage.setItem("userProfile", JSON.stringify(profile))
  localStorage.setItem("userName", profile.name)
}
