-- =====================================================
-- SCRIPT DDL: ADMINISTRADORAS
-- Banco: PostgreSQL (Neon)
-- Descrição: Tabela base para multi-tenancy
-- =====================================================

-- Tabela de Administradoras (Multi-tenancy)
CREATE TABLE IF NOT EXISTS administradoras (
    id SERIAL PRIMARY KEY,
    razao_social VARCHAR(200) NOT NULL,
    nome_fantasia VARCHAR(200),
    cnpj VARCHAR(18) UNIQUE NOT NULL,
    inscricao_estadual VARCHAR(20),
    inscricao_municipal VARCHAR(20),
    
    telefone VARCHAR(20),
    email VARCHAR(100),
    site VARCHAR(100),
    
    logotipo_url VARCHAR(500),
    cor_primaria VARCHAR(7) DEFAULT '#6B8E23',
    cor_secundaria VARCHAR(7) DEFAULT '#4A5D23',
    
    status VARCHAR(20) DEFAULT 'ativo' CHECK (status IN ('ativo', 'inativo', 'suspenso')),
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL
);

CREATE INDEX IF NOT EXISTS idx_administradoras_cnpj ON administradoras(cnpj);
CREATE INDEX IF NOT EXISTS idx_administradoras_status ON administradoras(status);
