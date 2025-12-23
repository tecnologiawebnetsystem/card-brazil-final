const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || ""

export class ApiClient {
  private static async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const token = typeof window !== "undefined" ? localStorage.getItem("authToken") : null

    const headers: HeadersInit = {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    })

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: "Erro desconhecido" }))
      throw new Error(error.message || `HTTP ${response.status}`)
    }

    return response.json()
  }

  static get<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: "GET" })
  }

  static post<T>(endpoint: string, data: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: "POST",
      body: JSON.stringify(data),
    })
  }

  static put<T>(endpoint: string, data: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: "PUT",
      body: JSON.stringify(data),
    })
  }

  static delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: "DELETE" })
  }
}
