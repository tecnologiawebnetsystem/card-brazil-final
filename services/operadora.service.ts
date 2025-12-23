import { ApiClient } from "@/lib/api-client"

export interface Operadora {
  id?: number
  pessoaId: number
  naturezaOperadora: string
  registroANS: string
  situacao: "Ativo" | "Desativo"
}

export const OperadoraService = {
  async getAll(filters?: Record<string, any>) {
    const params = new URLSearchParams(filters).toString()
    return ApiClient.get(`/api/operadoras${params ? `?${params}` : ""}`)
  },

  async getById(id: number) {
    return ApiClient.get(`/api/operadoras/${id}`)
  },

  async create(data: Operadora) {
    return ApiClient.post("/api/operadoras", data)
  },

  async update(id: number, data: Partial<Operadora>) {
    return ApiClient.put(`/api/operadoras/${id}`, data)
  },

  async delete(id: number) {
    return ApiClient.delete(`/api/operadoras/${id}`)
  },
}
