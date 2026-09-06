import { type NextRequest, NextResponse } from "next/server"
import { CrudService } from "@/lib/crud-service"
import { successResponse, errorResponse, handleApiError } from "@/lib/api-response"

const service = new CrudService("administradoras")
const allowedFields = ["razao_social", "nome_fantasia", "cnpj", "inscricao_estadual", "inscricao_municipal", "email", "telefone", "site", "cor_primaria", "cor_secundaria", "logotipo_url", "status"]

export const dynamic = "force-dynamic"

export async function GET(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try { const row = await service.findById(Number.parseInt((await params).id, 10)); return row ? NextResponse.json(successResponse(row)) : NextResponse.json(errorResponse("Administradora não encontrada"), { status: 404 }) } catch (error) { return NextResponse.json(handleApiError(error), { status: 500 }) }
}
export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try { const id = Number.parseInt((await params).id, 10); const body = await request.json(); const data = Object.fromEntries(Object.entries(body).filter(([key]) => allowedFields.includes(key))); const updated = await service.update(id, data); return updated ? NextResponse.json(successResponse(updated, "Administradora atualizada com sucesso")) : NextResponse.json(errorResponse("Administradora não encontrada"), { status: 404 }) } catch (error) { return NextResponse.json(handleApiError(error), { status: 500 }) }
}
export async function DELETE(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try { const deleted = await service.delete(Number.parseInt((await params).id, 10)); return deleted ? NextResponse.json(successResponse(null, "Administradora excluída com sucesso")) : NextResponse.json(errorResponse("Administradora não encontrada"), { status: 404 }) } catch (error) { return NextResponse.json(handleApiError(error), { status: 500 }) }
}
