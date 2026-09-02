import { query } from "./database"

const IDENTIFIER = /^[a-z_][a-z0-9_]*$/i

function assertIdentifier(value: string, kind: string) {
  if (!IDENTIFIER.test(value)) {
    throw new Error(`Identificador de ${kind} inválido`)
  }
}

export class CrudService<T> {
  constructor(private tableName: string) {
    assertIdentifier(tableName, "tabela")
  }

  async findAll(filters?: Record<string, any>): Promise<T[]> {
    let statement = `SELECT * FROM ${this.tableName}`
    const params: any[] = []

    if (filters && Object.keys(filters).length > 0) {
      Object.keys(filters).forEach((key) => assertIdentifier(key, "coluna"))
      const conditions = Object.keys(filters).map((key, index) => `${key} = ${index + 1}`)
      statement += ` WHERE ${conditions.join(" AND ")}`
      params.push(...Object.values(filters))
    }

    statement += " ORDER BY created_at DESC"

    const rows = await query(statement, params)
    return rows as T[]
  }

  async findById(id: number): Promise<T | null> {
    const rows = await query(`SELECT * FROM ${this.tableName} WHERE id = $1`, [id])
    return rows.length > 0 ? (rows[0] as T) : null
  }

  async create(data: Partial<T>): Promise<number> {
    const keys = Object.keys(data)
    keys.forEach((key) => assertIdentifier(key, "coluna"))
    if (keys.length === 0) throw new Error("Nenhum dado informado")
    const values = Object.values(data)
    const placeholders = keys.map((_, index) => `$${index + 1}`).join(", ")

    const rows = await query(
      `INSERT INTO ${this.tableName} (${keys.join(", ")}) VALUES (${placeholders}) RETURNING id`,
      values,
    )

    return rows[0].id
  }

  async update(id: number, data: Partial<T>): Promise<boolean> {
    const keys = Object.keys(data)
    keys.forEach((key) => assertIdentifier(key, "coluna"))
    if (keys.length === 0) throw new Error("Nenhum dado informado")
    const values = Object.values(data)
    const setClause = keys.map((key, index) => `${key} = $${index + 1}`).join(", ")

    const rows = await query(`UPDATE ${this.tableName} SET ${setClause} WHERE id = $${keys.length + 1}`, [...values, id])

    return rows.length > 0
  }

  async delete(id: number): Promise<boolean> {
    const rows = await query(`DELETE FROM ${this.tableName} WHERE id = $1`, [id])
    return rows.length > 0
  }

  async softDelete(id: number): Promise<boolean> {
    return this.update(id, { ativo: false } as Partial<T>)
  }

  async count(filters?: Record<string, any>): Promise<number> {
    let statement = `SELECT COUNT(*) as total FROM ${this.tableName}`
    const params: any[] = []

    if (filters && Object.keys(filters).length > 0) {
      Object.keys(filters).forEach((key) => assertIdentifier(key, "coluna"))
      const conditions = Object.keys(filters).map((key, index) => `${key} = ${index + 1}`)
      statement += ` WHERE ${conditions.join(" AND ")}`
      params.push(...Object.values(filters))
    }

    const rows = await query(statement, params)
    return Number(rows[0].total)
  }
}
