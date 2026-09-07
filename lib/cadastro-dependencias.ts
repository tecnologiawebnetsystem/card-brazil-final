import { query } from "@/lib/database"

export type DependenciaCadastro = {
  pessoa_id?: number | string | null
}

export async function validarDependenciasCadastro(pessoaId: DependenciaCadastro["pessoa_id"]) {
  const id = Number(pessoaId)
  if (!Number.isInteger(id) || id <= 0) {
    return { ok: false as const, message: "Cadastre primeiro uma pessoa válida." }
  }

  const pessoa = await query<{ id: number; status: string }>(
    "SELECT id, status FROM pessoas WHERE id = $1 AND deleted_at IS NULL",
    [id],
  )
  if (!pessoa[0]) {
    return { ok: false as const, message: "A pessoa selecionada não existe ou foi excluída." }
  }
  if (String(pessoa[0].status).toLowerCase() !== "ativo") {
    return { ok: false as const, message: "A pessoa selecionada está inativa. Ative-a antes de continuar." }
  }

  const [endereco, conta] = await Promise.all([
    query<{ id: number }>(
      "SELECT id FROM enderecos WHERE pessoa_id = $1 LIMIT 1",
      [id],
    ),
    query<{ id: number }>(
      "SELECT id FROM dados_bancarios WHERE pessoa_id = $1 LIMIT 1",
      [id],
    ),
  ])

  if (!endereco[0] || !conta[0]) {
    const faltantes = [
      !endereco[0] ? "endereço" : null,
      !conta[0] ? "conta bancária" : null,
    ].filter(Boolean)
    return {
      ok: false as const,
      message: `Cadastre ${faltantes.join(" e ")} para esta pessoa antes de cadastrar este registro.`,
    }
  }

  return { ok: true as const, pessoaId: id }
}

export async function exigirDependenciasCadastro(pessoaId: DependenciaCadastro["pessoa_id"]) {
  const resultado = await validarDependenciasCadastro(pessoaId)
  if (!resultado.ok) throw new Error(resultado.message)
  return resultado.pessoaId
}
