-- =============================================================================
-- CARD BRAZIL - ESTRUTURA COMPLETA DO BANCO DE DADOS MySQL
-- Sistema de Gestao de Planos de Saude
-- =============================================================================

-- Configuracoes iniciais
SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- =============================================================================
-- 1. TABELAS BASE - PESSOAS E ENDERECOS
-- =============================================================================

-- Tabela de Pessoas (base para todos os cadastros)
CREATE TABLE IF NOT EXISTS `pessoas` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `tipo_pessoa` ENUM('fisica', 'juridica') NOT NULL DEFAULT 'fisica',
  `nome` VARCHAR(255) NULL COMMENT 'Nome para pessoa fisica',
  `razao_social` VARCHAR(255) NULL COMMENT 'Razao social para pessoa juridica',
  `nome_fantasia` VARCHAR(255) NULL COMMENT 'Nome fantasia para pessoa juridica',
  `cpf` VARCHAR(14) NULL COMMENT 'CPF formatado',
  `cnpj` VARCHAR(18) NULL COMMENT 'CNPJ formatado',
  `rg` VARCHAR(20) NULL,
  `orgao_emissor` VARCHAR(20) NULL,
  `data_nascimento` DATE NULL,
  `data_fundacao` DATE NULL,
  `sexo` ENUM('M', 'F', 'O') NULL,
  `estado_civil` ENUM('solteiro', 'casado', 'divorciado', 'viuvo', 'uniao_estavel') NULL,
  `nacionalidade` VARCHAR(50) DEFAULT 'Brasileira',
  `naturalidade` VARCHAR(100) NULL,
  `nome_mae` VARCHAR(255) NULL,
  `nome_pai` VARCHAR(255) NULL,
  `inscricao_estadual` VARCHAR(30) NULL,
  `inscricao_municipal` VARCHAR(30) NULL,
  `codigo_atividade` VARCHAR(20) NULL,
  `telefone` VARCHAR(20) NULL,
  `celular` VARCHAR(20) NULL,
  `email` VARCHAR(255) NULL,
  `site` VARCHAR(255) NULL,
  `observacoes` TEXT NULL,
  `status` ENUM('ativo', 'inativo', 'pendente', 'bloqueado') NOT NULL DEFAULT 'ativo',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_cpf` (`cpf`),
  UNIQUE KEY `uk_cnpj` (`cnpj`),
  INDEX `idx_tipo_pessoa` (`tipo_pessoa`),
  INDEX `idx_status` (`status`),
  INDEX `idx_nome` (`nome`),
  INDEX `idx_razao_social` (`razao_social`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabela de Enderecos
CREATE TABLE IF NOT EXISTS `enderecos` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `pessoa_id` INT UNSIGNED NOT NULL,
  `tipo` ENUM('residencial', 'comercial', 'cobranca', 'correspondencia') NOT NULL DEFAULT 'comercial',
  `cep` VARCHAR(10) NOT NULL,
  `logradouro` VARCHAR(255) NOT NULL,
  `numero` VARCHAR(20) NOT NULL,
  `complemento` VARCHAR(100) NULL,
  `bairro` VARCHAR(100) NOT NULL,
  `cidade` VARCHAR(100) NOT NULL,
  `estado` CHAR(2) NOT NULL,
  `pais` VARCHAR(50) DEFAULT 'Brasil',
  `referencia` VARCHAR(255) NULL,
  `principal` TINYINT(1) DEFAULT 0,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `idx_pessoa_id` (`pessoa_id`),
  INDEX `idx_cep` (`cep`),
  INDEX `idx_cidade` (`cidade`),
  CONSTRAINT `fk_enderecos_pessoa` FOREIGN KEY (`pessoa_id`) REFERENCES `pessoas` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabela de Dados Bancarios
CREATE TABLE IF NOT EXISTS `dados_bancarios` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `pessoa_id` INT UNSIGNED NOT NULL,
  `banco` VARCHAR(100) NOT NULL,
  `codigo_banco` VARCHAR(10) NULL,
  `agencia` VARCHAR(10) NOT NULL,
  `digito_agencia` VARCHAR(2) NULL,
  `tipo_conta` ENUM('corrente', 'poupanca', 'salario') NOT NULL DEFAULT 'corrente',
  `conta` VARCHAR(20) NOT NULL,
  `digito_conta` VARCHAR(2) NOT NULL,
  `titular` VARCHAR(255) NULL,
  `cpf_cnpj_titular` VARCHAR(18) NULL,
  `pix_tipo` ENUM('cpf', 'cnpj', 'email', 'telefone', 'aleatoria') NULL,
  `pix_chave` VARCHAR(255) NULL,
  `principal` TINYINT(1) DEFAULT 0,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `idx_pessoa_id` (`pessoa_id`),
  INDEX `idx_banco` (`banco`),
  CONSTRAINT `fk_dados_bancarios_pessoa` FOREIGN KEY (`pessoa_id`) REFERENCES `pessoas` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================================================
-- 2. TABELAS DE CADASTROS - OPERADORAS, ADMINISTRADORAS, CORRETORES, ETC.
-- =============================================================================

-- Tabela de Operadoras
CREATE TABLE IF NOT EXISTS `operadoras` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `pessoa_id` INT UNSIGNED NOT NULL,
  `natureza_operadora` VARCHAR(100) NOT NULL COMMENT 'Autogestao, Cooperativa, Filantropia, etc.',
  `registro_ans` VARCHAR(20) NOT NULL,
  `modalidade` VARCHAR(50) NULL COMMENT 'Medicina de grupo, seguradora, etc.',
  `segmento` VARCHAR(50) NULL COMMENT 'Ambulatorial, hospitalar, odontologico',
  `porte` ENUM('pequeno', 'medio', 'grande') NULL,
  `ativo` TINYINT(1) DEFAULT 1,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_registro_ans` (`registro_ans`),
  INDEX `idx_pessoa_id` (`pessoa_id`),
  INDEX `idx_ativo` (`ativo`),
  CONSTRAINT `fk_operadoras_pessoa` FOREIGN KEY (`pessoa_id`) REFERENCES `pessoas` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabela de Administradoras
