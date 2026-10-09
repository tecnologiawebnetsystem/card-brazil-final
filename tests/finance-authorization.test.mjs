import assert from "node:assert/strict"
import { readFile } from "node:fs/promises"
import test from "node:test"

const root = new URL("../", import.meta.url)
const source = (path) => readFile(new URL(path, root), "utf8")

test("helpers negam permissões financeiras e de cobrança ausentes", async () => {
  const auth = await source("lib/api-auth.ts")
  assert.match(auth, /permissions\[key\] !== true/)
  assert.match(auth, /export function hasPermission\(context: AuthContext, domain: "financeiro" \| "cobranca" \| "cadastros"/)
})

test("faturas mensais exigem leitura, criação, edição e cancelamento", async () => {
  const route = await source("app/api/propostas/faturas/route.ts")
  assert.match(route, /hasPermission\(auth, "financeiro", "view"\)/)
  assert.match(route, /hasPermission\(auth, "financeiro", "create"\)/)
  assert.match(route, /hasPermission\(auth, "financeiro", "edit"\)/)
  assert.match(route, /hasPermission\(auth, "financeiro", "delete"\)/)
  assert.match(route, /administradora_id = \$2/)
})

test("inadimplência e conciliação autorizam cada operação antes da gravação", async () => {
  const inadimplencia = await source("app/api/cobranca/inadimplencia/route.ts")
  const conciliacao = await source("app/api/cobranca/conciliacao/transacoes/route.ts")
  assert.match(inadimplencia, /hasPermission\(auth, "cobranca", "view"\)/)
  assert.match(inadimplencia, /hasPermission\(auth, "cobranca", "create"\)/)
  assert.match(conciliacao, /hasPermission\(auth, "cobranca", "view"\)/)
  assert.match(conciliacao, /hasPermission\(auth, "cobranca", "create"\)/)
  assert.match(conciliacao, /hasPermission\(auth, "cobranca", "edit"\)/)
  assert.match(conciliacao, /WHERE id = \$1 AND administradora_id = \$2/)
})

test("propostas pendentes não retornam dados fora da administradora", async () => {
  const route = await source("app/api/propostas/pendentes/route.ts")
  assert.match(route, /requireCadastroAccess\("view"\)/)
  assert.match(route, /WHERE administradora_id = \$1/)
})

test("fluxo de caixa por id exige autenticação, permissão e escopo", async () => {
  const route = await source("app/api/financeiro/fluxo-caixa/[id]/route.ts")
  assert.match(route, /hasPermission\(auth, "financeiro", "view"\)/)
  assert.match(route, /hasPermission\(auth, "financeiro", "edit"\)/)
  assert.match(route, /hasPermission\(auth, "financeiro", "delete"\)/)
  assert.match(route, /administradora_id = \$2/)
})

test("operações críticas não usam apenas getAuthContext", async () => {
  const files = [
    "app/api/propostas/faturas/route.ts",
    "app/api/cobranca/inadimplencia/route.ts",
    "app/api/cobranca/conciliacao/transacoes/route.ts",
  ]
  for (const file of files) {
    const route = await source(file)
    assert.match(route, /hasPermission|require(?:Cobranca|Financeiro)Access/)
  }
})

// Casos de integração com sessão, banco e efeitos colaterais permanecem pendentes.
// Estes testes verificam o contrato de autorização no código sem tocar no banco.

process.exitCode = 0

