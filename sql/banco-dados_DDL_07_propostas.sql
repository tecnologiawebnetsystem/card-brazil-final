USE cardbrazil;

-- =====================================================
-- TABELA: propostas
-- Descrição: Armazena as propostas de planos de saúde
-- =====================================================
CREATE TABLE IF NOT EXISTS propostas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_administradora INT NOT NULL,
    
    -- Dados do Proponente
    nome_proponente VARCHAR(255) NOT NULL,
    cpf_cnpj VARCHAR(18) NOT NULL,
    email VARCHAR(255),
    telefone VARCHAR(20),
    
    -- Dados da Empresa
    empresa VARCHAR(255),
    numero_funcionarios VARCHAR(20),
    
    -- Detalhes da Proposta
    tipo_plano ENUM('ambulatorial', 'hospitalar', 'odontologico', 'completo') NOT NULL,
    valor_proposto DECIMAL(10, 2),
    observacoes TEXT,
    
    -- Status e Análise
    status ENUM('pendente', 'em_analise', 'aprovada', 'rejeitada', 'contrato_gerado') DEFAULT 'pendente',
    parecer TEXT,
    analisado_por INT,
    data_analise DATETIME,
    
    -- Score de Avaliação (para aprovação rápida)
    score_financeiro INT DEFAULT 0,
    score_documentacao INT DEFAULT 0,
    score_historico INT DEFAULT 0,
    
    -- Contrato
    numero_contrato VARCHAR(50),
    data_contrato DATETIME,
    
    -- Auditoria
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL,
    
    -- Foreign Keys
    FOREIGN KEY (id_administradora) REFERENCES administradoras(id),
    FOREIGN KEY (analisado_por) REFERENCES usuarios(id),
    
    -- Índices
    INDEX idx_status (status),
    INDEX idx_cpf_cnpj (cpf_cnpj),
    INDEX idx_data_analise (data_analise),
    INDEX idx_administradora (id_administradora),
    INDEX idx_deleted (deleted_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

SELECT 'Tabela propostas criada com sucesso!' AS status;
