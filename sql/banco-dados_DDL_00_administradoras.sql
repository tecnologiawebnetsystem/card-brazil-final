-- =====================================================
-- SCRIPT DDL: ADMINISTRADORAS
-- Banco: MySQL 8.0+
-- Descrição: Tabela base para multi-tenancy
-- =====================================================

USE cardbrazil;

-- Tabela de Administradoras (Multi-tenancy)
CREATE TABLE IF NOT EXISTS administradoras (
    id INT AUTO_INCREMENT PRIMARY KEY,
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
    
    status ENUM('ativo', 'inativo', 'suspenso') DEFAULT 'ativo',
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL,
    
    INDEX idx_cnpj (cnpj),
    INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