CREATE TABLE IF NOT EXISTS `administradoras` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `pessoa_id` INT UNSIGNED NOT NULL,
  `registro_ans` VARCHAR(20) NULL,
  `tipo_administradora` VARCHAR(50) NULL,
  `ativo` TINYINT(1) DEFAULT 1,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `idx_pessoa_id` (`pessoa_id`),
  CONSTRAINT `fk_administradoras_pessoa` FOREIGN KEY (`pessoa_id`) REFERENCES `pessoas` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabela de Corretores
CREATE TABLE IF NOT EXISTS `corretores` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `pessoa_id` INT UNSIGNED NOT NULL,
  `registro_susep` VARCHAR(30) NULL,
  `comissao_percentual` DECIMAL(5,2) DEFAULT 0.00,
  `situacao` ENUM('ativo', 'inativo', 'suspenso') NOT NULL DEFAULT 'ativo',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `idx_pessoa_id` (`pessoa_id`),
  INDEX `idx_situacao` (`situacao`),
  CONSTRAINT `fk_corretores_pessoa` FOREIGN KEY (`pessoa_id`) REFERENCES `pessoas` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabela de Agenciadores
CREATE TABLE IF NOT EXISTS `agenciadores` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `pessoa_id` INT UNSIGNED NOT NULL,
  `corretor_id` INT UNSIGNED NULL COMMENT 'Corretor responsavel',
  `comissao_percentual` DECIMAL(5,2) DEFAULT 0.00,
  `situacao` ENUM('ativo', 'inativo') NOT NULL DEFAULT 'ativo',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `idx_pessoa_id` (`pessoa_id`),
  INDEX `idx_corretor_id` (`corretor_id`),
  CONSTRAINT `fk_agenciadores_pessoa` FOREIGN KEY (`pessoa_id`) REFERENCES `pessoas` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `fk_agenciadores_corretor` FOREIGN KEY (`corretor_id`) REFERENCES `corretores` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabela de Estipulantes (Empresas contratantes)
CREATE TABLE IF NOT EXISTS `estipulantes` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `pessoa_id` INT UNSIGNED NOT NULL,
  `operadora_id` INT UNSIGNED NULL,
  `codigo_estipulante` VARCHAR(30) NULL,
  `data_contrato` DATE NULL,
  `situacao` ENUM('ativo', 'inativo', 'suspenso') NOT NULL DEFAULT 'ativo',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `idx_pessoa_id` (`pessoa_id`),
  INDEX `idx_operadora_id` (`operadora_id`),
  CONSTRAINT `fk_estipulantes_pessoa` FOREIGN KEY (`pessoa_id`) REFERENCES `pessoas` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `fk_estipulantes_operadora` FOREIGN KEY (`operadora_id`) REFERENCES `operadoras` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabela de Subestipulantes
CREATE TABLE IF NOT EXISTS `subestipulantes` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `pessoa_id` INT UNSIGNED NOT NULL,
  `estipulante_id` INT UNSIGNED NOT NULL,
  `codigo_subestipulante` VARCHAR(30) NULL,
  `situacao` ENUM('ativo', 'inativo') NOT NULL DEFAULT 'ativo',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `idx_pessoa_id` (`pessoa_id`),
  INDEX `idx_estipulante_id` (`estipulante_id`),
  CONSTRAINT `fk_subestipulantes_pessoa` FOREIGN KEY (`pessoa_id`) REFERENCES `pessoas` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `fk_subestipulantes_estipulante` FOREIGN KEY (`estipulante_id`) REFERENCES `estipulantes` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================================================
-- 3. TABELAS DE PLANOS E PRODUTOS
-- =============================================================================

