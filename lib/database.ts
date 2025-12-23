import mysql from "mysql2/promise"

function getDatabaseConfig() {
  const env = process.env.NODE_ENV

  console.log("[v0] ========================================")
  console.log("[v0] AMBIENTE DETECTADO:", env.toUpperCase())
  console.log("[v0] ========================================")

  let config = {
    host: "127.0.0.1",
    port: 3306,
    user: "root",
    password: "D05m09@123",
    database: "cardbrazil",
  }

  switch (env) {
    case "production":
      config = {
        host: process.env.PROD_DB_HOST || "127.0.0.1",
        port: Number.parseInt(process.env.PROD_DB_PORT || "3306"),
        user: process.env.PROD_DB_USER || "root",
        password: process.env.PROD_DB_PASSWORD || "D05m09@123",
        database: process.env.PROD_DB_NAME || "cardbrazil",
      }
      break

    case "test":
      config = {
        host: process.env.PROD_DB_HOST || "127.0.0.1",
        port: Number.parseInt(process.env.PROD_DB_PORT || "3306"),
        user: process.env.PROD_DB_USER || "root",
        password: process.env.PROD_DB_PASSWORD || "D05m09@123",
        database: process.env.PROD_DB_NAME || "cardbrazil",
      }
      break

    case "development":
    default:
      config = {
        host: process.env.DEV_DB_HOST || "127.0.0.1",
        port: Number.parseInt(process.env.DEV_DB_PORT || "3306"),
        user: process.env.DEV_DB_USER || "root",
        password: process.env.DEV_DB_PASSWORD || "",
        database: process.env.DEV_DB_NAME || "cardbrazil",
      }
      break
  }

  console.log("[v0] Configuração do Banco de Dados:")
  console.log("[v0] - Host:", config.host)
  console.log("[v0] - Port:", config.port)
  console.log("[v0] - User:", config.user)
  console.log("[v0] - Database:", config.database)
  console.log("[v0] - Password:", config.password ? "***CONFIGURADA***" : "***NÃO CONFIGURADA***")
  console.log("[v0] ========================================")

  return config
}

const dbConfig = getDatabaseConfig()

const pool = mysql.createPool({
  host: dbConfig.host,
  port: dbConfig.port,
  user: dbConfig.user,
  password: dbConfig.password,
  database: dbConfig.database,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0,
})

console.log("[v0] Pool de conexões MySQL criado com sucesso!")

// Função helper para executar queries
export async function query<T = any>(sql: string, params?: any[]): Promise<T[]> {
  console.log("[v0] Executando query:", sql)
  console.log("[v0] Parâmetros:", params)

  try {
    const [rows] = await pool.execute(sql, params)
    console.log("[v0] Query executada com sucesso! Linhas retornadas:", Array.isArray(rows) ? rows.length : 0)
    return rows as T[]
  } catch (error) {
    console.error("[v0] ERRO ao executar query:", error)
    console.error("[v0] SQL que falhou:", sql)
    console.error("[v0] Parâmetros:", params)
    throw error
  }
}

// Função helper para executar queries que retornam um único resultado
export async function queryOne<T = any>(sql: string, params?: any[]): Promise<T | null> {
  console.log("[v0] Executando queryOne...")
  const rows = await query<T>(sql, params)
  const result = rows.length > 0 ? rows[0] : null
  console.log("[v0] queryOne resultado:", result ? "Encontrado" : "Não encontrado")
  return result
}

// Função para testar conexão
export async function testConnection(): Promise<boolean> {
  console.log("[v0] Testando conexão com o banco de dados...")
  try {
    await pool.query("SELECT 1")
    console.log("[v0] ✅ Conexão com banco de dados OK!")
    return true
  } catch (error) {
    console.error("[v0] ❌ ERRO ao conectar ao banco de dados:", error)
    return false
  }
}

testConnection().then((success) => {
  if (success) {
    console.log("[v0] Sistema pronto para usar o banco de dados!")
  } else {
    console.error("[v0] ATENÇÃO: Sistema iniciado mas sem conexão com banco de dados!")
  }
})

// Exportar o pool para uso direto quando necessário
export { pool }

// Tipos TypeScript para as tabelas
export interface Usuario {
  id: string
  email: string
  senha_hash: string
  ativo: boolean
  email_verificado: boolean
  tentativas_login: number
  bloqueado_ate?: Date
  created_at: Date
  updated_at: Date
}

export interface PerfilUsuario {
  id: string
  usuario_id: string
  nome_completo: string
  nome_exibicao?: string
  telefone?: string
  avatar_url?: string
  cargo?: string
  departamento?: string
  data_nascimento?: Date
  endereco?: string
  preferencias: string
  created_at: Date
  updated_at: Date
}

export interface Role {
  id: string
  nome: string
  descricao?: string
  permissoes: string
  ativo: boolean
  created_at: Date
}

export interface SessaoUsuario {
  id: string
  usuario_id: string
  token_hash: string
  refresh_token_hash?: string
  expires_at: Date
  ip_address?: string
  user_agent?: string
  ativo: boolean
  created_at: Date
}
