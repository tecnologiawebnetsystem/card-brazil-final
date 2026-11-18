import assert from "node:assert/strict"
import fs from "node:fs"
import test from "node:test"

const read = (path) => fs.readFileSync(path, "utf8")

test("Pessoas usam tabelas de documentos e escopo da administradora", () => {
  const repository = read("back-end/lib/pessoas-repository.ts")
  const route = read("app/api/pessoas/[id]/route.ts")
  assert.match(repository, /pessoas_fisicas pf/)
  assert.match(repository, /pessoas_juridicas pj/)
  assert.match(repository, /p\.administradora_id = \$2/)
  assert.match(route, /requireCadastroAccess\("(view|edit|delete)"\)/)
  assert.doesNotMatch(repository, /p\.(cpf|cnpj|nome_fantasia)/)
})

test("Produtos são independentes, persistem no escopo autenticado e preservam exclusão lógica", () => {
  const collection = read("app/api/produtos/route.ts")
  const detail = read("app/api/produtos/[id]/route.ts")
  assert.match(collection, /requireCadastroAccess\("view"\)/)
  assert.match(collection, /INSERT INTO produtos \(administradora_id/)
  assert.match(collection, /VALUES \(\$1/)
  assert.doesNotMatch(collection, /p\.plano_id|INSERT INTO produtos \([^)]*plano_id/)
  assert.match(detail, /deleted_at = CURRENT_TIMESTAMP/)
  assert.match(detail, /administradora_id = \$2/)
  assert.match(detail, /SELECT id FROM planos WHERE produto_id = \$1 AND administradora_id = \$2/)
})

test("Plano é salvo com produto obrigatório, existente e da administradora autenticada", () => {
  const schema = read("schemas/validation.ts")
  const collection = read("app/api/planos/route.ts")
  assert.match(schema, /produto_id: idSchema/)
  assert.match(collection, /data\.produto_id, administradoraId/)
  assert.match(collection, /SELECT id FROM produtos WHERE id = \$1 AND administradora_id = \$2 AND deleted_at IS NULL/)
  assert.match(collection, /INSERT INTO planos \(administradora_id, operadora_id, produto_id/)
})

test("Plano rejeita produto ausente, inexistente ou pertencente a outra administradora", () => {
  const schema = read("schemas/validation.ts")
  const collection = read("app/api/planos/route.ts")
  const detail = read("app/api/planos/[id]/route.ts")
  assert.match(schema, /produto_id: idSchema/)
  assert.match(collection, /if \(!produto\.length\) return apiError\("Produto não encontrado/)
  assert.match(detail, /WHERE id = \$1 AND administradora_id = \$2 AND deleted_at IS NULL/)
  assert.match(detail, /if \(!produto\.length\) return NextResponse\.json\(errorResponse\("Produto não encontrado"\), \{ status: 422 \}\)/)
})

test("Edição do Plano mantém vínculo ao preservar o valor atual e aceita substituição validada", () => {
  const detail = read("app/api/planos/[id]/route.ts")
  assert.match(detail, /SELECT produto_id FROM planos WHERE id = \$1 AND administradora_id = \$2/)
  assert.match(detail, /normalized\.produto_id \?\? planoAtual\[0\]\.produto_id/)
  assert.match(detail, /UPDATE planos SET \$\{updates\.join\("/)
})

test("Plano Faixa lista somente planos da administradora com produto válido e identifica o produto", () => {
  const collection = read("app/api/planos-faixas/route.ts")
  const page = read("app/dashboard/cadastros/planos-faixa/page.tsx")
  assert.match(collection, /p\.administradora_id = \$1/)
  assert.match(collection, /JOIN produtos pr ON pr\.id = p\.produto_id AND pr\.administradora_id = p\.administradora_id AND pr\.deleted_at IS NULL/)
  assert.match(collection, /pr\.nome AS produto_nome/)
  assert.match(page, /Produto vinculado: \{planosDisponiveis\.find/)
})

test("Plano Faixa rejeita ausência de plano, plano inexistente e plano de outra administradora", () => {
  const collection = read("app/api/planos-faixas/route.ts")
  assert.match(collection, /!validId\(planoId\)/)
  assert.match(collection, /p\.id = \$1 AND p\.administradora_id = \$2 AND p\.deleted_at IS NULL/)
  assert.match(collection, /if \(!plano\.length\) return apiError\("Plano não encontrado/)
})

test("Edição de Plano Faixa preserva a associação ou valida a nova associação", () => {
  const detail = read("app/api/planos-faixas/[id]/route.ts")
  assert.match(detail, /body\.plano_id === undefined \? null/)
  assert.match(detail, /p\.administradora_id = \$2 AND p\.deleted_at IS NULL/)
  assert.match(detail, /plano_id=COALESCE\(\$1, f\.plano_id\)/)
  assert.match(detail, /p\.administradora_id=\$8/)
})

test("Consultas de Plano e Plano Faixa retornam os vínculos para conferência", () => {
  const plans = read("app/api/planos/route.ts")
  const ranges = read("app/api/planos-faixas/route.ts")
  assert.match(plans, /conditions\.push\(.*p\.produto_id = \$\$\{params\.length\}/)
  assert.match(plans, /pr\.nome AS produto_nome/)
  assert.match(ranges, /f\.plano_id/)
  assert.match(ranges, /p\.nome AS plano_nome/)
  assert.match(ranges, /pr\.nome AS produto_nome/)
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
