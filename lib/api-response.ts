import { NextResponse } from "next/server"

export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  message?: string
  error?: string
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

export function handleApiError(error: any): ApiResponse {
  console.error("[API Error]", error)

  if (error.code === "ER_DUP_ENTRY") {
    return errorResponse("Registro duplicado. Verifique os dados únicos como CPF, CNPJ ou código.")
  }

  if (error.code === "ER_NO_REFERENCED_ROW_2") {
    return errorResponse("Referência inválida. Verifique se os dados relacionados existem.")
  }

  return errorResponse(error.message || "Erro interno do servidor")
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

export function apiError(error: string, status = 500, errors?: Record<string, string[]>): NextResponse {
  return NextResponse.json(
    {
      success: false,
      error,
      errors,
    },
    { status },
  )
}
