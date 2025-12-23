-- =====================================================
-- SCRIPT DDL: MÓDULO FINANCEIRO COMPLETO
-- Banco: MySQL 8.0+
-- Descrição: Contas a Pagar, Contas a Receber, Fluxo de Caixa,
--            Cobrança Judicial, Multas e Juros, PIX/QR Code
-- =====================================================

USE cardbrazil;

-- =====================================================
-- CONTAS A RECEBER
-- =====================================================

CREATE TABLE IF NOT EXISTS contas_receber (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_administradora INT NOT NULL,
    
    -- Relacionamentos
    beneficiario_id INT,
    proposta_id INT,
    contrato_id INT,
    
    -- Dados da Conta
    numero_documento VARCHAR(100) NOT NULL,
    descricao TEXT NOT NULL,
    categoria ENUM('mensalidade', 'adesao', 'coparticipacao', 'taxa', 'multa', 'juros', 'outro') NOT NULL,
    
    -- Valores
    valor_original DECIMAL(10,2) NOT NULL,
    valor_multa DECIMAL(10,2) DEFAULT 0,
    valor_juros DECIMAL(10,2) DEFAULT 0,
    valor_desconto DECIMAL(10,2) DEFAULT 0,
    valor_total DECIMAL(10,2) NOT NULL,
    valor_pago DECIMAL(10,2) DEFAULT 0,
    
    -- Datas
    data_emissao DATE NOT NULL,
    data_vencimento DATE NOT NULL,
    data_pagamento DATE,
    
    -- Status e Controle
    status ENUM('pendente', 'pago', 'parcial', 'vencido', 'cancelado') DEFAULT 'pendente',
    dias_atraso INT DEFAULT 0,
    
    -- Forma de Pagamento
    forma_pagamento ENUM('boleto', 'pix', 'cartao_credito', 'cartao_debito', 'transferencia', 'dinheiro'),
    codigo_barras VARCHAR(200),
    linha_digitavel VARCHAR(200),
    pix_qrcode TEXT,
    pix_chave VARCHAR(200),
    
    -- Observações
    observacoes TEXT,
    
    -- Auditoria
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL,
    created_by INT,
    updated_by INT,
    
    FOREIGN KEY (id_administradora) REFERENCES administradoras(id),
    FOREIGN KEY (beneficiario_id) REFERENCES beneficiarios(id) ON DELETE SET NULL,
    FOREIGN KEY (proposta_id) REFERENCES propostas(id) ON DELETE SET NULL,
    FOREIGN KEY (contrato_id) REFERENCES contratos(id) ON DELETE SET NULL,
    FOREIGN KEY (created_by) REFERENCES usuarios(id) ON DELETE SET NULL,
    FOREIGN KEY (updated_by) REFERENCES usuarios(id) ON DELETE SET NULL,
    
    INDEX idx_admin (id_administradora),
    INDEX idx_beneficiario (beneficiario_id),
    INDEX idx_proposta (proposta_id),
    INDEX idx_contrato (contrato_id),
    INDEX idx_status (status),
    INDEX idx_vencimento (data_vencimento),
    INDEX idx_categoria (categoria),
    UNIQUE KEY unique_documento (id_administradora, numero_documento)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- CONTAS A PAGAR
-- =====================================================

CREATE TABLE IF NOT EXISTS contas_pagar (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_administradora INT NOT NULL,
    
    -- Relacionamentos
    fornecedor_id INT,
    beneficiario_id INT,
    proposta_id INT,
    
    -- Dados da Conta
    numero_documento VARCHAR(100) NOT NULL,
    descricao TEXT NOT NULL,
    categoria ENUM('restituicao', 'reembolso', 'pagamento_duplicado', 'servicos_medicos', 'exames', 
                   'medicamentos', 'internacoes', 'consultas', 'fornecedores', 'impostos', 'outro') NOT NULL,
    tipo_conta ENUM('restituicao_beneficiario', 'reembolso_procedimento', 'pagamento_duplicado', 
                    'fornecedor', 'operacional', 'outro') NOT NULL,
    
    -- Valores
    valor_original DECIMAL(10,2) NOT NULL,
    valor_multa DECIMAL(10,2) DEFAULT 0,
    valor_juros DECIMAL(10,2) DEFAULT 0,
    valor_desconto DECIMAL(10,2) DEFAULT 0,
    valor_total DECIMAL(10,2) NOT NULL,
    valor_pago DECIMAL(10,2) DEFAULT 0,
    
    -- Datas
    data_emissao DATE NOT NULL,
    data_vencimento DATE NOT NULL,
    data_pagamento DATE,
    
    -- Status e Controle
    status ENUM('pendente', 'pago', 'parcial', 'vencido', 'cancelado', 'programado') DEFAULT 'pendente',
    dias_atraso INT DEFAULT 0,
    
    -- Forma de Pagamento
    forma_pagamento ENUM('transferencia', 'pix', 'boleto', 'cheque', 'dinheiro', 'cartao'),
    conta_bancaria_id INT,
    
    -- Dados Bancários do Favorecido
    favorecido_nome VARCHAR(200),
    favorecido_cpf_cnpj VARCHAR(20),
    favorecido_banco VARCHAR(10),
    favorecido_agencia VARCHAR(10),
    favorecido_conta VARCHAR(20),
    favorecido_tipo_conta ENUM('corrente', 'poupanca'),
    favorecido_pix_chave VARCHAR(200),
    
    -- Observações
    observacoes TEXT,
    motivo_restituicao TEXT,
    
    -- Auditoria
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL,
    created_by INT,
    updated_by INT,
    
    FOREIGN KEY (id_administradora) REFERENCES administradoras(id),
    FOREIGN KEY (fornecedor_id) REFERENCES pessoas(id) ON DELETE SET NULL,
    FOREIGN KEY (beneficiario_id) REFERENCES beneficiarios(id) ON DELETE SET NULL,
    FOREIGN KEY (proposta_id) REFERENCES propostas(id) ON DELETE SET NULL,
    FOREIGN KEY (conta_bancaria_id) REFERENCES bancos(id) ON DELETE SET NULL,
    FOREIGN KEY (created_by) REFERENCES usuarios(id) ON DELETE SET NULL,
    FOREIGN KEY (updated_by) REFERENCES usuarios(id) ON DELETE SET NULL,
    
    INDEX idx_admin (id_administradora),
    INDEX idx_fornecedor (fornecedor_id),
    INDEX idx_beneficiario (beneficiario_id),
    INDEX idx_proposta (proposta_id),
    INDEX idx_status (status),
    INDEX idx_vencimento (data_vencimento),
    INDEX idx_categoria (categoria),
    INDEX idx_tipo_conta (tipo_conta),
    UNIQUE KEY unique_documento (id_administradora, numero_documento)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- FLUXO DE CAIXA
-- =====================================================

CREATE TABLE IF NOT EXISTS fluxo_caixa (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_administradora INT NOT NULL,
    
    -- Relacionamentos
    conta_receber_id INT,
    conta_pagar_id INT,
    conta_bancaria_id INT,
    
    -- Dados da Movimentação
    tipo ENUM('entrada', 'saida') NOT NULL,
    categoria VARCHAR(100) NOT NULL,
    descricao TEXT NOT NULL,
    
    -- Valores
    valor DECIMAL(10,2) NOT NULL,
    
    -- Datas
    data_movimentacao DATE NOT NULL,
    data_competencia DATE NOT NULL,
    
    -- Status
    status ENUM('realizado', 'previsto', 'cancelado') DEFAULT 'previsto',
    
    -- Conta Bancária
    conta_origem VARCHAR(200),
    conta_destino VARCHAR(200),
    
    -- Observações
    observacoes TEXT,
    
    -- Auditoria
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL,
    created_by INT,
    
    FOREIGN KEY (id_administradora) REFERENCES administradoras(id),
    FOREIGN KEY (conta_receber_id) REFERENCES contas_receber(id) ON DELETE SET NULL,
    FOREIGN KEY (conta_pagar_id) REFERENCES contas_pagar(id) ON DELETE SET NULL,
    FOREIGN KEY (conta_bancaria_id) REFERENCES bancos(id) ON DELETE SET NULL,
    FOREIGN KEY (created_by) REFERENCES usuarios(id) ON DELETE SET NULL,
    
    INDEX idx_admin (id_administradora),
    INDEX idx_tipo (tipo),
    INDEX idx_categoria (categoria),
    INDEX idx_status (status),
    INDEX idx_data_movimentacao (data_movimentacao),
    INDEX idx_data_competencia (data_competencia)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- COBRANÇA JUDICIAL
-- =====================================================

CREATE TABLE IF NOT EXISTS advogados (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_administradora INT NOT NULL,
    
    -- Dados do Advogado
    nome VARCHAR(200) NOT NULL,
    oab VARCHAR(20) NOT NULL,
    oab_uf CHAR(2) NOT NULL,
    cpf VARCHAR(14) NOT NULL,
    
    -- Contato
    email VARCHAR(200),
    telefone VARCHAR(20),
    celular VARCHAR(20),
    
    -- Endereço
    cep VARCHAR(10),
    logradouro VARCHAR(200),
    numero VARCHAR(20),
    complemento VARCHAR(100),
    bairro VARCHAR(100),
    cidade VARCHAR(100),
    uf CHAR(2),
    
    -- Status
    ativo BOOLEAN DEFAULT TRUE,
    
    -- Observações
    observacoes TEXT,
    
    -- Auditoria
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL,
    
    FOREIGN KEY (id_administradora) REFERENCES administradoras(id),
    
    INDEX idx_admin (id_administradora),
    INDEX idx_oab (oab, oab_uf),
    INDEX idx_cpf (cpf),
    INDEX idx_ativo (ativo),
    UNIQUE KEY unique_oab (id_administradora, oab, oab_uf)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS tribunais (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_administradora INT NOT NULL,
    
    -- Dados do Tribunal
    nome VARCHAR(200) NOT NULL,
    sigla VARCHAR(20),
    tipo ENUM('federal', 'estadual', 'trabalhista', 'eleitoral', 'militar') NOT NULL,
    instancia ENUM('primeira', 'segunda', 'superior', 'supremo') NOT NULL,
    
    -- Localização
    uf CHAR(2) NOT NULL,
    cidade VARCHAR(100),
    
    -- Contato
    telefone VARCHAR(20),
    email VARCHAR(200),
    site VARCHAR(200),
    
    -- Endereço
    cep VARCHAR(10),
    logradouro VARCHAR(200),
    numero VARCHAR(20),
    complemento VARCHAR(100),
    bairro VARCHAR(100),
    
    -- Status
    ativo BOOLEAN DEFAULT TRUE,
    
    -- Auditoria
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (id_administradora) REFERENCES administradoras(id),
    
    INDEX idx_admin (id_administradora),
    INDEX idx_tipo (tipo),
    INDEX idx_uf (uf),
    INDEX idx_ativo (ativo)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS processos_judiciais (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_administradora INT NOT NULL,
    
    -- Relacionamentos
    beneficiario_id INT NOT NULL,
    advogado_id INT,
    tribunal_id INT,
    conta_receber_id INT,
    
    -- Dados do Processo
    numero_processo VARCHAR(50) NOT NULL,
    tipo_acao ENUM('cobranca', 'execucao', 'monitoria', 'outro') NOT NULL,
    valor_causa DECIMAL(10,2) NOT NULL,
    
    -- Datas
    data_distribuicao DATE NOT NULL,
    data_citacao DATE,
    data_audiencia DATE,
    data_sentenca DATE,
    data_transito_julgado DATE,
    
    -- Status
    status ENUM('em_andamento', 'suspenso', 'arquivado', 'sentenca_favoravel', 'sentenca_desfavoravel', 'acordo') DEFAULT 'em_andamento',
    fase_processual ENUM('inicial', 'citacao', 'contestacao', 'instrucao', 'sentenca', 'recurso', 'execucao', 'finalizado') DEFAULT 'inicial',
    
    -- Resultado
    resultado ENUM('procedente', 'improcedente', 'parcialmente_procedente', 'acordo', 'desistencia', 'em_andamento') DEFAULT 'em_andamento',
    valor_sentenca DECIMAL(10,2),
    valor_acordo DECIMAL(10,2),
    valor_recuperado DECIMAL(10,2) DEFAULT 0,
    
    -- Observações
    observacoes TEXT,
    historico JSON,
    
    -- Auditoria
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL,
    created_by INT,
    updated_by INT,
    
    FOREIGN KEY (id_administradora) REFERENCES administradoras(id),
    FOREIGN KEY (beneficiario_id) REFERENCES beneficiarios(id) ON DELETE CASCADE,
    FOREIGN KEY (advogado_id) REFERENCES advogados(id) ON DELETE SET NULL,
    FOREIGN KEY (tribunal_id) REFERENCES tribunais(id) ON DELETE SET NULL,
    FOREIGN KEY (conta_receber_id) REFERENCES contas_receber(id) ON DELETE SET NULL,
    FOREIGN KEY (created_by) REFERENCES usuarios(id) ON DELETE SET NULL,
    FOREIGN KEY (updated_by) REFERENCES usuarios(id) ON DELETE SET NULL,
    
    INDEX idx_admin (id_administradora),
    INDEX idx_beneficiario (beneficiario_id),
    INDEX idx_advogado (advogado_id),
    INDEX idx_tribunal (tribunal_id),
    INDEX idx_status (status),
    INDEX idx_fase (fase_processual),
    INDEX idx_numero_processo (numero_processo),
    UNIQUE KEY unique_processo (id_administradora, numero_processo)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- MULTAS E JUROS
-- =====================================================

CREATE TABLE IF NOT EXISTS configuracoes_multas_juros (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_administradora INT NOT NULL,
    
    -- Configuração
    nome VARCHAR(200) NOT NULL,
    descricao TEXT,
    
    -- Multa
    percentual_multa DECIMAL(5,2) NOT NULL DEFAULT 2.00,
    valor_fixo_multa DECIMAL(10,2) DEFAULT 0,
    
    -- Juros
    percentual_juros_mensal DECIMAL(5,2) NOT NULL DEFAULT 1.00,
    percentual_juros_diario DECIMAL(5,4),
    tipo_calculo_juros ENUM('simples', 'composto') DEFAULT 'simples',
    
    -- Carência
    dias_carencia INT DEFAULT 0,
    
    -- Aplicação
    aplicar_multa BOOLEAN DEFAULT TRUE,
    aplicar_juros BOOLEAN DEFAULT TRUE,
    
    -- Texto Padrão para Boleto/PIX
    texto_padrao_boleto TEXT,
    texto_padrao_pix TEXT,
    
    -- Configuração PIX/QR Code
    pix_chave VARCHAR(200),
    pix_tipo_chave ENUM('cpf', 'cnpj', 'email', 'telefone', 'aleatoria'),
    pix_nome_recebedor VARCHAR(200),
    pix_cidade VARCHAR(100),
    
    -- Status
    ativo BOOLEAN DEFAULT TRUE,
    padrao BOOLEAN DEFAULT FALSE,
    
    -- Auditoria
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL,
    created_by INT,
    updated_by INT,
    
    FOREIGN KEY (id_administradora) REFERENCES administradoras(id),
    FOREIGN KEY (created_by) REFERENCES usuarios(id) ON DELETE SET NULL,
    FOREIGN KEY (updated_by) REFERENCES usuarios(id) ON DELETE SET NULL,
    
    INDEX idx_admin (id_administradora),
    INDEX idx_ativo (ativo),
    INDEX idx_padrao (padrao)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS historico_multas_juros (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_administradora INT NOT NULL,
    
    -- Relacionamentos
    conta_receber_id INT NOT NULL,
    configuracao_id INT,
    
    -- Cálculo
    dias_atraso INT NOT NULL,
    valor_original DECIMAL(10,2) NOT NULL,
    valor_multa DECIMAL(10,2) NOT NULL,
    valor_juros DECIMAL(10,2) NOT NULL,
    valor_total DECIMAL(10,2) NOT NULL,
    
    -- Detalhamento
    percentual_multa_aplicado DECIMAL(5,2),
    percentual_juros_aplicado DECIMAL(5,2),
    
    -- Data
    data_calculo DATE NOT NULL,
    data_referencia DATE NOT NULL,
    
    -- Auditoria
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by INT,
    
    FOREIGN KEY (id_administradora) REFERENCES administradoras(id),
    FOREIGN KEY (conta_receber_id) REFERENCES contas_receber(id) ON DELETE CASCADE,
    FOREIGN KEY (configuracao_id) REFERENCES configuracoes_multas_juros(id) ON DELETE SET NULL,
    FOREIGN KEY (created_by) REFERENCES usuarios(id) ON DELETE SET NULL,
    
    INDEX idx_admin (id_administradora),
    INDEX idx_conta_receber (conta_receber_id),
    INDEX idx_data_calculo (data_calculo)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
