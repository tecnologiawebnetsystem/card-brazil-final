import { ApiClient } from "@/lib/api-client"

export interface Estipulante {
  id?: number
  pessoaId: number
  tipoEstipulante: string
  situacao: "Ativo" | "Desativo"
}

export const EstipulanteService = {
  async getAll(filters?: Record<string, any>) {
    const params = new URLSearchParams(filters).toString()
    return ApiClient.get(`/api/estipulantes${params ? `?${params}` : ""}`)
  },

  async getById(id: number) {
    return ApiClient.get(`/api/estipulantes/${id}`)
  },

  async create(data: Estipulante) {
    return ApiClient.post("/api/estipulantes", data)
  },

  async update(id: number, data: Partial<Estipulante>) {
    return ApiClient.put(`/api/estipulantes/${id}`, data)
  },

  async delete(id: number) {
    return ApiClient.delete(`/api/estipulantes/${id}`)
  },
}