-- Tabela de Planos de Saude
CREATE TABLE IF NOT EXISTS `planos` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `operadora_id` INT UNSIGNED NOT NULL,
  `codigo_plano` VARCHAR(30) NOT NULL,
  `nome` VARCHAR(255) NOT NULL,
  `registro_ans` VARCHAR(30) NULL,
  `tipo_contratacao` ENUM('individual', 'familiar', 'coletivo_empresarial', 'coletivo_adesao') NOT NULL,
  `segmentacao` ENUM('ambulatorial', 'hospitalar', 'hospitalar_obstetrico', 'odontologico', 'referencia') NOT NULL,
  `abrangencia` ENUM('municipal', 'grupo_municipios', 'estadual', 'grupo_estados', 'nacional') NOT NULL DEFAULT 'nacional',
  `acomodacao` ENUM('enfermaria', 'apartamento') NULL,
  `coparticipacao` TINYINT(1) DEFAULT 0,
  `franquia` TINYINT(1) DEFAULT 0,
  `reembolso` TINYINT(1) DEFAULT 1,
  `carencia_dias` INT DEFAULT 0,
  `valor_base` DECIMAL(10,2) NULL,
  `ativo` TINYINT(1) DEFAULT 1,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_codigo_plano_operadora` (`operadora_id`, `codigo_plano`),
  INDEX `idx_operadora_id` (`operadora_id`),
  INDEX `idx_tipo_contratacao` (`tipo_contratacao`),
  INDEX `idx_ativo` (`ativo`),
  CONSTRAINT `fk_planos_operadora` FOREIGN KEY (`operadora_id`) REFERENCES `operadoras` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabela de Faixas Etarias dos Planos
CREATE TABLE IF NOT EXISTS `planos_faixas_etarias` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `plano_id` INT UNSIGNED NOT NULL,
  `idade_minima` INT NOT NULL DEFAULT 0,
  `idade_maxima` INT NOT NULL DEFAULT 999,
  `valor` DECIMAL(10,2) NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `idx_plano_id` (`plano_id`),
  CONSTRAINT `fk_faixas_plano` FOREIGN KEY (`plano_id`) REFERENCES `planos` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabela de Produtos
CREATE TABLE IF NOT EXISTS `produtos` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `operadora_id` INT UNSIGNED NOT NULL,
  `codigo_produto` VARCHAR(30) NOT NULL,
  `nome` VARCHAR(255) NOT NULL,
  `descricao` TEXT NULL,
  `tipo` ENUM('saude', 'odontologico', 'vida', 'outros') NOT NULL DEFAULT 'saude',
  `ativo` TINYINT(1) DEFAULT 1,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `idx_operadora_id` (`operadora_id`),
  CONSTRAINT `fk_produtos_operadora` FOREIGN KEY (`operadora_id`) REFERENCES `operadoras` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabela de Convenios
CREATE TABLE IF NOT EXISTS `convenios` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `operadora_id` INT UNSIGNED NOT NULL,
  `pessoa_id` INT UNSIGNED NOT NULL COMMENT 'Prestador/Hospital/Clinica',
  `codigo_convenio` VARCHAR(30) NULL,
  `tipo_prestador` ENUM('hospital', 'clinica', 'laboratorio', 'consultorio', 'outros') NOT NULL,
  `especialidades` TEXT NULL,
  `data_inicio` DATE NULL,
  `data_fim` DATE NULL,
  `ativo` TINYINT(1) DEFAULT 1,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `idx_operadora_id` (`operadora_id`),
  INDEX `idx_pessoa_id` (`pessoa_id`),
  CONSTRAINT `fk_convenios_operadora` FOREIGN KEY (`operadora_id`) REFERENCES `operadoras` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `fk_convenios_pessoa` FOREIGN KEY (`pessoa_id`) REFERENCES `pessoas` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================================================
-- 4. TABELAS DE BENEFICIARIOS
-- =============================================================================

-- Tabela de Beneficiarios (Titulares e Dependentes)
CREATE TABLE IF NOT EXISTS `beneficiarios` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `pessoa_id` INT UNSIGNED NOT NULL,
  `titular_id` INT UNSIGNED NULL COMMENT 'NULL se for titular, ID do titular se for dependente',
  `estipulante_id` INT UNSIGNED NULL,
  `plano_id` INT UNSIGNED NOT NULL,
  `numero_carteirinha` VARCHAR(30) NULL,
  `codigo_beneficiario` VARCHAR(30) NULL,
  `tipo` ENUM('titular', 'dependente') NOT NULL DEFAULT 'titular',
  `parentesco` ENUM('titular', 'conjuge', 'filho', 'filha', 'enteado', 'enteada', 'pai', 'mae', 'outros') NOT NULL DEFAULT 'titular',
  `data_adesao` DATE NOT NULL,
  `data_vigencia_inicio` DATE NOT NULL,
  `data_vigencia_fim` DATE NULL,
  `data_exclusao` DATE NULL,
  `motivo_exclusao` VARCHAR(255) NULL,
  `carencia_cumprida` TINYINT(1) DEFAULT 0,
  `cpt` TINYINT(1) DEFAULT 0 COMMENT 'Cobertura Parcial Temporaria',
  `cpt_descricao` TEXT NULL,
  `valor_mensalidade` DECIMAL(10,2) NULL,
  `dia_vencimento` INT DEFAULT 10,
  `status` ENUM('ativo', 'inativo', 'suspenso', 'cancelado', 'aguardando_carencia') NOT NULL DEFAULT 'ativo',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_numero_carteirinha` (`numero_carteirinha`),
  INDEX `idx_pessoa_id` (`pessoa_id`),
  INDEX `idx_titular_id` (`titular_id`),
  INDEX `idx_estipulante_id` (`estipulante_id`),
  INDEX `idx_plano_id` (`plano_id`),
  INDEX `idx_status` (`status`),
  INDEX `idx_tipo` (`tipo`),
  CONSTRAINT `fk_beneficiarios_pessoa` FOREIGN KEY (`pessoa_id`) REFERENCES `pessoas` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `fk_beneficiarios_titular` FOREIGN KEY (`titular_id`) REFERENCES `beneficiarios` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `fk_beneficiarios_estipulante` FOREIGN KEY (`estipulante_id`) REFERENCES `estipulantes` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `fk_beneficiarios_plano` FOREIGN KEY (`plano_id`) REFERENCES `planos` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabela de Carencias
