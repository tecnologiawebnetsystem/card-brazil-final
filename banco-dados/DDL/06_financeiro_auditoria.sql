-- =====================================================
-- SCRIPT DDL: FINANCEIRO E AUDITORIA
-- Banco: MySQL 8.0+
-- =====================================================

USE cardbrazil;

-- Adicionando id_administradora em todas as tabelas para multi-tenant

-- Tabela de Movimentações Financeiras
CREATE TABLE IF NOT EXISTS movimentacoes_financeiras (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_administradora INT NOT NULL,
    contrato_id INT NOT NULL,
    beneficiario_id INT,
    
    tipo_movimentacao ENUM('mensalidade', 'adesao', 'coparticipacao', 'reembolso', 'multa', 'ajuste', 'outro') NOT NULL,
    tipo_operacao ENUM('credito', 'debito') NOT NULL,
    
    valor DECIMAL(10,2) NOT NULL,
    data_vencimento DATE NOT NULL,
    data_pagamento DATE,
    
    forma_pagamento ENUM('boleto', 'debito_automatico', 'cartao_credito', 'pix', 'dinheiro', 'transferencia'),
    numero_documento VARCHAR(100),
    
    descricao TEXT,
    observacoes TEXT,
    status ENUM('pendente', 'pago', 'atrasado', 'cancelado') DEFAULT 'pendente',
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL,
    
    FOREIGN KEY (id_administradora) REFERENCES administradoras(id),
    FOREIGN KEY (contrato_id) REFERENCES contratos(id) ON DELETE CASCADE,
    FOREIGN KEY (beneficiario_id) REFERENCES beneficiarios(id) ON DELETE SET NULL,
    INDEX idx_contrato (contrato_id),
    INDEX idx_beneficiario (beneficiario_id),
    INDEX idx_tipo_movimentacao (tipo_movimentacao),
    INDEX idx_status (status),
    INDEX idx_data_vencimento (data_vencimento),
    INDEX idx_data_pagamento (data_pagamento),
    INDEX idx_admin (id_administradora)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabela de Auditoria (Log de Alterações)
CREATE TABLE IF NOT EXISTS auditoria (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_administradora INT NOT NULL,
    usuario_id INT,
    
    tabela VARCHAR(100) NOT NULL,
    registro_id INT NOT NULL,
    acao ENUM('INSERT', 'UPDATE', 'DELETE') NOT NULL,
    
    dados_anteriores JSON,
    dados_novos JSON,
    
    ip_address VARCHAR(45),
    user_agent TEXT,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (id_administradora) REFERENCES administradoras(id),
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE SET NULL,
    INDEX idx_tabela (tabela),
    INDEX idx_registro (registro_id),
    INDEX idx_acao (acao),
    INDEX idx_usuario (usuario_id),
    INDEX idx_created_at (created_at),
    INDEX idx_admin (id_administradora)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabela de Alçadas (Limites de Aprovação)
CREATE TABLE IF NOT EXISTS alcadas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_administradora INT NOT NULL,
    role_id INT NOT NULL,
    
    tipo_operacao VARCHAR(100) NOT NULL,
    valor_minimo DECIMAL(10,2) DEFAULT 0,
    valor_maximo DECIMAL(10,2),
    
    requer_aprovacao BOOLEAN DEFAULT FALSE,
    aprovador_role_id INT,
    
    descricao TEXT,
    ativo BOOLEAN DEFAULT TRUE,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (id_administradora) REFERENCES administradoras(id),
    FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE,
    FOREIGN KEY (aprovador_role_id) REFERENCES roles(id) ON DELETE SET NULL,
    INDEX idx_role (role_id),
    INDEX idx_tipo_operacao (tipo_operacao),
    INDEX idx_ativo (ativo),
    INDEX idx_admin (id_administradora)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabela de Permissões
CREATE TABLE IF NOT EXISTS permissoes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_administradora INT NOT NULL,
    role_id INT NOT NULL,
    
    modulo VARCHAR(100) NOT NULL,
    acao VARCHAR(50) NOT NULL,
    
    permitido BOOLEAN DEFAULT TRUE,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (id_administradora) REFERENCES administradoras(id),
    FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE,
    UNIQUE KEY unique_role_modulo_acao (role_id, modulo, acao),
    INDEX idx_role (role_id),
    INDEX idx_modulo (modulo),
    INDEX idx_admin (id_administradora)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
