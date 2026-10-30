import assert from "node:assert/strict"
import { readFile } from "node:fs/promises"
import test from "node:test"

const root = new URL("../", import.meta.url)
const read = (path) => readFile(new URL(path, root), "utf8")

 test("o modelo vigente não expõe a API de permissões legadas", async () => {
  await assert.rejects(() => read("app/api/sistemas/permissoes/route.ts"))
  const swagger = await read("app/api/swagger/route.ts")
  assert.doesNotMatch(swagger, /\/api\/sistemas\/permissoes/)
})

test("as rotas antigas de configuração encaminham para o controle vigente", async () => {
  const perfis = await read("app/dashboard/sistemas/perfis-usuario/page.tsx")
  const permissoes = await read("app/dashboard/configuracoes/permissoes/page.tsx")
  for (const source of [perfis, permissoes]) {
    assert.match(source, /redirect\("\/dashboard\/sistemas\/controle-acesso"\)/)
    assert.doesNotMatch(source, /api\/sistemas\/permissoes|usuario_permissoes|FROM permissoes/)
  }
})
