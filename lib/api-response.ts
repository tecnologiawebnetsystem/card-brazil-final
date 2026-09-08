import { NextResponse } from "next/server"

export interface ApiResponse<T = unknown> {
  success: boolean
  data?: T
  message?: string
  error?: string
  code?: string
  errors?: Record<string, string[]>
}

export function successResponse<T>(data: T, message?: string): ApiResponse<T> {
  return {
    success: true,
    data,
    message,
  }
}

export function errorResponse(error: string, errors?: Record<string, string[]>): ApiResponse {
  return {
    success: false,
    error,
    errors,
  }
}

export function handleApiError(error: unknown): ApiResponse {
  console.error("[API Error]", error)
  const code = typeof error === "object" && error !== null && "code" in error ? String(error.code) : ""
  if (["23505", "ER_DUP_ENTRY"].includes(code)) return { success: false, error: "Registro duplicado. Verifique CPF, CNPJ ou código.", message: "Registro duplicado.", code: "CONFLICT" }
  if (["23503", "ER_NO_REFERENCED_ROW_2"].includes(code)) return { success: false, error: "Referência inválida. Verifique os dados relacionados.", message: "Referência inválida.", code: "REFERENCE_ERROR" }
  return { success: false, error: "Erro interno do servidor", message: "Não foi possível concluir a operação.", code: "INTERNAL_ERROR" }
}

export function apiResponse<T>(data: T, message?: string, status = 200): NextResponse {
  return NextResponse.json(
    {
      success: true,
      data,
      message,
    },
    { status },
  )
}

export function apiError(error: string, status = 500, errors?: Record<string, string[]>, code?: string): NextResponse {
  return NextResponse.json(
    {
      success: false,
      error,
      message: error,
      code: code ?? (status === 400 ? "VALIDATION_ERROR" : status === 401 ? "UNAUTHENTICATED" : status === 403 ? "FORBIDDEN" : status === 404 ? "NOT_FOUND" : status === 409 ? "CONFLICT" : "INTERNAL_ERROR"),
      errors,
    },
    { status },
  )
}
