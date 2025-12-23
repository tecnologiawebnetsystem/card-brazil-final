-- =====================================================
-- SCRIPT DDL: PESSOAS, ENDEREÇOS E DADOS BANCÁRIOS
-- Banco: MySQL 8.0+
-- Descrição: Tabelas centralizadas para pessoas (físicas/jurídicas),
--            endereços múltiplos e contas bancárias
-- =====================================================

USE cardbrazil;

-- Tabela de Pessoas (Física e Jurídica)
CREATE TABLE IF NOT EXISTS pessoas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_administradora INT NOT NULL,
    tipo_pessoa ENUM('fisica', 'juridica') NOT NULL,
    
    -- Dados Pessoa Física
    nome VARCHAR(200),
    cpf VARCHAR(14) UNIQUE,
    rg VARCHAR(20),
    data_nascimento DATE,
    genero ENUM('masculino', 'feminino', 'outro', 'nao_informado'),
    estado_civil ENUM('solteiro', 'casado', 'divorciado', 'viuvo', 'uniao_estavel'),
    nome_mae VARCHAR(200),
    nome_pai VARCHAR(200),
    
    -- Dados Pessoa Jurídica
    razao_social VARCHAR(200),
    nome_fantasia VARCHAR(200),
    cnpj VARCHAR(18) UNIQUE,
    inscricao_estadual VARCHAR(20),
    inscricao_municipal VARCHAR(20),
    data_fundacao DATE,
    
    -- Dados Comuns
    telefone VARCHAR(20),
    celular VARCHAR(20),
    email VARCHAR(100),
    site VARCHAR(100),
    observacoes TEXT,
    status ENUM('ativo', 'inativo', 'bloqueado') DEFAULT 'ativo',
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL,
    
    FOREIGN KEY (id_administradora) REFERENCES administradoras(id),
    INDEX idx_cpf (cpf),
    INDEX idx_cnpj (cnpj),
    INDEX idx_tipo (tipo_pessoa),
    INDEX idx_status (status),
    INDEX idx_admin (id_administradora)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabela de Endereços (Múltiplos por Pessoa)
CREATE TABLE IF NOT EXISTS enderecos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_administradora INT NOT NULL,
    pessoa_id INT NOT NULL,
    tipo_endereco ENUM('residencial', 'comercial', 'cobranca', 'entrega', 'outro') NOT NULL,
    principal BOOLEAN DEFAULT FALSE,
    
    cep VARCHAR(9) NOT NULL,
    logradouro VARCHAR(200) NOT NULL,
    numero VARCHAR(20) NOT NULL,
    complemento VARCHAR(100),
    bairro VARCHAR(100) NOT NULL,
    cidade VARCHAR(100) NOT NULL,
    estado CHAR(2) NOT NULL,
    pais VARCHAR(50) DEFAULT 'Brasil',
    
    observacoes TEXT,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL,
    
    FOREIGN KEY (id_administradora) REFERENCES administradoras(id),
    FOREIGN KEY (pessoa_id) REFERENCES pessoas(id) ON DELETE CASCADE,
    INDEX idx_pessoa (pessoa_id),
    INDEX idx_tipo (tipo_endereco),
    INDEX idx_cep (cep),
    INDEX idx_admin (id_administradora)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabela de Dados Bancários (Múltiplas Contas por Pessoa)
CREATE TABLE IF NOT EXISTS dados_bancarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_administradora INT NOT NULL,
    pessoa_id INT NOT NULL,
    principal BOOLEAN DEFAULT FALSE,
    
    banco_codigo VARCHAR(10) NOT NULL,
    banco_nome VARCHAR(100) NOT NULL,
    agencia VARCHAR(10) NOT NULL,
    agencia_digito VARCHAR(2),
    conta VARCHAR(20) NOT NULL,
    conta_digito VARCHAR(2) NOT NULL,
    tipo_conta ENUM('corrente', 'poupanca', 'salario', 'pagamento') NOT NULL,
    
    pix_tipo ENUM('cpf', 'cnpj', 'email', 'telefone', 'chave_aleatoria'),
    pix_chave VARCHAR(100),
    
    observacoes TEXT,
    status ENUM('ativo', 'inativo') DEFAULT 'ativo',
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL,
    
    FOREIGN KEY (id_administradora) REFERENCES administradoras(id),
    FOREIGN KEY (pessoa_id) REFERENCES pessoas(id) ON DELETE CASCADE,
    INDEX idx_pessoa (pessoa_id),
    INDEX idx_banco (banco_codigo),
    INDEX idx_status (status),
    INDEX idx_admin (id_administradora)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
