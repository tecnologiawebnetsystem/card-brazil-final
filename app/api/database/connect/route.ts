import { NextResponse } from "next/server"
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

export async function GET() {
  try {
    const config = getDbConfig()

    if (!config.host || !config.user || !config.database) {
      return NextResponse.json(
        { error: "Configuracao do banco de dados nao encontrada. Verifique as variaveis de ambiente." },
        { status: 500 }
      )
    }

    // Create connection to test credentials
    const connection = await mysql.createConnection({
      ...config,
      connectTimeout: 10000,
    })

    // Test connection
    await connection.query("SELECT 1")

    await connection.end()

    return NextResponse.json({
      success: true,
      message: "Conexao estabelecida com sucesso",
      database: config.database,
      host: config.host,
    })
  } catch (error: unknown) {
    console.error("Database connection error:", error)
    
    const errorMessage = error instanceof Error ? error.message : "Erro desconhecido"
    
    // Provide user-friendly error messages
    if (errorMessage.includes("ECONNREFUSED")) {
      return NextResponse.json(
        { error: "Nao foi possivel conectar ao servidor MySQL. Verifique se o host e a porta estao corretos." },
        { status: 500 }
      )
    }
    
    if (errorMessage.includes("Access denied")) {
      return NextResponse.json(
        { error: "Acesso negado. Verifique o usuario e a senha nas variaveis de ambiente." },
        { status: 401 }
      )
    }
    
    if (errorMessage.includes("Unknown database")) {
      return NextResponse.json(
        { error: "Banco de dados nao encontrado." },
        { status: 404 }
      )
    }
    
    if (errorMessage.includes("ETIMEDOUT") || errorMessage.includes("timeout")) {
      return NextResponse.json(
        { error: "Tempo de conexao esgotado. Verifique a conectividade de rede." },
        { status: 504 }
      )
    }

    return NextResponse.json(
      { error: `Erro ao conectar: ${errorMessage}` },
      { status: 500 }
    )
  }
}
