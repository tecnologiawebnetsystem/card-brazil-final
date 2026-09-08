import { z } from "zod"

const documento = z.string().trim().min(1).max(30).optional().nullable()

const pessoaFields = {
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
}

export const pessoaSchema = z.object(pessoaFields).superRefine((value, ctx) => {
  if (value.tipo_pessoa === "fisica" && !value.nome_completo) ctx.addIssue({ code: "custom", path: ["nome_completo"], message: "Nome completo é obrigatório" })
  if (value.tipo_pessoa === "juridica" && !value.razao_social) ctx.addIssue({ code: "custom", path: ["razao_social"], message: "Razão social é obrigatória" })
})

export const pessoaUpdateSchema = z.object(pessoaFields).partial()

export const idSchema = z.coerce.number().int().positive()

const cadastroStatus = z.enum(["ativo", "inativo", "suspenso"]).default("ativo")
const optionalText = (max: number) => z.string().trim().max(max).optional().nullable()

export const papelCadastroSchema = z.object({
  pessoa_id: idSchema,
  nome: optionalText(180),
  registro_ans: optionalText(60),
  registro_susep: optionalText(60),
  codigo: optionalText(60),
  codigo_ans: optionalText(60),
  tipo_plano: optionalText(80),
  operadora_id: idSchema.optional(),
  plano_id: idSchema.optional(),
  valor_base: z.coerce.number().nonnegative().optional().nullable(),
  valor_mensalidade: z.coerce.number().nonnegative().optional().nullable(),
  idade_minima: z.coerce.number().int().min(0).max(150).optional().nullable(),
  idade_maxima: z.coerce.number().int().min(0).max(150).optional().nullable(),
  descricao: optionalText(4000),
  status: cadastroStatus,
})

export const planoSchema = papelCadastroSchema.extend({
  operadora_id: idSchema,
  nome: z.string().trim().min(2).max(180),
  tipo_plano: z.string().trim().min(2).max(80),
})

export const produtoSchema = papelCadastroSchema.extend({
  plano_id: idSchema,
  nome: z.string().trim().min(2).max(180),
})

export function zodFieldErrors(error: z.ZodError) {
  return error.flatten().fieldErrors as Record<string, string[]>
}
