import { type NextRequest, NextResponse } from "next/server"
import { mockBancos, findMockById } from "@/lib/mock-data"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const banco = findMockById(mockBancos, Number.parseInt(params.id))

    if (!banco) {
      return NextResponse.json({ error: "Banco não encontrado" }, { status: 404 })
    }

    return NextResponse.json(banco)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await request.json()
    const banco = findMockById(mockBancos, Number.parseInt(params.id))

    if (!banco) {
      return NextResponse.json({ error: "Banco não encontrado" }, { status: 404 })
    }

    const updated = { ...banco, ...body, updated_at: new Date().toISOString() }
    return NextResponse.json(updated)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const banco = findMockById(mockBancos, Number.parseInt(params.id))

    if (!banco) {
      return NextResponse.json({ error: "Banco não encontrado" }, { status: 404 })
    }

    return NextResponse.json({ message: "Banco excluído com sucesso" })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
