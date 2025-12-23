import { type NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase-server"

// API do Banco Central para consultar bancos
// https://brasilapi.com.br/api/banks/v1
export async function POST(request: NextRequest) {
  try {
    const supabase = createServerClient()

    // Buscar dados dos bancos da API Brasil API
    const response = await fetch("https://brasilapi.com.br/api/banks/v1")

    if (!response.ok) {
      throw new Error("Erro ao buscar dados do Bacen")
    }

    const bancos = await response.json()

    // Obter id_administradora do usuário logado
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) throw new Error("Usuário não autenticado")

    const { data: userData } = await supabase.from("usuarios").select("id_administradora").eq("id", user.id).single()

    if (!userData) throw new Error("Usuário não encontrado")

    const id_administradora = userData.id_administradora

    // Preparar dados para inserção
    const bancosParaInserir = bancos.map((banco: any) => ({
      id_administradora,
      codigo: banco.code?.toString().padStart(3, "0") || "",
      nome: banco.fullName || banco.name || "",
      nome_curto: banco.name || "",
      cnpj: banco.document || null,
      status: "Ativo",
    }))

    // Inserir ou atualizar bancos (upsert)
    const { data, error } = await supabase
      .from("bancos")
      .upsert(bancosParaInserir, {
        onConflict: "id_administradora,codigo",
        ignoreDuplicates: false,
      })
      .select()

    if (error) throw error

    return NextResponse.json({
      message: `${bancosParaInserir.length} bancos atualizados com sucesso`,
      total: bancosParaInserir.length,
    })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
