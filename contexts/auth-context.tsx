"use client"

import { createContext, useContext, useState, useEffect, useRef, type ReactNode } from "react"
import { useRouter } from "next/navigation"

interface User {
  id: number
  nome_completo: string
  email: string
  administradora_id: number
  tipo_usuario: string
  status: string
  perfil_id?: number
  permissions?: Record<string, boolean>
  avatar_url?: string | null
}

interface AuthContextType {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
  checkAuth: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const authRequestRef = useRef<Promise<void> | null>(null)
  const router = useRouter()

  const checkAuth = async () => {
    if (authRequestRef.current) return authRequestRef.current

    const request = (async () => {
      const controller = new AbortController()
      const timeout = window.setTimeout(() => controller.abort(), 8000)

      try {
        const response = await fetch("/api/auth/me", {
          credentials: "same-origin",
          cache: "no-store",
          signal: controller.signal,
        })
        const data = response.ok ? await response.json() : null
        setUser(data?.success && data.user ? data.user : null)
      } catch {
        setUser(null)
      } finally {
        window.clearTimeout(timeout)
        setIsLoading(false)
        authRequestRef.current = null
      }
    })()

    authRequestRef.current = request
    return request
  }

  const login = async (email: string, password: string) => {
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, senha: password }),
      })

      const data = await response.json()

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Login failed")
      }

      if (data.data?.usuario) {
        setUser(data.data.usuario)
      }

      router.push("/dashboard")
    } catch (error) {
      throw error
    }
  }

  const logout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" })
      setUser(null)
      router.push("/")
    } catch (error) {
      // No debug console.log here
    }
  }

  useEffect(() => {
    checkAuth()
  }, [])

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        logout,
        checkAuth,
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