CREATE TABLE IF NOT EXISTS `carencias` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `beneficiario_id` INT UNSIGNED NOT NULL,
  `tipo_carencia` VARCHAR(100) NOT NULL COMMENT 'Urgencia, eletivo, parto, etc.',
  `dias_carencia` INT NOT NULL,
  `data_inicio` DATE NOT NULL,
  `data_fim` DATE NOT NULL,
  `cumprida` TINYINT(1) DEFAULT 0,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `idx_beneficiario_id` (`beneficiario_id`),
  CONSTRAINT `fk_carencias_beneficiario` FOREIGN KEY (`beneficiario_id`) REFERENCES `beneficiarios` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabela de Carteirinhas
CREATE TABLE IF NOT EXISTS `carteirinhas` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `beneficiario_id` INT UNSIGNED NOT NULL,
  `numero_carteirinha` VARCHAR(30) NOT NULL,
  `via` INT DEFAULT 1,
  `data_emissao` DATE NOT NULL,
  `data_validade` DATE NULL,
  `motivo_emissao` ENUM('primeira_via', 'segunda_via', 'renovacao', 'alteracao_dados') NOT NULL DEFAULT 'primeira_via',
  `status` ENUM('ativa', 'cancelada', 'vencida', 'bloqueada') NOT NULL DEFAULT 'ativa',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `idx_beneficiario_id` (`beneficiario_id`),
  INDEX `idx_numero_carteirinha` (`numero_carteirinha`),
  CONSTRAINT `fk_carteirinhas_beneficiario` FOREIGN KEY (`beneficiario_id`) REFERENCES `beneficiarios` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================================================
-- 5. TABELAS DE PROPOSTAS E CONTRATOS
-- =============================================================================

-- Tabela de Propostas
CREATE TABLE IF NOT EXISTS `propostas` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `numero_proposta` VARCHAR(30) NULL,
  `operadora_id` INT UNSIGNED NULL,
  `corretor_id` INT UNSIGNED NULL,
  `estipulante_id` INT UNSIGNED NULL,
  `nome_proponente` VARCHAR(255) NOT NULL,
  `cpf_cnpj_proponente` VARCHAR(18) NOT NULL,
  `email_proponente` VARCHAR(255) NULL,
  `telefone_proponente` VARCHAR(20) NULL,
  `nome_empresa` VARCHAR(255) NULL,
  `numero_funcionarios` VARCHAR(20) NULL,
  `tipo_plano` VARCHAR(50) NULL,
  `plano_id` INT UNSIGNED NULL,
  `valor_proposto` DECIMAL(10,2) NULL,
  `observacoes` TEXT NULL,
  `data_proposta` DATE NULL,
  `data_vigencia` DATE NULL,
  `status` ENUM('rascunho', 'pendente', 'em_analise', 'aprovada', 'recusada', 'cancelada', 'expirada') NOT NULL DEFAULT 'pendente',
  `motivo_recusa` TEXT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_numero_proposta` (`numero_proposta`),
  INDEX `idx_operadora_id` (`operadora_id`),
  INDEX `idx_corretor_id` (`corretor_id`),
  INDEX `idx_status` (`status`),
  CONSTRAINT `fk_propostas_operadora` FOREIGN KEY (`operadora_id`) REFERENCES `operadoras` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `fk_propostas_corretor` FOREIGN KEY (`corretor_id`) REFERENCES `corretores` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `fk_propostas_plano` FOREIGN KEY (`plano_id`) REFERENCES `planos` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabela de Contratos
CREATE TABLE IF NOT EXISTS `contratos` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `proposta_id` INT UNSIGNED NULL,
  `operadora_id` INT UNSIGNED NOT NULL,
  `estipulante_id` INT UNSIGNED NULL,
  `numero_contrato` VARCHAR(30) NOT NULL,
  `tipo_contrato` ENUM('individual', 'familiar', 'empresarial', 'adesao') NOT NULL,
  `data_inicio` DATE NOT NULL,
  `data_fim` DATE NULL,
  `dia_vencimento` INT DEFAULT 10,
  `valor_total` DECIMAL(10,2) NULL,
  `forma_pagamento` ENUM('boleto', 'debito_automatico', 'cartao_credito', 'pix') DEFAULT 'boleto',
  `status` ENUM('ativo', 'suspenso', 'cancelado', 'encerrado') NOT NULL DEFAULT 'ativo',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_numero_contrato` (`numero_contrato`),
  INDEX `idx_proposta_id` (`proposta_id`),
  INDEX `idx_operadora_id` (`operadora_id`),
  INDEX `idx_estipulante_id` (`estipulante_id`),
  INDEX `idx_status` (`status`),
  CONSTRAINT `fk_contratos_proposta` FOREIGN KEY (`proposta_id`) REFERENCES `propostas` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `fk_contratos_operadora` FOREIGN KEY (`operadora_id`) REFERENCES `operadoras` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `fk_contratos_estipulante` FOREIGN KEY (`estipulante_id`) REFERENCES `estipulantes` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================================================
