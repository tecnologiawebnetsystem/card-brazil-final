import { query, transaction } from "@/lib/database"

export const pessoaProjection = `
  p.*,
  pf.cpf AS fisica_cpf,
  pf.rg AS fisica_rg,
  pf.data_nascimento AS fisica_data_nascimento,
  pf.sexo AS fisica_sexo,
  pf.estado_civil AS fisica_estado_civil,
  pf.nome_mae AS fisica_nome_mae,
  pf.nome_pai AS fisica_nome_pai,
  pf.profissao AS fisica_profissao,
  pf.renda_mensal AS fisica_renda_mensal,
  pj.cnpj AS juridica_cnpj,
  pj.razao_social AS juridica_razao_social,
  pj.nome_fantasia AS juridica_nome_fantasia,
  COALESCE(pf.cpf, p.cpf) AS cpf,
  COALESCE(pf.rg, p.rg) AS rg,
  COALESCE(pf.data_nascimento, p.data_nascimento) AS data_nascimento,
  COALESCE(pf.sexo, p.sexo) AS sexo,
  COALESCE(pf.estado_civil, p.estado_civil) AS estado_civil,
  COALESCE(pf.nome_mae, p.nome_mae) AS nome_mae,
  COALESCE(pf.nome_pai, p.nome_pai) AS nome_pai,
  COALESCE(pf.profissao, p.profissao) AS profissao,
  COALESCE(pj.cnpj, p.cnpj) AS cnpj,
  COALESCE(pj.razao_social, p.razao_social) AS razao_social,
  COALESCE(pj.nome_fantasia, p.nome_fantasia) AS nome_fantasia,
  COALESCE(pj.inscricao_estadual, '') AS inscricao_estadual,
  COALESCE(pj.data_fundacao, NULL) AS data_fundacao,
  COALESCE(p.nome_completo, pj.razao_social, pj.nome_fantasia, '') AS nome_exibicao
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

export async function createPessoa(administradoraId: number, pessoa: Record<string, any>) {
  const rows = await transaction([
    { text: `INSERT INTO pessoas (administradora_id, tipo_pessoa, nome_completo, email, telefone_principal, telefone_secundario, observacoes, status, cpf, rg, data_nascimento, sexo, estado_civil, nome_mae, nome_pai, profissao, razao_social, nome_fantasia, cnpj) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19) RETURNING id`, params: [administradoraId, pessoa.tipo_pessoa, pessoa.nome_completo || null, pessoa.email || null, pessoa.telefone_principal || null, pessoa.telefone_secundario || null, pessoa.observacoes || null, pessoa.status || "ativo", pessoa.cpf || null, pessoa.rg || null, pessoa.data_nascimento || null, pessoa.sexo || null, pessoa.estado_civil || null, pessoa.nome_mae || null, pessoa.nome_pai || null, pessoa.profissao || null, pessoa.razao_social || null, pessoa.nome_fantasia || null, pessoa.cnpj || null] },
  ])
  const id = Number((rows[0] as any[])[0].id)
  await savePessoaDetalhe(id, pessoa)
  return getPessoa(id, administradoraId)
}

export async function savePessoaDetalhe(id: number, pessoa: Record<string, any>) {
  if (pessoa.tipo_pessoa === "fisica") {
    await transaction([
      { text: `INSERT INTO pessoas_fisicas (pessoa_id, cpf, rg, data_nascimento, sexo, estado_civil, nome_mae, nome_pai, profissao, renda_mensal) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10) ON CONFLICT (pessoa_id) DO UPDATE SET cpf=EXCLUDED.cpf, rg=EXCLUDED.rg, data_nascimento=EXCLUDED.data_nascimento, sexo=EXCLUDED.sexo, estado_civil=EXCLUDED.estado_civil, nome_mae=EXCLUDED.nome_mae, nome_pai=EXCLUDED.nome_pai, profissao=EXCLUDED.profissao, renda_mensal=EXCLUDED.renda_mensal, updated_at=CURRENT_TIMESTAMP`, params: [id, pessoa.cpf || null, pessoa.rg || null, pessoa.data_nascimento || null, pessoa.sexo || null, pessoa.estado_civil || null, pessoa.nome_mae || null, pessoa.nome_pai || null, pessoa.profissao || null, pessoa.renda_mensal || null] },
      { text: `DELETE FROM pessoas_juridicas WHERE pessoa_id = $1`, params: [id] },
    ])
  } else {
    await transaction([
      { text: `INSERT INTO pessoas_juridicas (pessoa_id, cnpj, razao_social, nome_fantasia, inscricao_estadual, inscricao_municipal, data_fundacao) VALUES ($1,$2,$3,$4,$5,$6,$7) ON CONFLICT (pessoa_id) DO UPDATE SET cnpj=EXCLUDED.cnpj, razao_social=EXCLUDED.razao_social, nome_fantasia=EXCLUDED.nome_fantasia, inscricao_estadual=EXCLUDED.inscricao_estadual, inscricao_municipal=EXCLUDED.inscricao_municipal, data_fundacao=EXCLUDED.data_fundacao, updated_at=CURRENT_TIMESTAMP`, params: [id, pessoa.cnpj || null, pessoa.razao_social || null, pessoa.nome_fantasia || null, pessoa.inscricao_estadual || null, pessoa.inscricao_municipal || null, pessoa.data_fundacao || null] },
      { text: `DELETE FROM pessoas_fisicas WHERE pessoa_id = $1`, params: [id] },
    ])
  }
}

export async function backfillPessoaDetalhe() {
  await query(`INSERT INTO pessoas_fisicas (pessoa_id, cpf, rg, data_nascimento, sexo, estado_civil, nome_mae, nome_pai, profissao) SELECT id, cpf, rg, data_nascimento, sexo, estado_civil, nome_mae, nome_pai, profissao FROM pessoas WHERE tipo_pessoa = 'fisica' ON CONFLICT (pessoa_id) DO NOTHING`)
  await query(`INSERT INTO pessoas_juridicas (pessoa_id, cnpj, razao_social, nome_fantasia) SELECT id, cnpj, razao_social, nome_fantasia FROM pessoas WHERE tipo_pessoa = 'juridica' ON CONFLICT (pessoa_id) DO NOTHING`)
}
