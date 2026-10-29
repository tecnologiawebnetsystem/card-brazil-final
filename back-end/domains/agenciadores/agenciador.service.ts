import { ApiClient } from "@/lib/api-client"

export interface Agenciador {
  id?: number
  pessoaId: number
  situacao: "Ativo" | "Desativo"
}

export const AgenciadorService = {
  async getAll(filters?: Record<string, any>) {
    const params = new URLSearchParams(filters).toString()
    return ApiClient.get(`/api/agenciadores${params ? `?${params}` : ""}`)
  },

  async getById(id: number) {
    return ApiClient.get(`/api/agenciadores/${id}`)
  },

  async create(data: Agenciador) {
    return ApiClient.post("/api/agenciadores", data)
  },

  async update(id: number, data: Partial<Agenciador>) {
    return ApiClient.put(`/api/agenciadores/${id}`, data)
  },

  async delete(id: number) {
    return ApiClient.delete(`/api/agenciadores/${id}`)
  },
}
