import useSWR from "swr"

const fetcher = async (url: string) => {
  const res = await fetch(url)
  if (!res.ok) throw new Error("Falha ao carregar dados")
  return res.json()
}

export function usePessoas() {
  const { data, error, isLoading, mutate } = useSWR("/api/pessoas", fetcher)

  return {
    pessoas: data?.data || [],
    isLoading,
    isError: error,
    mutate,
  }
}

export function usePessoa(id: string | number) {
  const { data, error, isLoading, mutate } = useSWR(id ? `/api/pessoas/${id}` : null, fetcher)

  return {
    pessoa: data?.data,
    isLoading,
    isError: error,
    mutate,
  }
}

export async function createPessoa(data: any) {
  const res = await fetch("/api/pessoas", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  })

  if (!res.ok) {
    const error = await res.json()
    throw new Error(error.message || "Erro ao criar pessoa")
  }

  return res.json()
}

export async function updatePessoa(id: number, data: any) {
  const res = await fetch(`/api/pessoas/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  })

  if (!res.ok) {
    const error = await res.json()
    throw new Error(error.message || "Erro ao atualizar pessoa")
  }

  return res.json()
}

export async function deletePessoa(id: number) {
  const res = await fetch(`/api/pessoas/${id}`, {
    method: "DELETE",
  })

  if (!res.ok) {
    const error = await res.json()
    throw new Error(error.message || "Erro ao excluir pessoa")
  }

  return res.json()
}
