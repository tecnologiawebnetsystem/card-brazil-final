import assert from "node:assert/strict"
import { readFile } from "node:fs/promises"
import test from "node:test"

const root = new URL("../../", import.meta.url)
const read = (path) => readFile(new URL(path, root), "utf8")

test("SQL Manager rejeita consultas e mutações arbitrárias depois da autorização", async () => {
  const queryRoute = await read("app/api/sql-manager/query/route.ts")
  const mutateRoute = await read("app/api/sql-manager/mutate/route.ts")
  assert.match(queryRoute, /await requireSqlManagerAccess\(\)[\s\S]*?return unavailable\(\)/)
  assert.match(queryRoute, /Consultas SQL arbitrárias foram desabilitadas/)
  assert.doesNotMatch(queryRoute, /\bquery\s*\(/)
  assert.match(mutateRoute, /await requireSqlManagerAccess\(\)[\s\S]*?status: 501/)
  assert.doesNotMatch(mutateRoute, /\bquery\s*\(/)
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
  assert.match(route, /WITH current AS \([\s\S]*?WHERE id = \$1 AND administradora_id = \$2[\s\S]*?FOR UPDATE[\s\S]*?audited AS \([\s\S]*?INSERT INTO auditoria_cadastros[\s\S]*?SELECT \$2, \$3, 'delete'/)
  assert.doesNotMatch(route, /recordCadastroAudit\(/)
})

test("aprovação não pode ser alcançada pelo endpoint alternativo de edição", async () => {
  const approval = await read("app/api/propostas/aprovar/route.ts")
  const detail = await read("app/api/propostas/[id]/route.ts")
  assert.match(approval, /status: 501/)
  assert.match(detail, /body\.status === "aprovada"[\s\S]*?status: 501/)
  assert.match(detail, /if \(body\.status === "aprovada"\)[\s\S]*?Nenhuma alteração foi gravada/)
})

test("faturamento falha fechado por incompatibilidade do schema e mantém escopo", async () => {
  const route = await read("app/api/propostas/faturas/route.ts")
  assert.match(route, /hasPermission\(auth, "financeiro", permission\)/)
  assert.match(route, /categoria 'faturamento'[\s\S]*?nenhum registro foi gravado/i)
  assert.match(route, /status: 501/)
  assert.match(route, /conditions = \["administradora_id = \$1", "deleted_at IS NULL"\]/)
})

test("gravação multi-etapas usa transação do driver e não executa migrations", async () => {
  const database = await read("back-end/lib/database.ts")
  assert.match(database, /connection\.transaction\(queries\)/)
  assert.doesNotMatch(database, /\b(?:CREATE|ALTER|DROP)\s+TABLE\b/i)
})
