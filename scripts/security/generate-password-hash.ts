/**
 * Script para gerar hash bcrypt de senhas
 * Usado para criar usuários iniciais no banco
 */

import bcrypt from "bcryptjs"

const password = "admin123" // Senha padrão
const saltRounds = 10

async function main() {
  const hash = await bcrypt.hash(password, saltRounds)
  console.log(`Senha: ${password}`)
  console.log(`Hash: ${hash}`)
}

void main()

// Hash gerado: $2a$10$...
