import { ApiClient } from "@/lib/api-client"

export interface Corretor {
  id?: number
  pessoaId: number
  registroSusep: string
  situacao: "Ativo" | "Desativo"
}

export const CorretorService = {
  async getAll(filters?: Record<string, any>) {
    const params = new URLSearchParams(filters).toString()
    return ApiClient.get(`/api/corretores${params ? `?${params}` : ""}`)
  },

  async getById(id: number) {
    return ApiClient.get(`/api/corretores/${id}`)
  },

  async create(data: Corretor) {
    return ApiClient.post("/api/corretores", data)
  },

  async update(id: number, data: Partial<Corretor>) {
    return ApiClient.put(`/api/corretores/${id}`, data)
  },

  async delete(id: number) {
    return ApiClient.delete(`/api/corretores/${id}`)
  },
}
