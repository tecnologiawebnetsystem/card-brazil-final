import { type NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase-server"

export async function GET(request: NextRequest) {
  try {
    const supabase = createServerClient()
    const searchParams = request.nextUrl.searchParams
    const search = searchParams.get("search") || ""
    const tipo = searchParams.get("tipo") || ""
    const ano = searchParams.get("ano") || new Date().getFullYear().toString()
    const uf = searchParams.get("uf") || ""

    let query = supabase
      .from("feriados")
      .select("*")
      .eq("ativo", true)
      .gte("data", `${ano}-01-01`)
      .lte("data", `${ano}-12-31`)
      .order("data", { ascending: true })

    if (tipo) {
      query = query.eq("tipo", tipo)
    }

    if (uf) {
      query = query.or(`uf.eq.${uf},tipo.eq.Nacional`)
    }

    if (search) {
      query = query.ilike("nome", `%${search}%`)
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

    const { data, error } = await supabase.from("feriados").insert([body]).select().single()

    if (error) throw error

    return NextResponse.json(data, { status: 201 })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
