import { z } from "zod"

function somenteDigitos(value: string) {
  return value.replace(/\\D/g, "")
}

function validarCpf(value: string) {
  const cpf = somenteDigitos(value)
  if (cpf.length !== 11 || /^([0-9])\\1+$/.test(cpf)) return false
  let total = 0
  for (let i = 0; i < 9; i++) total += Number(cpf[i]) * (10 - i)
  let resto = (total * 10) % 11
  if (resto === 10) resto = 0
  if (resto !== Number(cpf[9])) return false
  total = 0
  for (let i = 0; i < 10; i++) total += Number(cpf[i]) * (11 - i)
  resto = (total * 10) % 11
  if (resto === 10) resto = 0
  return resto === Number(cpf[10])
}

function validarCnpj(value: string) {
  const cnpj = somenteDigitos(value)
  if (cnpj.length !== 14 || /^([0-9])\\1+$/.test(cnpj)) return false
  const calcular = (length: number) => {
    let total = 0
    let peso = length - 7
    for (let i = 0; i < length; i++) {
      total += Number(cnpj[i]) * peso--
      if (peso < 2) peso = 9
    }
    const resto = total % 11
    return resto < 2 ? 0 : 11 - resto
  }
  return calcular(12) === Number(cnpj[12]) && calcular(13) === Number(cnpj[13])
}

const documento = z.string().trim().min(1).max(30).optional().nullable()
const cpfSchema = documento.refine((value) => !value || validarCpf(value), "CPF inválido")
const cnpjSchema = documento.refine((value) => !value || validarCnpj(value), "CNPJ inválido")

const pessoaFields = {
  tipo_pessoa: z.enum(["fisica", "juridica"]),
  nome_completo: z.string().trim().min(2).max(180).optional().nullable(),
  razao_social: z.string().trim().min(2).max(180).optional().nullable(),
  nome_fantasia: z.string().trim().max(180).optional().nullable(),
  cpf: cpfSchema,
  cnpj: cnpjSchema,
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

export const beneficiarioSchema = z.object({
  pessoa_id: idSchema,
  contrato_id: idSchema,
  plano_id: idSchema,
  numero_carteirinha: z.string().trim().min(1).max(80),
  tipo_beneficiario: z.enum(["titular", "dependente"]),
  titular_id: idSchema.optional().nullable(),
  data_inclusao: z.coerce.date(),
  valor_mensalidade: z.coerce.number().nonnegative().optional().nullable(),
  status: cadastroStatus,
}).superRefine((value, ctx) => {
  if (value.tipo_beneficiario === "dependente" && !value.titular_id) {
    ctx.addIssue({ code: "custom", path: ["titular_id"], message: "Titular é obrigatório para dependente" })
  }
})

export const propostaSchema = z.object({
  nome_proponente: z.string().trim().min(2).max(180),
  cpf_cnpj: z.string().trim().min(11).max(18).refine((value) => validarCpf(value) || validarCnpj(value), "CPF ou CNPJ inválido"),
  tipo_plano: z.string().trim().min(2).max(80),
  email: z.string().trim().email("E-mail inválido").optional().nullable(),
  telefone: z.string().trim().max(30).optional().nullable(),
  empresa: z.string().trim().max(180).optional().nullable(),
  numero_funcionarios: z.coerce.number().int().nonnegative().optional().nullable(),
  valor_proposto: z.coerce.number().nonnegative().optional().nullable(),
  observacoes: z.string().trim().max(4000).optional().nullable(),
})

export const produtoSchema = papelCadastroSchema.extend({
  plano_id: idSchema.optional().nullable(),
  nome: z.string().trim().min(2).max(180),
})

export function zodFieldErrors(error: z.ZodError) {
  return error.flatten().fieldErrors as Record<string, string[]>
}
