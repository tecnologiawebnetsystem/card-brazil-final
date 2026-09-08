import useSWR from "swr"
import { apiFetch, apiMutation } from "@/lib/api-client"

const fetcher = <T,>(url: string) => apiFetch<T>(url)

export function usePessoas() {
  const { data, error, isLoading, mutate } = useSWR("/api/pessoas", fetcher)

  return {
    pessoas: data || [],
    isLoading,
    isError: error,
    mutate,
  }
}

export function usePessoa(id: string | number) {
  const { data, error, isLoading, mutate } = useSWR(id ? `/api/pessoas/${id}` : null, fetcher)

  return {
    pessoa: data,
    isLoading,
    isError: error,
    mutate,
  }
}

export function createPessoa(data: unknown) {
  return apiMutation("/api/pessoas", "POST", data)
}

export function updatePessoa(id: number, data: unknown) {
  return apiMutation(`/api/pessoas/${id}`, "PUT", data)
}

export function deletePessoa(id: number) {
  return apiMutation(`/api/pessoas/${id}`, "DELETE")
}
