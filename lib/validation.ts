import { z } from "zod"

const documento = z.string().trim().min(1).max(30).optional().nullable()

export const pessoaSchema = z.object({
  tipo_pessoa: z.enum(["fisica", "juridica"]),
  nome_completo: z.string().trim().min(2).max(180).optional().nullable(),
  razao_social: z.string().trim().min(2).max(180).optional().nullable(),
  nome_fantasia: z.string().trim().max(180).optional().nullable(),
  cpf: documento,
  cnpj: documento,
  email: z.string().trim().email("E-mail inválido").max(180).optional().nullable(),
  telefone_principal: z.string().trim().max(30).optional().nullable(),
  telefone_secundario: z.string().trim().max(30).optional().nullable(),
  data_nascimento: z.string().trim().optional().nullable(),
  sexo: z.string().trim().max(30).optional().nullable(),
  estado_civil: z.string().trim().max(40).optional().nullable(),
  rg: documento,
  nome_mae: z.string().trim().max(180).optional().nullable(),
  nome_pai: z.string().trim().max(180).optional().nullable(),
  profissao: z.string().trim().max(120).optional().nullable(),
  observacoes: z.string().trim().max(4000).optional().nullable(),
  status: z.enum(["ativo", "inativo", "suspenso"]).default("ativo"),
}).superRefine((value, ctx) => {
  if (value.tipo_pessoa === "fisica" && !value.nome_completo) ctx.addIssue({ code: "custom", path: ["nome_completo"], message: "Nome completo é obrigatório" })
  if (value.tipo_pessoa === "juridica" && !value.razao_social) ctx.addIssue({ code: "custom", path: ["razao_social"], message: "Razão social é obrigatória" })
})

export const idSchema = z.coerce.number().int().positive()

export function zodFieldErrors(error: z.ZodError) {
  return error.flatten().fieldErrors as Record<string, string[]>
}
