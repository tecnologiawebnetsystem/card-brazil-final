"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useRouter } from "next/navigation"
import { AuthService } from "@/services/auth.service.ts"

interface User {
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

interface AuthContextType {
  user: User | null
  loading: boolean
  login: (credentials: { email: string; password: string; userType?: string; codigo?: string }) => Promise<void>
  logout: () => Promise<void>
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const checkAuth = () => {
      const token = AuthService.getToken()
      const userProfile = localStorage.getItem("userProfile")

      if (token && userProfile) {
        try {
          setUser(JSON.parse(userProfile))
        } catch (error) {
          console.error("[v0] Erro ao carregar perfil do usuário:", error)
          AuthService.logout()
        }
      }
      setLoading(false)
    }

    checkAuth()
  }, [])

  const login = async (credentials: {
    email: string
    password: string
    userType?: string
    codigo?: string
  }) => {
    try {
      setLoading(true)
      const response = await AuthService.login(credentials)

      const { token, refreshToken, user: userData } = response.data

      AuthService.setToken(token)
      localStorage.setItem("refreshToken", refreshToken)
      localStorage.setItem("userProfile", JSON.stringify(userData))
      localStorage.setItem("userName", userData.nome)
      localStorage.setItem("isLoggedIn", "true")
      localStorage.setItem("loginTime", new Date().toISOString())

      setUser(userData)
      router.push("/dashboard")
    } catch (error: any) {
      console.error("[v0] Erro no login:", error)
      throw new Error(error.message || "Erro ao fazer login")
    } finally {
      setLoading(false)
    }
  }

  const logout = async () => {
    try {
      await AuthService.logout()
    } catch (error) {
      console.error("[v0] Erro ao fazer logout:", error)
    } finally {
      setUser(null)
      AuthService.clearToken()
      localStorage.removeItem("refreshToken")
      localStorage.removeItem("userProfile")
      localStorage.removeItem("userName")
      localStorage.removeItem("isLoggedIn")
      localStorage.removeItem("loginTime")
      router.push("/")
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