-- 6. TABELAS FINANCEIRAS - COBRANCA E PAGAMENTOS
-- =============================================================================

-- Tabela de Faturas/Mensalidades
CREATE TABLE IF NOT EXISTS `faturas` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `contrato_id` INT UNSIGNED NULL,
  `beneficiario_id` INT UNSIGNED NULL,
  `estipulante_id` INT UNSIGNED NULL,
  `numero_fatura` VARCHAR(30) NULL,
  `competencia` DATE NOT NULL COMMENT 'Mes/Ano de referencia',
  `data_vencimento` DATE NOT NULL,
  `data_pagamento` DATE NULL,
  `valor_original` DECIMAL(10,2) NOT NULL,
  `valor_desconto` DECIMAL(10,2) DEFAULT 0.00,
  `valor_acrescimo` DECIMAL(10,2) DEFAULT 0.00,
  `valor_juros` DECIMAL(10,2) DEFAULT 0.00,
  `valor_multa` DECIMAL(10,2) DEFAULT 0.00,
  `valor_pago` DECIMAL(10,2) NULL,
  `valor_total` DECIMAL(10,2) GENERATED ALWAYS AS (valor_original - valor_desconto + valor_acrescimo + valor_juros + valor_multa) STORED,
  `forma_pagamento` ENUM('boleto', 'debito_automatico', 'cartao_credito', 'pix', 'dinheiro', 'transferencia') NULL,
  `status` ENUM('aberta', 'paga', 'parcial', 'vencida', 'cancelada', 'negociada') NOT NULL DEFAULT 'aberta',
  `observacoes` TEXT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `idx_contrato_id` (`contrato_id`),
  INDEX `idx_beneficiario_id` (`beneficiario_id`),
  INDEX `idx_estipulante_id` (`estipulante_id`),
  INDEX `idx_competencia` (`competencia`),
  INDEX `idx_data_vencimento` (`data_vencimento`),
  INDEX `idx_status` (`status`),
  CONSTRAINT `fk_faturas_contrato` FOREIGN KEY (`contrato_id`) REFERENCES `contratos` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `fk_faturas_beneficiario` FOREIGN KEY (`beneficiario_id`) REFERENCES `beneficiarios` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `fk_faturas_estipulante` FOREIGN KEY (`estipulante_id`) REFERENCES `estipulantes` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabela de Boletos
