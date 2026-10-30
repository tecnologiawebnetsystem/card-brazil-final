import assert from "node:assert/strict"
import { readFile } from "node:fs/promises"
import test from "node:test"

const authorizationSource = await readFile(new URL("../../back-end/security/authorization.ts", import.meta.url), "utf8")
const apiAuthSource = await readFile(new URL("../../back-end/lib/api-auth.ts", import.meta.url), "utf8")
const auditSource = await readFile(new URL("../../back-end/security/audit.ts", import.meta.url), "utf8")

test("autorização central define ações e recursos", () => {
  assert.match(authorizationSource, /export type PermissionAction/)
  assert.match(authorizationSource, /export type PermissionResource/)
  assert.match(authorizationSource, /export async function authorize/)
  assert.match(authorizationSource, /export async function requirePermission/)
})

test("guardas de API usam o núcleo central de autorização", () => {
  assert.match(apiAuthSource, /requirePermission\(context, "cobranca", permission\)/)
  assert.match(apiAuthSource, /requirePermission\(context, "financeiro", permission\)/)
  assert.match(apiAuthSource, /requirePermission\(context, "cadastros", permission\)/)
})

test("autorização possui escopo e auditoria de negação", () => {
  assert.match(authorizationSource, /scope: "tenant" \| "own" \| "team" \| "all"/)
  assert.match(authorizationSource, /recordAuthorizationDenied/)
  assert.match(auditSource, /authorization_denied/)
})
