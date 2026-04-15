import { NextRequest, NextResponse } from "next/server"
import mysql from "mysql2/promise"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { host, port, user, password, database } = body

    if (!host || !user) {
      return NextResponse.json(
        { error: "Host e usuario sao obrigatorios" },
        { status: 400 }
      )
    }

    // Create connection to test credentials
    const connection = await mysql.createConnection({
      host,
      port: parseInt(port) || 3306,
      user,
      password,
      database: database || undefined,
      connectTimeout: 10000,
    })

    // Get list of databases
    const [rows] = await connection.query("SHOW DATABASES")
    const databases = (rows as { Database: string }[]).map((row) => row.Database)

    await connection.end()

    return NextResponse.json({
      success: true,
      message: "Conexao estabelecida com sucesso",
      databases,
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
        { error: "Acesso negado. Verifique o usuario e a senha." },
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