CREATE TABLE IF NOT EXISTS `boletos` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `fatura_id` INT UNSIGNED NOT NULL,
  `nosso_numero` VARCHAR(30) NOT NULL,
  `linha_digitavel` VARCHAR(60) NULL,
  `codigo_barras` VARCHAR(50) NULL,
  `banco` VARCHAR(10) NOT NULL,
  `agencia` VARCHAR(10) NULL,
  `conta` VARCHAR(20) NULL,
  `data_emissao` DATE NOT NULL,
  `data_vencimento` DATE NOT NULL,
  `data_pagamento` DATE NULL,
  `valor` DECIMAL(10,2) NOT NULL,
  `valor_pago` DECIMAL(10,2) NULL,
  `juros_dia` DECIMAL(5,2) DEFAULT 0.00,
  `multa_atraso` DECIMAL(5,2) DEFAULT 0.00,
  `desconto_antecipacao` DECIMAL(5,2) DEFAULT 0.00,
  `instrucoes` TEXT NULL,
  `status` ENUM('gerado', 'enviado', 'pago', 'vencido', 'cancelado', 'protestado') NOT NULL DEFAULT 'gerado',
  `url_pdf` VARCHAR(500) NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_nosso_numero` (`nosso_numero`),
  INDEX `idx_fatura_id` (`fatura_id`),
  INDEX `idx_data_vencimento` (`data_vencimento`),
  INDEX `idx_status` (`status`),
  CONSTRAINT `fk_boletos_fatura` FOREIGN KEY (`fatura_id`) REFERENCES `faturas` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabela de Pagamentos
CREATE TABLE IF NOT EXISTS `pagamentos` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `fatura_id` INT UNSIGNED NOT NULL,
  `boleto_id` INT UNSIGNED NULL,
  `data_pagamento` DATE NOT NULL,
  `valor_pago` DECIMAL(10,2) NOT NULL,
  `forma_pagamento` ENUM('boleto', 'debito_automatico', 'cartao_credito', 'pix', 'dinheiro', 'transferencia') NOT NULL,
  `banco_recebedor` VARCHAR(100) NULL,
  `numero_autenticacao` VARCHAR(100) NULL,
  `comprovante` VARCHAR(500) NULL,
  `observacoes` TEXT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `idx_fatura_id` (`fatura_id`),
  INDEX `idx_boleto_id` (`boleto_id`),
  INDEX `idx_data_pagamento` (`data_pagamento`),
  CONSTRAINT `fk_pagamentos_fatura` FOREIGN KEY (`fatura_id`) REFERENCES `faturas` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `fk_pagamentos_boleto` FOREIGN KEY (`boleto_id`) REFERENCES `boletos` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabela de Inadimplencia
CREATE TABLE IF NOT EXISTS `inadimplencia` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `beneficiario_id` INT UNSIGNED NULL,
  `estipulante_id` INT UNSIGNED NULL,
  `fatura_id` INT UNSIGNED NOT NULL,
  `dias_atraso` INT NOT NULL DEFAULT 0,
  `valor_devido` DECIMAL(10,2) NOT NULL,
  `valor_juros_acumulado` DECIMAL(10,2) DEFAULT 0.00,
  `valor_multa_acumulado` DECIMAL(10,2) DEFAULT 0.00,
  `status` ENUM('em_atraso', 'negociando', 'protestado', 'cobranca_judicial', 'quitado', 'baixado') NOT NULL DEFAULT 'em_atraso',
  `data_notificacao` DATE NULL,
  `data_suspensao` DATE NULL,
  `data_cancelamento` DATE NULL,
  `observacoes` TEXT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `idx_beneficiario_id` (`beneficiario_id`),
  INDEX `idx_estipulante_id` (`estipulante_id`),
  INDEX `idx_fatura_id` (`fatura_id`),
  INDEX `idx_status` (`status`),
  CONSTRAINT `fk_inadimplencia_beneficiario` FOREIGN KEY (`beneficiario_id`) REFERENCES `beneficiarios` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `fk_inadimplencia_estipulante` FOREIGN KEY (`estipulante_id`) REFERENCES `estipulantes` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `fk_inadimplencia_fatura` FOREIGN KEY (`fatura_id`) REFERENCES `faturas` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabela de Negociacao de Debitos
CREATE TABLE IF NOT EXISTS `negociacoes` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `inadimplencia_id` INT UNSIGNED NOT NULL,
  `valor_original` DECIMAL(10,2) NOT NULL,
  `valor_negociado` DECIMAL(10,2) NOT NULL,
  `desconto_concedido` DECIMAL(10,2) DEFAULT 0.00,
  `numero_parcelas` INT DEFAULT 1,
  `data_negociacao` DATE NOT NULL,
  `data_primeiro_vencimento` DATE NOT NULL,
  `status` ENUM('ativa', 'quitada', 'cancelada', 'inadimplente') NOT NULL DEFAULT 'ativa',
  `observacoes` TEXT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `idx_inadimplencia_id` (`inadimplencia_id`),
  CONSTRAINT `fk_negociacoes_inadimplencia` FOREIGN KEY (`inadimplencia_id`) REFERENCES `inadimplencia` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================================================
-- 7. TABELAS CONTABEIS
-- =============================================================================

-- Tabela de Plano de Contas
CREATE TABLE IF NOT EXISTS `plano_contas` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `codigo` VARCHAR(20) NOT NULL,
  `descricao` VARCHAR(255) NOT NULL,
  `tipo` ENUM('ativo', 'passivo', 'receita', 'despesa', 'patrimonio') NOT NULL,
  `natureza` ENUM('devedora', 'credora') NOT NULL,
  `nivel` INT NOT NULL DEFAULT 1,
  `conta_pai_id` INT UNSIGNED NULL,
  `aceita_lancamento` TINYINT(1) DEFAULT 1,
  `ativo` TINYINT(1) DEFAULT 1,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_codigo` (`codigo`),
  INDEX `idx_conta_pai_id` (`conta_pai_id`),
  CONSTRAINT `fk_plano_contas_pai` FOREIGN KEY (`conta_pai_id`) REFERENCES `plano_contas` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabela de Lancamentos Contabeis
CREATE TABLE IF NOT EXISTS `lancamentos_contabeis` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `conta_debito_id` INT UNSIGNED NOT NULL,
  `conta_credito_id` INT UNSIGNED NOT NULL,
  `data_lancamento` DATE NOT NULL,
  `data_competencia` DATE NOT NULL,
  `valor` DECIMAL(15,2) NOT NULL,
  `historico` TEXT NOT NULL,
  `documento` VARCHAR(50) NULL,
  `tipo_documento` VARCHAR(50) NULL,
  `lote` VARCHAR(20) NULL,
  `origem` ENUM('manual', 'automatico', 'importacao') NOT NULL DEFAULT 'manual',
  `fatura_id` INT UNSIGNED NULL,
  `pagamento_id` INT UNSIGNED NULL,
  `estornado` TINYINT(1) DEFAULT 0,
  `lancamento_estorno_id` INT UNSIGNED NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `idx_conta_debito_id` (`conta_debito_id`),
  INDEX `idx_conta_credito_id` (`conta_credito_id`),
  INDEX `idx_data_lancamento` (`data_lancamento`),
  INDEX `idx_data_competencia` (`data_competencia`),
  CONSTRAINT `fk_lancamentos_conta_debito` FOREIGN KEY (`conta_debito_id`) REFERENCES `plano_contas` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `fk_lancamentos_conta_credito` FOREIGN KEY (`conta_credito_id`) REFERENCES `plano_contas` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================================================
-- 8. TABELAS DE USUARIOS E PERMISSOES
-- =============================================================================

