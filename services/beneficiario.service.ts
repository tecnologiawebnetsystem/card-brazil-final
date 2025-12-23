import { ApiClient } from "@/lib/api-client"

export interface Beneficiario {
  id?: number
  pessoaId: number
  contratoId: number
  numeroCarteirinha?: string
  situacao: "Ativo" | "Desativo"
}

export const BeneficiarioService = {
  async getAll(filters?: Record<string, any>) {
    const params = new URLSearchParams(filters).toString()
    return ApiClient.get(`/api/beneficiarios${params ? `?${params}` : ""}`)
  },

  async getById(id: number) {
    return ApiClient.get(`/api/beneficiarios/${id}`)
  },

  async create(data: Beneficiario) {
    return ApiClient.post("/api/beneficiarios", data)
  },

  async update(id: number, data: Partial<Beneficiario>) {
    return ApiClient.put(`/api/beneficiarios/${id}`, data)
  },

  async delete(id: number) {
    return ApiClient.delete(`/api/beneficiarios/${id}`)
  },
}
