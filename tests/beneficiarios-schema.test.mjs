import assert from "node:assert/strict"
import { readFile } from "node:fs/promises"
import test from "node:test"

const root = new URL("../", import.meta.url)
const read = (path) => readFile(new URL(path, root), "utf8")
const routes = [
  "app/api/beneficiarios/route.ts",
  "app/api/beneficiarios/[id]/route.ts",
  "app/api/beneficiarios/titulares/route.ts",
  "app/api/beneficiarios/dependentes/route.ts",
  "app/api/beneficiarios/titular/[id]/dependentes/route.ts",
  "app/api/beneficiarios/consulta/route.ts",
]

test("APIs de beneficiários usam o esquema vigente e autorização", async () => {
  for (const path of routes) {
    const source = await read(path)
    assert.match(source, /requireCadastroAccess\(/, path)
    assert.doesNotMatch(source, /\bp\.(?:cpf|cnpj)\b|\bo\.nome_fantasia\b/, path)
    assert.doesNotMatch(source, /\b(?:proposta_id|parentesco)\b/, path)
  }
})

test("listagem de beneficiários trata autenticação separadamente de erro interno", async () => {
  const source = await read("app/api/beneficiarios/route.ts")
  assert.match(source, /apiAuthError\(error\)/)
  assert.match(source, /status: 500/)
  assert.match(source, /message: auth\.message/)
})
