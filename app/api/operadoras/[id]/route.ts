import { type NextRequest, NextResponse } from "next/server"
import { CrudService } from "@/lib/crud-service"
import { successResponse, errorResponse, handleApiError } from "@/lib/api-response"

const service = new CrudService("operadoras")
export async function GET(_: NextRequest, { params }: { params: { id: string } }) { try { const row = await service.findById(Number.parseInt(params.id, 10)); return row ? NextResponse.json(successResponse(row)) : NextResponse.json(errorResponse("Operadora não encontrada"), { status: 404 }) } catch (error) { return NextResponse.json(handleApiError(error), { status: 500 }) } }
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) { try { const updated = await service.update(Number.parseInt(params.id, 10), await request.json()); return updated ? NextResponse.json(successResponse(updated, "Operadora atualizada com sucesso")) : NextResponse.json(errorResponse("Operadora não encontrada"), { status: 404 }) } catch (error) { return NextResponse.json(handleApiError(error), { status: 500 }) } }
export async function DELETE(_: NextRequest, { params }: { params: { id: string } }) { try { const deleted = await service.delete(Number.parseInt(params.id, 10)); return deleted ? NextResponse.json(successResponse(null, "Operadora excluída com sucesso")) : NextResponse.json(errorResponse("Operadora não encontrada"), { status: 404 }) } catch (error) { return NextResponse.json(handleApiError(error), { status: 500 }) } }
