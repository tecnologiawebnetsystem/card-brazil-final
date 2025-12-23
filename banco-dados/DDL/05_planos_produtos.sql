-- =====================================================
-- SCRIPT DDL: PLANOS E PRODUTOS
-- Banco: MySQL 8.0+
-- =====================================================

USE cardbrazil;

-- Adicionando id_administradora em todas as tabelas para multi-tenant

-- Tabela de Planos
CREATE TABLE IF NOT EXISTS planos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_administradora INT NOT NULL,
    operadora_id INT NOT NULL,
    
    codigo VARCHAR(50) NOT NULL,
    nome VARCHAR(255) NOT NULL,
    tipo ENUM('ambulatorial', 'hospitalar', 'odontologico', 'completo') NOT NULL,
    abrangencia ENUM('municipal', 'estadual', 'regional', 'nacional') NOT NULL,
    
    coparticipacao BOOLEAN DEFAULT FALSE,
    valor_coparticipacao DECIMAL(10,2),
    
    carencia_consulta INT DEFAULT 0,
    carencia_exame INT DEFAULT 0,
    carencia_internacao INT DEFAULT 0,
    carencia_parto INT DEFAULT 0,
    
    descricao TEXT,
    observacoes TEXT,
    status ENUM('ativo', 'inativo', 'suspenso') DEFAULT 'ativo',
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL,
    
    FOREIGN KEY (id_administradora) REFERENCES administradoras(id),
    FOREIGN KEY (operadora_id) REFERENCES operadoras(id) ON DELETE CASCADE,
    UNIQUE KEY unique_codigo_admin (codigo, id_administradora),
    INDEX idx_operadora (operadora_id),
    INDEX idx_tipo (tipo),
    INDEX idx_status (status),
    INDEX idx_admin (id_administradora)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabela de Produtos (Faixas Etárias dos Planos)
CREATE TABLE IF NOT EXISTS produtos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_administradora INT NOT NULL,
    plano_id INT NOT NULL,
    
    codigo VARCHAR(50) NOT NULL,
    nome VARCHAR(255) NOT NULL,
    categoria ENUM('individual', 'familiar', 'empresarial', 'coletivo_adesao') NOT NULL,
    
    faixa_etaria_inicio INT NOT NULL,
    faixa_etaria_fim INT NOT NULL,
    
    valor_mensalidade DECIMAL(10,2) NOT NULL,
    valor_adesao DECIMAL(10,2),
    
    descricao TEXT,
    observacoes TEXT,
    status ENUM('ativo', 'inativo') DEFAULT 'ativo',
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL,
    
    FOREIGN KEY (id_administradora) REFERENCES administradoras(id),
    FOREIGN KEY (plano_id) REFERENCES planos(id) ON DELETE CASCADE,
    UNIQUE KEY unique_codigo_admin (codigo, id_administradora),
    INDEX idx_plano (plano_id),
    INDEX idx_categoria (categoria),
    INDEX idx_faixa_etaria (faixa_etaria_inicio, faixa_etaria_fim),
    INDEX idx_status (status),
    INDEX idx_admin (id_administradora)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabela de Contratos
CREATE TABLE IF NOT EXISTS contratos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_administradora INT NOT NULL,
    estipulante_id INT NOT NULL,
    plano_id INT NOT NULL,
    
    numero_contrato VARCHAR(50) NOT NULL,
    data_inicio DATE NOT NULL,
    data_fim DATE,
    data_vencimento INT NOT NULL,
    
    valor_total DECIMAL(10,2) NOT NULL,
    forma_pagamento ENUM('boleto', 'debito_automatico', 'cartao_credito', 'pix') NOT NULL,
    
    observacoes TEXT,
    status ENUM('ativo', 'suspenso', 'cancelado', 'vencido') DEFAULT 'ativo',
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL,
    
    FOREIGN KEY (id_administradora) REFERENCES administradoras(id),
    FOREIGN KEY (estipulante_id) REFERENCES estipulantes(id) ON DELETE CASCADE,
    FOREIGN KEY (plano_id) REFERENCES planos(id) ON DELETE CASCADE,
    UNIQUE KEY unique_numero_admin (numero_contrato, id_administradora),
    INDEX idx_estipulante (estipulante_id),
    INDEX idx_plano (plano_id),
    INDEX idx_status (status),
    INDEX idx_data_inicio (data_inicio),
    INDEX idx_admin (id_administradora)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabela de Beneficiários
CREATE TABLE IF NOT EXISTS beneficiarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_administradora INT NOT NULL,
    contrato_id INT NOT NULL,
    pessoa_id INT NOT NULL,
    
    numero_carteirinha VARCHAR(50) NOT NULL,
    tipo_beneficiario ENUM('titular', 'dependente') NOT NULL,
    titular_id INT,
    
    parentesco ENUM('titular', 'conjuge', 'filho', 'pai', 'mae', 'outro'),
    
    data_inclusao DATE NOT NULL,
    data_exclusao DATE,
    motivo_exclusao TEXT,
    
    observacoes TEXT,
    status ENUM('ativo', 'suspenso', 'cancelado') DEFAULT 'ativo',
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL,
    
    FOREIGN KEY (id_administradora) REFERENCES administradoras(id),
    FOREIGN KEY (contrato_id) REFERENCES contratos(id) ON DELETE CASCADE,
    FOREIGN KEY (pessoa_id) REFERENCES pessoas(id) ON DELETE CASCADE,
    FOREIGN KEY (titular_id) REFERENCES beneficiarios(id) ON DELETE SET NULL,
    UNIQUE KEY unique_carteirinha_admin (numero_carteirinha, id_administradora),
    INDEX idx_contrato (contrato_id),
    INDEX idx_pessoa (pessoa_id),
    INDEX idx_titular (titular_id),
    INDEX idx_tipo (tipo_beneficiario),
    INDEX idx_status (status),
    INDEX idx_admin (id_administradora)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
