import { sql } from "./database"

export class CrudService<T> {
  constructor(private tableName: string) {}

  async findAll(filters?: Record<string, any>): Promise<T[]> {
    let query = `SELECT * FROM ${this.tableName}`
    const params: any[] = []

    if (filters && Object.keys(filters).length > 0) {
      const conditions = Object.keys(filters).map((key, index) => `${key} = $${index + 1}`)
      query += ` WHERE ${conditions.join(" AND ")}`
      params.push(...Object.values(filters))
    }

    query += " ORDER BY created_at DESC"

    const rows = await sql(query, params)
    return rows as T[]
  }

  async findById(id: number): Promise<T | null> {
    const rows = await sql(`SELECT * FROM ${this.tableName} WHERE id = $1`, [id])
    return rows.length > 0 ? (rows[0] as T) : null
  }

  async create(data: Partial<T>): Promise<number> {
    const keys = Object.keys(data)
    const values = Object.values(data)
    const placeholders = keys.map((_, index) => `$${index + 1}`).join(", ")

    const rows = await sql(
      `INSERT INTO ${this.tableName} (${keys.join(", ")}) VALUES (${placeholders}) RETURNING id`,
      values,
    )

    return rows[0].id
  }

  async update(id: number, data: Partial<T>): Promise<boolean> {
    const keys = Object.keys(data)
    const values = Object.values(data)
    const setClause = keys.map((key, index) => `${key} = $${index + 1}`).join(", ")

    const rows = await sql(`UPDATE ${this.tableName} SET ${setClause} WHERE id = $${keys.length + 1}`, [...values, id])

    return rows.length > 0
  }

  async delete(id: number): Promise<boolean> {
    const rows = await sql(`DELETE FROM ${this.tableName} WHERE id = $1`, [id])
    return rows.length > 0
  }

  async softDelete(id: number): Promise<boolean> {
    return this.update(id, { ativo: false } as Partial<T>)
  }

  async count(filters?: Record<string, any>): Promise<number> {
    let query = `SELECT COUNT(*) as total FROM ${this.tableName}`
    const params: any[] = []

    if (filters && Object.keys(filters).length > 0) {
      const conditions = Object.keys(filters).map((key, index) => `${key} = $${index + 1}`)
      query += ` WHERE ${conditions.join(" AND ")}`
      params.push(...Object.values(filters))
    }

    const rows = await sql(query, params)
    return Number(rows[0].total)
  }
}
