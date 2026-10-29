import assert from "node:assert/strict"
import { readFile } from "node:fs/promises"
import test from "node:test"

const root = new URL("../", import.meta.url)
const read = (path) => readFile(new URL(path, root), "utf8")

const routes = [
  ["operadoras", "operadoras"],
  ["agenciadores", "agenciadores"],
  ["corretores", "corretores"],
  ["estipulantes", "estipulantes"],
  ["planos", "planos"],
  ["contratos", "contratos"],
]

test("GETs P1 exigem autorização antes da consulta e não convertem auth em 500", async () => {
  for (const [route, table] of routes) {
    const source = await read(`app/api/${route}/route.ts`)
    assert.match(source, /requireCadastroAccess\("view"\)/, route)
    assert.match(source, /apiAuthError\(error\)/, route)
    assert.match(source, new RegExp(`FROM ${table}|FROM ${table} `, "i"), route)
    const authPosition = source.indexOf('requireCadastroAccess("view")')
    const queryPosition = source.indexOf("query(")
    assert.ok(authPosition >= 0 && authPosition < queryPosition, route)
  }
})
