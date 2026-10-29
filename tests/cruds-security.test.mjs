import assert from "node:assert/strict"
import fs from "node:fs"
import test from "node:test"

const read = (path) => fs.readFileSync(path, "utf8")

test("Pessoas usam tabelas de documentos e escopo da administradora", () => {
  const repository = read("lib/pessoas-repository.ts")
  const route = read("app/api/pessoas/[id]/route.ts")
  assert.match(repository, /pessoas_fisicas pf/)
  assert.match(repository, /pessoas_juridicas pj/)
  assert.match(repository, /p\.administradora_id = \$2/)
  assert.match(route, /requireCadastroAccess\("(view|edit|delete)"\)/)
  assert.doesNotMatch(repository, /p\.(cpf|cnpj|nome_fantasia)/)
})

test("Produtos validam plano dentro da administradora e preservam exclusão lógica", () => {
  const collection = read("app/api/produtos/route.ts")
  const detail = read("app/api/produtos/[id]/route.ts")
  assert.match(collection, /requireCadastroAccess\("view"\)/)
  assert.match(collection, /administradora_id = \$2/)
  assert.match(collection, /id = \$1 AND administradora_id = \$2/)
  assert.match(detail, /deleted_at = CURRENT_TIMESTAMP/)
  assert.match(detail, /administradora_id = \$2/)
  assert.doesNotMatch(collection, /operadora_id/)
})

test("Faixas usam apenas colunas existentes e derivam isolamento pelo plano", () => {
  const collection = read("app/api/planos-faixas/route.ts")
  const detail = read("app/api/planos-faixas/[id]/route.ts")
  assert.match(collection, /FROM planos_faixas_etarias/)
  assert.match(collection, /p\.administradora_id = \$1/)
  assert.match(detail, /DELETE FROM planos_faixas_etarias/)
  assert.doesNotMatch(`${collection}\n${detail}`, /f\.deleted_at|f\.status|deleted_at = CURRENT_TIMESTAMP/)
  assert.match(collection, /idadeMaxima < idadeMinima/)
  assert.match(detail, /requireCadastroAccess\("edit"\)/)
})
