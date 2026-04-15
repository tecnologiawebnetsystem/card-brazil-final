import { NextRequest, NextResponse } from "next/server"
import mysql from "mysql2/promise"

interface TableColumn {
  name: string
  type: string
  nullable: boolean
  key: string
  default: string | null
  extra: string
}

interface TableInfo {
  name: string
  columns: TableColumn[]
  rowCount: number
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { host, port, user, password, database } = body

    if (!host || !user || !database) {
      return NextResponse.json(
        { error: "Host, usuario e banco de dados sao obrigatorios" },
        { status: 400 }
      )
    }

    const connection = await mysql.createConnection({
      host,
      port: parseInt(port) || 3306,
      user,
      password,
      database,
      connectTimeout: 10000,
    })

    // Get list of tables
    const [tableRows] = await connection.query("SHOW TABLES")
    const tableKey = `Tables_in_${database}`
    const tableNames = (tableRows as Record<string, string>[]).map((row) => row[tableKey])

    const tables: TableInfo[] = []

    for (const tableName of tableNames) {
      // Get columns for each table
      const [columns] = await connection.query(`DESCRIBE \`${tableName}\``)
      const columnList: TableColumn[] = (columns as {
        Field: string
        Type: string
        Null: string
        Key: string
        Default: string | null
        Extra: string
      }[]).map((col) => ({
        name: col.Field,
        type: col.Type,
        nullable: col.Null === "YES",
        key: col.Key,
        default: col.Default,
        extra: col.Extra,
      }))

      // Get row count
      const [countResult] = await connection.query(`SELECT COUNT(*) as count FROM \`${tableName}\``)
      const rowCount = (countResult as { count: number }[])[0]?.count || 0

      tables.push({
        name: tableName,
        columns: columnList,
        rowCount,
      })
    }

    await connection.end()

    return NextResponse.json({
      success: true,
      tables,
    })
  } catch (error: unknown) {
    console.error("Error fetching tables:", error)
    
    const errorMessage = error instanceof Error ? error.message : "Erro desconhecido"

    return NextResponse.json(
      { error: `Erro ao buscar tabelas: ${errorMessage}` },
      { status: 500 }
    )
  }
}
