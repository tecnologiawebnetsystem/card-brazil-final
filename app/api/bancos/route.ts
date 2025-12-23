import { type NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase-server"

export async function GET(request: NextRequest) {
  try {
    const supabase = createServerClient()
    const searchParams = request.nextUrl.searchParams
    const search = searchParams.get("search") || ""
    const tipo = searchParams.get("tipo") || ""
    const status = searchParams.get("status") || "Ativo"

    let query = supabase.from("bancos").select("*").eq("ativo", true).order("codigo", { ascending: true })

    if (status) {
      query = query.eq("status", status)
    }

    if (tipo) {
      query = query.eq("tipo", tipo)
    }

    if (search) {
      query = query.or(`codigo.ilike.%${search}%,nome.ilike.%${search}%,nome_curto.ilike.%${search}%`)
    }

    const { data, error } = await query

    if (error) throw error

    return NextResponse.json(data)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = createServerClient()
    const body = await request.json()

    const { data, error } = await supabase.from("bancos").insert([body]).select().single()

    if (error) throw error

    return NextResponse.json(data, { status: 201 })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