-- Tabela de Usuarios
CREATE TABLE IF NOT EXISTS `usuarios` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `pessoa_id` INT UNSIGNED NULL,
  `nome` VARCHAR(255) NOT NULL,
  `email` VARCHAR(255) NOT NULL,
  `senha` VARCHAR(255) NOT NULL,
  `perfil` ENUM('administrador', 'gerente', 'operador', 'consulta') NOT NULL DEFAULT 'operador',
  `departamento` VARCHAR(100) NULL,
  `telefone` VARCHAR(20) NULL,
  `avatar_url` VARCHAR(500) NULL,
  `ultimo_acesso` TIMESTAMP NULL,
  `token_recuperacao` VARCHAR(255) NULL,
  `token_expiracao` TIMESTAMP NULL,
  `trocar_senha` TINYINT(1) DEFAULT 1,
  `sessao_unica` TINYINT(1) DEFAULT 0,
  `status` ENUM('ativo', 'inativo', 'bloqueado') NOT NULL DEFAULT 'ativo',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_email` (`email`),
  INDEX `idx_pessoa_id` (`pessoa_id`),
  INDEX `idx_perfil` (`perfil`),
  INDEX `idx_status` (`status`),
  CONSTRAINT `fk_usuarios_pessoa` FOREIGN KEY (`pessoa_id`) REFERENCES `pessoas` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabela de Permissoes
CREATE TABLE IF NOT EXISTS `permissoes` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `codigo` VARCHAR(100) NOT NULL,
  `descricao` VARCHAR(255) NOT NULL,
  `modulo` VARCHAR(50) NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_codigo` (`codigo`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabela de Permissoes por Usuario
CREATE TABLE IF NOT EXISTS `usuario_permissoes` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `usuario_id` INT UNSIGNED NOT NULL,
  `permissao_id` INT UNSIGNED NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_usuario_permissao` (`usuario_id`, `permissao_id`),
  INDEX `idx_usuario_id` (`usuario_id`),
  INDEX `idx_permissao_id` (`permissao_id`),
  CONSTRAINT `fk_usuario_permissoes_usuario` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_usuario_permissoes_permissao` FOREIGN KEY (`permissao_id`) REFERENCES `permissoes` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabela de Sessoes
CREATE TABLE IF NOT EXISTS `sessoes` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `usuario_id` INT UNSIGNED NOT NULL,
  `token` VARCHAR(255) NOT NULL,
  `ip` VARCHAR(45) NULL,
  `user_agent` TEXT NULL,
  `data_criacao` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `data_expiracao` TIMESTAMP NULL,
  `ativo` TINYINT(1) DEFAULT 1,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_token` (`token`),
  INDEX `idx_usuario_id` (`usuario_id`),
  CONSTRAINT `fk_sessoes_usuario` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================================================
-- 9. TABELAS DE AUDITORIA E LOGS
-- =============================================================================

-- Tabela de Logs de Auditoria
CREATE TABLE IF NOT EXISTS `auditoria` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `usuario_id` INT UNSIGNED NULL,
  `tabela` VARCHAR(100) NOT NULL,
  `registro_id` INT UNSIGNED NULL,
  `acao` ENUM('insert', 'update', 'delete', 'select', 'login', 'logout', 'erro') NOT NULL,
  `dados_anteriores` JSON NULL,
  `dados_novos` JSON NULL,
  `ip` VARCHAR(45) NULL,
  `user_agent` TEXT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `idx_usuario_id` (`usuario_id`),
  INDEX `idx_tabela` (`tabela`),
  INDEX `idx_acao` (`acao`),
  INDEX `idx_created_at` (`created_at`),
  CONSTRAINT `fk_auditoria_usuario` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabela de Notificacoes
CREATE TABLE IF NOT EXISTS `notificacoes` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `usuario_id` INT UNSIGNED NULL,
  `titulo` VARCHAR(255) NOT NULL,
  `mensagem` TEXT NOT NULL,
  `tipo` ENUM('info', 'sucesso', 'alerta', 'erro') NOT NULL DEFAULT 'info',
  `link` VARCHAR(500) NULL,
  `lida` TINYINT(1) DEFAULT 0,
  `data_leitura` TIMESTAMP NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `idx_usuario_id` (`usuario_id`),
  INDEX `idx_lida` (`lida`),
  CONSTRAINT `fk_notificacoes_usuario` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================================================
-- 10. TABELAS AUXILIARES
-- =============================================================================

-- Tabela de Feriados
CREATE TABLE IF NOT EXISTS `feriados` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `data` DATE NOT NULL,
  `descricao` VARCHAR(255) NOT NULL,
  `tipo` ENUM('nacional', 'estadual', 'municipal', 'ponto_facultativo') NOT NULL DEFAULT 'nacional',
  `estado` CHAR(2) NULL,
  `cidade` VARCHAR(100) NULL,
  `recorrente` TINYINT(1) DEFAULT 0 COMMENT 'Se repete todo ano',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_data` (`data`),
  INDEX `idx_tipo` (`tipo`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabela de Configuracoes do Sistema
CREATE TABLE IF NOT EXISTS `configuracoes` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `chave` VARCHAR(100) NOT NULL,
  `valor` TEXT NULL,
  `tipo` ENUM('string', 'number', 'boolean', 'json') NOT NULL DEFAULT 'string',
  `descricao` VARCHAR(255) NULL,
  `grupo` VARCHAR(50) NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_chave` (`chave`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabela de Arquivos/Documentos
CREATE TABLE IF NOT EXISTS `arquivos` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `nome_original` VARCHAR(255) NOT NULL,
  `nome_armazenado` VARCHAR(255) NOT NULL,
  `caminho` VARCHAR(500) NOT NULL,
  `tipo_mime` VARCHAR(100) NULL,
  `tamanho` INT UNSIGNED NULL,
  `entidade` VARCHAR(50) NOT NULL COMMENT 'Nome da tabela relacionada',
  `entidade_id` INT UNSIGNED NOT NULL,
  `descricao` VARCHAR(255) NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `idx_entidade` (`entidade`, `entidade_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabela de Premios/Comissoes
CREATE TABLE IF NOT EXISTS `premios` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `corretor_id` INT UNSIGNED NOT NULL,
  `agenciador_id` INT UNSIGNED NULL,
  `contrato_id` INT UNSIGNED NULL,
  `beneficiario_id` INT UNSIGNED NULL,
  `competencia` DATE NOT NULL,
  `valor_base` DECIMAL(10,2) NOT NULL,
  `percentual_comissao` DECIMAL(5,2) NOT NULL,
  `valor_comissao` DECIMAL(10,2) NOT NULL,
  `status` ENUM('calculado', 'aprovado', 'pago', 'cancelado') NOT NULL DEFAULT 'calculado',
  `data_pagamento` DATE NULL,
  `observacoes` TEXT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `idx_corretor_id` (`corretor_id`),
  INDEX `idx_agenciador_id` (`agenciador_id`),
  INDEX `idx_competencia` (`competencia`),
  INDEX `idx_status` (`status`),
  CONSTRAINT `fk_premios_corretor` FOREIGN KEY (`corretor_id`) REFERENCES `corretores` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `fk_premios_agenciador` FOREIGN KEY (`agenciador_id`) REFERENCES `agenciadores` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabela de Cotacoes
CREATE TABLE IF NOT EXISTS `cotacoes` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `operadora_id` INT UNSIGNED NULL,
  `plano_id` INT UNSIGNED NULL,
  `corretor_id` INT UNSIGNED NULL,
  `nome_interessado` VARCHAR(255) NOT NULL,
  `cpf_cnpj` VARCHAR(18) NULL,
  `email` VARCHAR(255) NULL,
  `telefone` VARCHAR(20) NULL,
  `quantidade_vidas` INT DEFAULT 1,
  `faixa_etaria` VARCHAR(50) NULL,
  `valor_estimado` DECIMAL(10,2) NULL,
  `observacoes` TEXT NULL,
  `status` ENUM('nova', 'em_andamento', 'enviada', 'convertida', 'perdida') NOT NULL DEFAULT 'nova',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `idx_operadora_id` (`operadora_id`),
  INDEX `idx_corretor_id` (`corretor_id`),
  INDEX `idx_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================================================
-- 11. TABELAS ANS E REMESSAS
-- =============================================================================

-- Tabela de Registros ANS
CREATE TABLE IF NOT EXISTS `registros_ans` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `operadora_id` INT UNSIGNED NOT NULL,
  `tipo_registro` VARCHAR(50) NOT NULL,
  `competencia` DATE NOT NULL,
  `arquivo` VARCHAR(255) NULL,
  `status` ENUM('pendente', 'gerado', 'enviado', 'aceito', 'rejeitado') NOT NULL DEFAULT 'pendente',
  `protocolo` VARCHAR(50) NULL,
  `data_envio` DATE NULL,
  `data_retorno` DATE NULL,
  `observacoes` TEXT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `idx_operadora_id` (`operadora_id`),
  INDEX `idx_competencia` (`competencia`),
  INDEX `idx_status` (`status`),
  CONSTRAINT `fk_registros_ans_operadora` FOREIGN KEY (`operadora_id`) REFERENCES `operadoras` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabela de Arquivos de Remessa Bancaria
CREATE TABLE IF NOT EXISTS `remessas_bancarias` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `banco` VARCHAR(10) NOT NULL,
  `tipo_remessa` ENUM('cobranca', 'pagamento', 'debito_automatico') NOT NULL,
  `numero_remessa` INT NOT NULL,
  `data_geracao` DATE NOT NULL,
  `quantidade_registros` INT DEFAULT 0,
  `valor_total` DECIMAL(15,2) DEFAULT 0.00,
  `nome_arquivo` VARCHAR(255) NOT NULL,
  `status` ENUM('gerada', 'enviada', 'processada', 'erro') NOT NULL DEFAULT 'gerada',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `idx_banco` (`banco`),
  INDEX `idx_data_geracao` (`data_geracao`),
  INDEX `idx_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabela de Retornos Bancarios
CREATE TABLE IF NOT EXISTS `retornos_bancarios` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `remessa_id` INT UNSIGNED NULL,
  `banco` VARCHAR(10) NOT NULL,
  `nome_arquivo` VARCHAR(255) NOT NULL,
  `data_processamento` DATE NOT NULL,
  `quantidade_registros` INT DEFAULT 0,
  `valor_total` DECIMAL(15,2) DEFAULT 0.00,
  `registros_processados` INT DEFAULT 0,
  `registros_erro` INT DEFAULT 0,
  `status` ENUM('importado', 'processando', 'processado', 'erro') NOT NULL DEFAULT 'importado',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `idx_remessa_id` (`remessa_id`),
  INDEX `idx_banco` (`banco`),
  INDEX `idx_data_processamento` (`data_processamento`),
  CONSTRAINT `fk_retornos_remessa` FOREIGN KEY (`remessa_id`) REFERENCES `remessas_bancarias` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

SET FOREIGN_KEY_CHECKS = 1;

-- =============================================================================
-- FIM DA ESTRUTURA DE TABELAS
-- =============================================================================
