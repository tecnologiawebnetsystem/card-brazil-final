import { query } from "@/back-end/lib/database"

export type DependenciaCadastro = {
  pessoa_id?: number | string | null
}

export async function validarDependenciasCadastro(pessoaId: DependenciaCadastro["pessoa_id"], administradoraId: number) {
  const id = Number(pessoaId)
  if (!Number.isInteger(id) || id <= 0) {
    return { ok: false as const, message: "Cadastre primeiro uma pessoa válida." }
  }

  const pessoa = await query<{ id: number; status: string }>(
    "SELECT id, status FROM pessoas WHERE id = $1 AND administradora_id = $2 AND deleted_at IS NULL",
    [id, administradoraId],
  )
  if (!pessoa[0]) {
    return { ok: false as const, message: "A pessoa selecionada não existe ou foi excluída." }
  }
  if (String(pessoa[0].status).toLowerCase() !== "ativo") {
    return { ok: false as const, message: "A pessoa selecionada está inativa. Ative-a antes de continuar." }
  }

  return { ok: true as const, pessoaId: id }
}

export async function exigirDependenciasCadastro(pessoaId: DependenciaCadastro["pessoa_id"], administradoraId: number) {
  const resultado = await validarDependenciasCadastro(pessoaId, administradoraId)
  if (!resultado.ok) throw new Error(resultado.message)
  return resultado.pessoaId
}
