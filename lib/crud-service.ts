import { pool } from "./database"
import type { RowDataPacket, ResultSetHeader } from "mysql2/promise"

export class CrudService<T> {
  constructor(private tableName: string) {}

  async findAll(filters?: Record<string, any>): Promise<T[]> {
    let query = `SELECT * FROM ${this.tableName}`
    const params: any[] = []

    if (filters && Object.keys(filters).length > 0) {
      const conditions = Object.keys(filters).map((key) => `${key} = ?`)
      query += ` WHERE ${conditions.join(" AND ")}`
      params.push(...Object.values(filters))
    }

    query += " ORDER BY created_at DESC"

    const [rows] = await pool.execute<RowDataPacket[]>(query, params)
    return rows as T[]
  }

  async findById(id: number): Promise<T | null> {
    const [rows] = await pool.execute<RowDataPacket[]>(`SELECT * FROM ${this.tableName} WHERE id = ?`, [id])
    return rows.length > 0 ? (rows[0] as T) : null
  }

  async create(data: Partial<T>): Promise<number> {
    const keys = Object.keys(data)
    const values = Object.values(data)
    const placeholders = keys.map(() => "?").join(", ")

    const [result] = await pool.execute<ResultSetHeader>(
      `INSERT INTO ${this.tableName} (${keys.join(", ")}) VALUES (${placeholders})`,
      values,
    )

    return result.insertId
  }

  async update(id: number, data: Partial<T>): Promise<boolean> {
    const keys = Object.keys(data)
    const values = Object.values(data)
    const setClause = keys.map((key) => `${key} = ?`).join(", ")

    const [result] = await pool.execute<ResultSetHeader>(`UPDATE ${this.tableName} SET ${setClause} WHERE id = ?`, [
      ...values,
      id,
    ])

    return result.affectedRows > 0
  }

  async delete(id: number): Promise<boolean> {
    const [result] = await pool.execute<ResultSetHeader>(`DELETE FROM ${this.tableName} WHERE id = ?`, [id])

    return result.affectedRows > 0
  }

  async softDelete(id: number): Promise<boolean> {
    return this.update(id, { ativo: false } as Partial<T>)
  }

  async count(filters?: Record<string, any>): Promise<number> {
    let query = `SELECT COUNT(*) as total FROM ${this.tableName}`
    const params: any[] = []

    if (filters && Object.keys(filters).length > 0) {
      const conditions = Object.keys(filters).map((key) => `${key} = ?`)
      query += ` WHERE ${conditions.join(" AND ")}`
      params.push(...Object.values(filters))
    }

    const [rows] = await pool.execute<RowDataPacket[]>(query, params)
    return rows[0].total
  }
}
