import { ApiClient } from "@/lib/api-client"

export interface Plano {
  id?: number
  operadoraId: number
  produtoId: number
  nome: string
  registroANS?: string
  tipoContratacao: string
  abrangencia: string
  situacao: "Ativo" | "Desativo"
}

export const PlanoService = {
  async getAll(filters?: Record<string, any>) {
    const params = new URLSearchParams(filters).toString()
    return ApiClient.get(`/api/planos${params ? `?${params}` : ""}`)
  },

  async getById(id: number) {
    return ApiClient.get(`/api/planos/${id}`)
  },

  async create(data: Plano) {
    return ApiClient.post("/api/planos", data)
  },

  async update(id: number, data: Partial<Plano>) {
    return ApiClient.put(`/api/planos/${id}`, data)
  },

  async delete(id: number) {
    return ApiClient.delete(`/api/planos/${id}`)
  },
}
