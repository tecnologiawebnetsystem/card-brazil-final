import { type NextRequest, NextResponse } from "next/server"
import { query } from "@/lib/database"

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const search = searchParams.get("search") || ""
  const tipo = searchParams.get("tipo") || ""
  const ano = searchParams.get("ano") || new Date().getFullYear().toString()
  const uf = searchParams.get("uf") || ""

  try {
    const params: unknown[] = [true, `${ano}-01-01`, `${ano}-12-31`]
    const conditions = ["ativo = $1", "data >= $2", "data <= $3"]
    if (tipo) { params.push(tipo); conditions.push(`tipo = $${params.length}`) }
    if (uf) { params.push(uf); conditions.push(`(uf = $${params.length} OR tipo = 'Nacional')`) }
    if (search) { params.push(`%${search}%`); conditions.push(`nome ILIKE $${params.length}`) }
    const data = await query(`SELECT * FROM feriados WHERE ${conditions.join(" AND ")} ORDER BY data ASC`, params)
    return NextResponse.json(data)
  } catch (error: any) {
    const anoSeguro = Number(ano)
    if (Number.isInteger(anoSeguro) && anoSeguro >= 2000 && anoSeguro <= 2100) {
      const feriadosNacionais = [
        ["01-01", "Confraternização Universal"], ["04-21", "Tiradentes"], ["05-01", "Dia do Trabalho"],
        ["09-07", "Independência do Brasil"], ["10-12", "Nossa Senhora Aparecida"], ["11-02", "Finados"],
        ["11-15", "Proclamação da República"], ["11-20", "Dia da Consciência Negra"], ["12-25", "Natal"],
      ]
      const data = feriadosNacionais.map(([mesDia, nome], index) => ({ id: -(index + 1), data: `${ano}-${mesDia}`, nome, descricao: nome, tipo: "Nacional", uf: null, cidade: null, fixo: true, status: "Ativo", ativo: true }))
      return NextResponse.json(tipo ? data.filter((feriado) => feriado.tipo === tipo) : data)
    }
    return NextResponse.json({ error: "Não foi possível carregar os feriados" }, { status: 503 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    if (!body.data || !body.nome || !body.tipo) {
      return NextResponse.json({ error: "data, nome e tipo são obrigatórios" }, { status: 400 })
    }
    const rows = await query(`INSERT INTO feriados (administradora_id, data, nome, tipo, uf, cidade, fixo, descricao, status, ativo) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) RETURNING *`, [body.administradora_id || 1, body.data, body.nome, body.tipo, body.uf || null, body.cidade || null, body.fixo ?? true, body.descricao || null, body.status || "Ativo", body.ativo ?? true])
    return NextResponse.json(rows[0], { status: 201 })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
