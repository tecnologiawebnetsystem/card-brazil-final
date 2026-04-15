import { NextResponse } from "next/server"
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

// Configuração fixa do banco de dados via variáveis de ambiente
function getDbConfig() {
  return {
    host: process.env.MYSQL_HOST,
    port: parseInt(process.env.MYSQL_PORT || "3306"),
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
  }
}

export async function GET() {
  try {
    const config = getDbConfig()

    if (!config.host || !config.user || !config.database) {
      return NextResponse.json(
        { error: "Configuracao do banco de dados nao encontrada. Verifique as variaveis de ambiente." },
        { status: 500 }
      )
    }

    const connection = await mysql.createConnection({
      ...config,
      connectTimeout: 10000,
    })

    // Get list of tables
    const [tableRows] = await connection.query("SHOW TABLES")
    const tableKey = `Tables_in_${config.database}`
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
      database: config.database,
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
