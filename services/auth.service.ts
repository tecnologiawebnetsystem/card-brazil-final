import { ApiClient } from "@/lib/api-client"

export interface LoginRequest {
  email: string
  password: string
  userType: string
  codigo?: string
}

export interface LoginResponse {
  success: boolean
  data: {
    token: string
    refreshToken: string
    user: {
      id: number
      nome: string
      email: string
      cpf: string
      role_id: number
      role_nome: string
      role_descricao: string
      perfil_id: number | null
      perfil_nome: string | null
      status: string
      ultimo_acesso: string | null
    }
  }
}

export const AuthService = {
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    return ApiClient.post<LoginResponse>("/api/auth/login", credentials)
  },

  async logout(): Promise<void> {
    return ApiClient.post<void>("/api/auth/logout", {})
  },

  setToken(token: string) {
    if (typeof window !== "undefined") {
      localStorage.setItem("authToken", token)
    }
  },

  getToken(): string | null {
    if (typeof window !== "undefined") {
      return localStorage.getItem("authToken")
    }
    return null
  },

  removeToken() {
    if (typeof window !== "undefined") {
      localStorage.removeItem("authToken")
    }
  },

  clearToken() {
    this.removeToken()
  },
}

export default AuthService
