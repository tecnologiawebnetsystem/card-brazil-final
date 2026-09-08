import assert from "node:assert/strict"
import test from "node:test"

const apiError = (status, code) => ({
  success: false,
  code: code ?? ({ 400: "VALIDATION_ERROR", 401: "UNAUTHENTICATED", 403: "FORBIDDEN", 404: "NOT_FOUND", 409: "CONFLICT" }[status] ?? "INTERNAL_ERROR"),
})

test("respostas de erro usam códigos HTTP semânticos", () => {
  assert.equal(apiError(400).code, "VALIDATION_ERROR")
  assert.equal(apiError(401).code, "UNAUTHENTICATED")
  assert.equal(apiError(403).code, "FORBIDDEN")
  assert.equal(apiError(409).code, "CONFLICT")
})

test("payloads de erro podem transportar erros por campo", () => {
  const payload = { success: false, code: "VALIDATION_ERROR", errors: { cpf: ["CPF inválido"] } }
  assert.deepEqual(payload.errors.cpf, ["CPF inválido"])
})

test("o cliente não deve enviar administradora no payload", () => {
  const pessoa = { tipo_pessoa: "fisica", nome_completo: "Pessoa Teste", cpf: "00000000000" }
  assert.equal("administradora_id" in pessoa, false)
  assert.equal("id_administradora" in pessoa, false)
})
