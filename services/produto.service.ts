import { ApiClient } from "@/lib/api-client"

export interface Produto {
  id?: number
  nome: string
  descricao?: string
  situacao: "Ativo" | "Desativo"
}

export const ProdutoService = {
  async getAll(filters?: Record<string, any>) {
    const params = new URLSearchParams(filters).toString()
    return ApiClient.get(`/api/produtos${params ? `?${params}` : ""}`)
  },

  async getById(id: number) {
    return ApiClient.get(`/api/produtos/${id}`)
  },

  async create(data: Produto) {
    return ApiClient.post("/api/produtos", data)
  },

  async update(id: number, data: Partial<Produto>) {
    return ApiClient.put(`/api/produtos/${id}`, data)
  },

  async delete(id: number) {
    return ApiClient.delete(`/api/produtos/${id}`)
  },
}
