import { query, transaction } from "@/lib/database"

export const pessoaProjection = `
  p.*,
  pf.cpf AS cpf,
  pf.rg AS rg,
  pf.data_nascimento AS data_nascimento,
  pf.sexo AS sexo,
  pf.estado_civil AS estado_civil,
  pf.nome_mae AS nome_mae,
  pf.nome_pai AS nome_pai,
  pf.profissao AS profissao,
  pf.renda_mensal AS renda_mensal,
  pj.cnpj AS cnpj,
  pj.razao_social AS razao_social,
  pj.nome_fantasia AS nome_fantasia,
  pj.inscricao_estadual AS inscricao_estadual,
  pj.inscricao_municipal AS inscricao_municipal,
  pj.data_fundacao AS data_fundacao,
  COALESCE(pf.nome_mae, '') AS fisica_nome_mae,
  COALESCE(pj.razao_social, pj.nome_fantasia, '') AS nome_exibicao
`

export async function listPessoas(administradoraId: number, filters: { tipo?: string | null; status?: string | null; search?: string | null } = {}) {
  const conditions = ["p.administradora_id = $1", "p.deleted_at IS NULL"]
  const params: unknown[] = [administradoraId]
  if (filters.tipo) { params.push(filters.tipo); conditions.push(`p.tipo_pessoa = $${params.length}`) }
  if (filters.status) { params.push(filters.status); conditions.push(`p.status = $${params.length}`) }
  if (filters.search) {
    params.push(`%${filters.search}%`)
    conditions.push(`(p.nome_completo ILIKE $${params.length} OR pj.razao_social ILIKE $${params.length} OR pj.nome_fantasia ILIKE $${params.length} OR pf.cpf ILIKE $${params.length} OR pj.cnpj ILIKE $${params.length} OR p.email ILIKE $${params.length} OR p.telefone_principal ILIKE $${params.length} OR p.telefone_secundario ILIKE $${params.length})`)
  }
  return query(`SELECT ${pessoaProjection} FROM pessoas p LEFT JOIN pessoas_fisicas pf ON pf.pessoa_id = p.id LEFT JOIN pessoas_juridicas pj ON pj.pessoa_id = p.id WHERE ${conditions.join(" AND ")} ORDER BY p.created_at DESC NULLS LAST`, params)
}

export async function getPessoa(id: number, administradoraId: number) {
  const rows = await query(`SELECT ${pessoaProjection} FROM pessoas p LEFT JOIN pessoas_fisicas pf ON pf.pessoa_id = p.id LEFT JOIN pessoas_juridicas pj ON pj.pessoa_id = p.id WHERE p.id = $1 AND p.administradora_id = $2 AND p.deleted_at IS NULL`, [id, administradoraId])
  return rows[0] || null
}

export async function getPessoaByDocumento(documento: string) {
  const rows = await query(`SELECT ${pessoaProjection}, COALESCE((SELECT json_agg(e ORDER BY e.id) FROM enderecos e WHERE e.pessoa_id = p.id), '[]'::json) AS enderecos, COALESCE((SELECT json_agg(b ORDER BY b.id) FROM dados_bancarios b WHERE b.pessoa_id = p.id), '[]'::json) AS dados_bancarios FROM pessoas p LEFT JOIN pessoas_fisicas pf ON pf.pessoa_id = p.id LEFT JOIN pessoas_juridicas pj ON pj.pessoa_id = p.id WHERE p.deleted_at IS NULL AND (regexp_replace(COALESCE(pf.cpf, ''), '\\D', '', 'g') = $1 OR regexp_replace(COALESCE(pj.cnpj, ''), '\\D', '', 'g') = $1) LIMIT 1`, [documento])
  return rows[0] || null
}

export async function createPessoa(administradoraId: number, pessoa: Record<string, any>) {
  const rows = await transaction([
    { text: `INSERT INTO pessoas (administradora_id, tipo_pessoa, nome_completo, email, telefone_principal, telefone_secundario, telefone_comercial, foto_url, observacoes, status) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) RETURNING id`, params: [administradoraId, pessoa.tipo_pessoa, pessoa.nome_completo || null, pessoa.email || null, pessoa.telefone_principal || null, pessoa.telefone_secundario || null, pessoa.telefone_comercial || null, pessoa.foto_url || null, pessoa.observacoes || null, pessoa.status || "ativo"] },
  ])
  const id = Number((rows[0] as any[])[0].id)
  await savePessoaDetalhe(id, pessoa)
  return getPessoa(id, administradoraId)
}

export async function savePessoaDetalhe(id: number, pessoa: Record<string, any>) {
  const tipo = pessoa.tipo_pessoa ?? (await query(`SELECT tipo_pessoa FROM pessoas WHERE id = $1`, [id]))[0]?.tipo_pessoa
  if (tipo === "fisica") {
    await transaction([
      { text: `INSERT INTO pessoas_fisicas (pessoa_id, cpf, rg, data_nascimento, sexo, estado_civil, nome_mae, nome_pai, profissao, renda_mensal) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) ON CONFLICT (pessoa_id) DO UPDATE SET cpf=EXCLUDED.cpf, rg=EXCLUDED.rg, data_nascimento=EXCLUDED.data_nascimento, sexo=EXCLUDED.sexo, estado_civil=EXCLUDED.estado_civil, nome_mae=EXCLUDED.nome_mae, nome_pai=EXCLUDED.nome_pai, profissao=EXCLUDED.profissao, renda_mensal=EXCLUDED.renda_mensal, updated_at=CURRENT_TIMESTAMP`, params: [id, pessoa.cpf || null, pessoa.rg || null, pessoa.data_nascimento || null, pessoa.sexo || null, pessoa.estado_civil || null, pessoa.nome_mae || null, pessoa.nome_pai || null, pessoa.profissao || null, pessoa.renda_mensal || null] },
      { text: `DELETE FROM pessoas_juridicas WHERE pessoa_id = $1`, params: [id] },
    ])
  } else if (tipo === "juridica") {
    await transaction([
      { text: `INSERT INTO pessoas_juridicas (pessoa_id, cnpj, razao_social, nome_fantasia, inscricao_estadual, inscricao_municipal, data_fundacao) VALUES ($1,$2,$3,$4,$5,$6,$7) ON CONFLICT (pessoa_id) DO UPDATE SET cnpj=EXCLUDED.cnpj, razao_social=EXCLUDED.razao_social, nome_fantasia=EXCLUDED.nome_fantasia, inscricao_estadual=EXCLUDED.inscricao_estadual, inscricao_municipal=EXCLUDED.inscricao_municipal, data_fundacao=EXCLUDED.data_fundacao, updated_at=CURRENT_TIMESTAMP`, params: [id, pessoa.cnpj || null, pessoa.razao_social || null, pessoa.nome_fantasia || null, pessoa.inscricao_estadual || null, pessoa.inscricao_municipal || null, pessoa.data_fundacao || null] },
      { text: `DELETE FROM pessoas_fisicas WHERE pessoa_id = $1`, params: [id] },
    ])
  }
}

