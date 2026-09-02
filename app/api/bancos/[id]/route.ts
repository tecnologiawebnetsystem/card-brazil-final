import { type NextRequest, NextResponse } from "next/server"
import { CrudService } from "@/lib/crud-service"

const service = new CrudService("bancos")
export async function GET(_: NextRequest, { params }: { params: { id: string } }) { try { const row = await service.findById(Number.parseInt(params.id, 10)); return row ? NextResponse.json(row) : NextResponse.json({ error: "Banco não encontrado" }, { status: 404 }) } catch (error: any) { return NextResponse.json({ error: error.message }, { status: 500 }) } }
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) { try { const updated = await service.update(Number.parseInt(params.id, 10), await request.json()); return updated ? NextResponse.json(updated) : NextResponse.json({ error: "Banco não encontrado" }, { status: 404 }) } catch (error: any) { return NextResponse.json({ error: error.message }, { status: 500 }) } }
export async function DELETE(_: NextRequest, { params }: { params: { id: string } }) { try { const deleted = await service.delete(Number.parseInt(params.id, 10)); return deleted ? NextResponse.json({ message: "Banco excluído com sucesso" }) : NextResponse.json({ error: "Banco não encontrado" }, { status: 404 }) } catch (error: any) { return NextResponse.json({ error: error.message }, { status: 500 }) } }
