export const COBRANCA_STATUSES = [
  "pendente",
  "em_cobranca",
  "paga",
  "encerrada",
] as const

export type CobrancaStatus = (typeof COBRANCA_STATUSES)[number]

const transitions: Record<CobrancaStatus, readonly CobrancaStatus[]> = {
  pendente: ["em_cobranca", "encerrada"],
  em_cobranca: ["paga", "encerrada"],
  paga: ["encerrada"],
  encerrada: [],
}

export function isCobrancaStatus(value: unknown): value is CobrancaStatus {
  return typeof value === "string" && COBRANCA_STATUSES.includes(value as CobrancaStatus)
}

export function canTransitionCobranca(from: CobrancaStatus, to: CobrancaStatus) {
  return from === to || transitions[from].includes(to)
}

export function allowedCobrancaTransitions(from: CobrancaStatus) {
  return transitions[from]
}

export function statusLabel(status: CobrancaStatus) {
  return {
    pendente: "Pendente",
    em_cobranca: "Em cobrança",
    paga: "Paga",
    encerrada: "Encerrada",
  }[status]
}

export function parseMoney(value: unknown) {
  const amount = typeof value === "number" ? value : Number(value)
  return Number.isFinite(amount) ? Math.round(amount * 100) / 100 : null
}
