// Configuração de API
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000"

export const api = {
  get: async (endpoint: string): Promise<any> => {
    const response = await fetch(`${API_BASE_URL}${endpoint}`)
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    return response.json()
  },

  post: async (endpoint: string, data: unknown): Promise<any> => {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    return response.json()
  },
}
