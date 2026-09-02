import { NextRequest, NextResponse } from "next/server"
import mysql from "mysql2/promise"

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

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { query } = body

    if (!query) {
      return NextResponse.json(
        { error: "Query e obrigatoria" },
        { status: 400 }
      )
    }

    const config = getDbConfig()

    if (!config.host || !config.user || !config.database) {
      return NextResponse.json(
        { error: "Configuracao do banco de dados nao encontrada. Verifique as variaveis de ambiente." },
        { status: 500 }
      )
    }

    const normalizedQuery = query.trim().replace(/\s+/g, " ")
    if (!/^(SELECT|SHOW|DESCRIBE)\b/i.test(normalizedQuery) || normalizedQuery.includes(";")) {
      return NextResponse.json(
        { error: "Apenas consultas de leitura simples são permitidas" },
        { status: 403 }
      )
    }

    // Basic SQL injection prevention - block dangerous commands
    const dangerousPatterns = [
      /DROP\s+DATABASE/i,
      /DROP\s+SCHEMA/i,
      /TRUNCATE\s+DATABASE/i,
      /SHUTDOWN/i,
    ]

    for (const pattern of dangerousPatterns) {
      if (pattern.test(query)) {
        return NextResponse.json(
          { error: "Comando nao permitido por razoes de seguranca" },
          { status: 403 }
        )
      }
    }

    const connection = await mysql.createConnection({
      ...config,
      connectTimeout: 10000,
    })

    const startTime = Date.now()
    
    const [result, fields] = await connection.query(query)
    
    const executionTime = Date.now() - startTime

    await connection.end()

    // Check if it's a SELECT query (returns rows)
    if (Array.isArray(result) && fields) {
      const columns = (fields as mysql.FieldPacket[]).map((field) => field.name)
      return NextResponse.json({
        success: true,
        columns,
        rows: result,
        executionTime,
      })
    }

    // For INSERT, UPDATE, DELETE queries
    const resultInfo = result as mysql.ResultSetHeader
    return NextResponse.json({
      success: true,
      affectedRows: resultInfo.affectedRows,
      insertId: resultInfo.insertId,
      message: getQueryMessage(query, resultInfo.affectedRows),
      executionTime,
      columns: [],
      rows: [],
    })
  } catch (error: unknown) {
    console.error("Query execution error:", error)
    
    return NextResponse.json(
      { error: "Não foi possível executar a consulta" },
      { status: 500 }
    )
  }
}

function getQueryMessage(query: string, affectedRows: number): string {
  const upperQuery = query.trim().toUpperCase()
  
  if (upperQuery.startsWith("INSERT")) {
    return `${affectedRows} registro(s) inserido(s)`
  }
  if (upperQuery.startsWith("UPDATE")) {
    return `${affectedRows} registro(s) atualizado(s)`
  }
  if (upperQuery.startsWith("DELETE")) {
    return `${affectedRows} registro(s) excluido(s)`
  }
  if (upperQuery.startsWith("CREATE")) {
    return "Tabela criada com sucesso"
  }
  if (upperQuery.startsWith("ALTER")) {
    return "Tabela alterada com sucesso"
  }
  if (upperQuery.startsWith("DROP")) {
    return "Tabela removida com sucesso"
  }
  
  return "Query executada com sucesso"
}
