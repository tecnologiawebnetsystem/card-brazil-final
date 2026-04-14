import { type NextRequest, NextResponse } from "next/server"
import { successResponse, errorResponse } from "@/lib/api-response"
import { mockAdministradoras, findMockById } from "@/lib/mock-data"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const administradora = findMockById(mockAdministradoras, Number.parseInt(params.id))

    if (!administradora) {
      return NextResponse.json(errorResponse("Administradora não encontrada"), { status: 404 })
    }

    return NextResponse.json(successResponse(administradora))
  } catch (error) {
    return NextResponse.json({ success: false, message: "Erro interno" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await request.json()
    const id = Number.parseInt(params.id)
    const administradora = findMockById(mockAdministradoras, id)

    if (!administradora) {
      return NextResponse.json(errorResponse("Administradora não encontrada"), { status: 404 })
    }

    const updated = { ...administradora, ...body, updated_at: new Date().toISOString() }
    return NextResponse.json(successResponse(updated, "Administradora atualizada com sucesso"))
  } catch (error) {
    return NextResponse.json({ success: false, message: "Erro interno" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const administradora = findMockById(mockAdministradoras, Number.parseInt(params.id))

    if (!administradora) {
      return NextResponse.json(errorResponse("Administradora não encontrada"), { status: 404 })
    }

    return NextResponse.json(successResponse(null, "Administradora excluída com sucesso"))
  } catch (error) {
    return NextResponse.json({ success: false, message: "Erro interno" }, { status: 500 })
  }
}
