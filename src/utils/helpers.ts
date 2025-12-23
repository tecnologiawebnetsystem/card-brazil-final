// Funções auxiliares do projeto
export const formatDate = (date: Date): string => {
  return new Intl.DateTimeFormat("pt-BR").format(date)
}

export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value)
}
