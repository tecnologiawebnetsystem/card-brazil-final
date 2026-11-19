import assert from "node:assert/strict"
import { readFile } from "node:fs/promises"
import test from "node:test"

const root = new URL("../../", import.meta.url)
const read = (path) => readFile(new URL(path, root), "utf8")

test("SQL Manager rejeita consultas e mutações arbitrárias depois da autorização", async () => {
  const queryRoute = await read("app/api/sql-manager/query/route.ts")
  const mutateRoute = await read("app/api/sql-manager/mutate/route.ts")
  const tablesRoute = await read("app/api/sql-manager/tables/route.ts")
  assert.match(queryRoute, /await requireSqlManagerAccess\(\)[\s\S]*?return unavailable\(\)/)
  assert.match(queryRoute, /Consultas SQL arbitrárias foram desabilitadas/)
  assert.doesNotMatch(queryRoute, /\bquery\s*\(/)
  assert.match(mutateRoute, /await requireSqlManagerAccess\(\)[\s\S]*?status: 501/)
  assert.doesNotMatch(mutateRoute, /\bquery\s*\(/)
  assert.match(tablesRoute, /await requireSqlManagerAccess\(\)[\s\S]*?status: 501/)
  assert.doesNotMatch(tablesRoute, /information_schema|pg_stat_user_tables|\bquery\s*\(/)
})

test("rotas de cobrança exigem autorização específica e escopo da administradora", async () => {
  const route = await read("app/api/cobranca/route.ts")
  assert.match(route, /cobranca\.view/)
  assert.match(route, /cobranca\.create/)
  assert.match(route, /cobranca\.edit/)
  assert.match(route, /administradora_id = \$1/)
  assert.match(route, /administradora_id = \$2/)
  assert.match(route, /contas_receber WHERE id = \$1 AND administradora_id = \$2/)
})

test("beneficiário novo valida pessoa, contrato, plano, administradora e titular", async () => {
  const route = await read("app/api/beneficiarios/route.ts")
  assert.match(route, /pessoas WHERE id = \$1 AND administradora_id = \$2 AND deleted_at IS NULL/)
  assert.match(route, /pl\.administradora_id = c\.administradora_id/)
  assert.match(route, /c\.administradora_id = \$3/)
  assert.match(route, /pl\.deleted_at IS NULL/)
  assert.match(route, /contrato_id = \$3 AND plano_id = \$4 AND tipo_beneficiario = 'titular'/)
})

test("edição de beneficiário mantém vínculo de contrato, plano e dependente no tenant", async () => {
  const route = await read("app/api/beneficiarios/[id]/route.ts")
  assert.match(route, /c\.id = \$1 AND c\.plano_id = \$2 AND c\.administradora_id = \$3/)
  assert.match(route, /SELECT id FROM beneficiarios WHERE id = \$1 AND administradora_id = \$2[\s\S]*?contrato_id = \$3 AND plano_id = \$4/)
  assert.match(route, /body\.status !== undefined && !\["ativo", "suspenso"\]\.includes\(body\.status\)/)
  assert.match(route, /Data de exclusão só pode ser registrada pelo fluxo/)
  const deleteHandler = route.slice(route.indexOf("export async function DELETE"))
  assert.match(deleteHandler, /requireCadastroAccess\("delete"\)/)
  assert.match(deleteHandler, /status: 501/)
  assert.doesNotMatch(deleteHandler, /UPDATE beneficiarios|query\(/)
  assert.doesNotMatch(route, /recordCadastroAudit\(/)
})

test("PUT de proposta bloqueia campos internos e limita transições com atualização tenant-scoped atômica", async () => {
  const approval = await read("app/api/propostas/aprovar/route.ts")
  const detail = await read("app/api/propostas/[id]/route.ts")
  assert.match(approval, /status: 501/)
  assert.match(detail, /const EDITABLE_PROPOSAL_FIELDS = new Set\(/)
  assert.match(detail, /receivedFields\.filter\(\(field\) => !EDITABLE_PROPOSAL_FIELDS\.has\(field\)\)/)
  const editableFields = detail.slice(detail.indexOf("const EDITABLE_PROPOSAL_FIELDS"), detail.indexOf("const ALLOWED_STATUS_TRANSITIONS"))
  for (const reserved of ["contrato_gerado", "aprovado", "data_aprovacao", "parecer_analise", "analisado_por", "data_analise", "score_financeiro", "score_documentacao", "score_historico", "numero_contrato", "data_contrato"]) {
    assert.doesNotMatch(editableFields, new RegExp(`\\"${reserved}\\"`))
  }
  assert.doesNotMatch(editableFields, /"aprovada"|"rejeitada"/)
  assert.match(detail, /const ALLOWED_STATUS_TRANSITIONS: Record<string, readonly string\[]> = \{\s*pendente: \["em_analise", "rejeitada"\],\s*em_analise: \["rejeitada"\]/)
  assert.match(detail, /status IN \(\$\{Object\.entries\(ALLOWED_STATUS_TRANSITIONS\)/)
  assert.match(detail, /administradora_id = \$\$\{tenantParameter\} AND deleted_at IS NULL/)
  assert.match(detail, /UPDATE propostas SET \$\{updates\.join\(", "\)\}[^`]*RETURNING \*/)
  assert.match(detail, /status: 409/)
})

test("faturamento falha fechado por incompatibilidade do schema e mantém escopo", async () => {
  const route = await read("app/api/propostas/faturas/route.ts")
  assert.match(route, /hasPermission\(auth, "financeiro", permission\)/)
  assert.match(route, /categoria 'faturamento'[\s\S]*?nenhum registro foi gravado/i)
  assert.match(route, /status: 501/)
  assert.match(route, /item\.status === "paga" \|\| body\.status === "paga"/)
  assert.match(route, /status <> 'paga'/)
  assert.match(route, /conditions = \["administradora_id = \$1", "deleted_at IS NULL"\]/)
})

test("login envia código por e-mail e valida token de uso único", async () => {
  const route = await read("app/api/auth/login/route.ts")
  const requestCodeRoute = await read("app/api/auth/request-code/route.ts")
  const service = await read("back-end/lib/auth-service.ts")
  const form = await read("features/auth/login-section.tsx")
  assert.match(route, /AuthService\.verifyLoginCode\(parsed\.data\.email, parsed\.data\.codigo\)/)
  assert.match(route, /httpOnly: true/)
  assert.match(route, /sameSite: "lax"/)
  assert.match(requestCodeRoute, /AuthService\.requestLoginCode\(parsed\.data\.email, ip\)/)
  assert.match(service, /randomInt\(0, 1_000_000\)/)
  assert.match(service, /expira_em > CURRENT_TIMESTAMP AND tentativas < 5/)
  assert.match(service, /usado_em = CURRENT_TIMESTAMP/)
  assert.match(form, /Enviamos um código de acesso/)
  assert.match(form, /autoComplete="one-time-code"/)
  assert.doesNotMatch(form, /type="password"/)
})

test("retorno bancário não pode liquidar faturas por dados de arquivo não validados", async () => {
  const route = await read("app/api/financeiro/arquivos-bancarios/retorno/route.ts")
  assert.match(route, /requireFinanceiroAccess\("edit"\)/)
  assert.match(route, /status: 501/)
  assert.match(route, /Nenhuma baixa foi registrada/)
  assert.doesNotMatch(route, /UPDATE faturas_mensais|INSERT INTO pagamentos_faturas|query\(/)
})

test("gravação multi-etapas usa transação do driver e não executa migrations", async () => {
  const database = await read("back-end/lib/database.ts")
  assert.match(database, /connection\.transaction\(queries\)/)
  assert.doesNotMatch(database, /\b(?:CREATE|ALTER|DROP)\s+TABLE\b/i)
})
