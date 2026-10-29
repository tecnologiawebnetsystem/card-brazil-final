-- =====================================================
-- TABELAS DE ESTIPULANTES E INTERMEDIÁRIOS
-- =====================================================

-- Adicionando USE cardbrazil no início do arquivo
USE cardbrazil;

-- Adicionando id_administradora em todas as tabelas para multi-tenant

-- Tabela de Estipulantes
CREATE TABLE IF NOT EXISTS estipulantes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  id_administradora INT NOT NULL,
  codigo VARCHAR(50) NOT NULL,
  razao_social VARCHAR(255) NOT NULL,
  nome_fantasia VARCHAR(255),
  cnpj VARCHAR(18) NOT NULL,
  inscricao_estadual VARCHAR(20),
  tipo ENUM('Empresa', 'Sindicato', 'Associação', 'Entidade de Classe', 'Outro') NOT NULL,
  segmento VARCHAR(100),
  numero_funcionarios INT,
  telefone VARCHAR(20),
  email VARCHAR(255),
  site VARCHAR(255),
  responsavel_nome VARCHAR(255),
  responsavel_cpf VARCHAR(14),
  responsavel_telefone VARCHAR(20),
  responsavel_email VARCHAR(255),
  ativo BOOLEAN DEFAULT TRUE,
  observacoes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  created_by INT,
  updated_by INT,
  FOREIGN KEY (id_administradora) REFERENCES administradoras(id),
  FOREIGN KEY (created_by) REFERENCES usuarios(id) ON DELETE SET NULL,
  FOREIGN KEY (updated_by) REFERENCES usuarios(id) ON DELETE SET NULL,
  UNIQUE KEY unique_codigo_admin (codigo, id_administradora),
  UNIQUE KEY unique_cnpj_admin (cnpj, id_administradora),
  INDEX idx_codigo (codigo),
  INDEX idx_cnpj (cnpj),
  INDEX idx_ativo (ativo),
  INDEX idx_admin (id_administradora)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabela de Subestipulantes
CREATE TABLE IF NOT EXISTS subestipulantes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  id_administradora INT NOT NULL,
  estipulante_id INT NOT NULL,
  codigo VARCHAR(50) NOT NULL,
  razao_social VARCHAR(255) NOT NULL,
  nome_fantasia VARCHAR(255),
  cnpj VARCHAR(18) NOT NULL,
  telefone VARCHAR(20),
  email VARCHAR(255),
  responsavel_nome VARCHAR(255),
  responsavel_telefone VARCHAR(20),
  responsavel_email VARCHAR(255),
  ativo BOOLEAN DEFAULT TRUE,
  observacoes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  created_by INT,
  updated_by INT,
  FOREIGN KEY (id_administradora) REFERENCES administradoras(id),
  FOREIGN KEY (estipulante_id) REFERENCES estipulantes(id) ON DELETE CASCADE,
  FOREIGN KEY (created_by) REFERENCES usuarios(id) ON DELETE SET NULL,
  FOREIGN KEY (updated_by) REFERENCES usuarios(id) ON DELETE SET NULL,
  UNIQUE KEY unique_codigo_admin (codigo, id_administradora),
  UNIQUE KEY unique_cnpj_admin (cnpj, id_administradora),
  INDEX idx_estipulante_id (estipulante_id),
  INDEX idx_codigo (codigo),
  INDEX idx_cnpj (cnpj),
  INDEX idx_ativo (ativo),
  INDEX idx_admin (id_administradora)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabela de Corretores
CREATE TABLE IF NOT EXISTS corretores (
  id INT AUTO_INCREMENT PRIMARY KEY,
  id_administradora INT NOT NULL,
  codigo VARCHAR(50) NOT NULL,
  tipo_pessoa ENUM('Física', 'Jurídica') NOT NULL,
  nome VARCHAR(255) NOT NULL,
  cpf_cnpj VARCHAR(18) NOT NULL,
  registro_susep VARCHAR(20),
  telefone VARCHAR(20),
  celular VARCHAR(20),
  email VARCHAR(255),
  comissao_percentual DECIMAL(5,2) DEFAULT 0.00,
  ativo BOOLEAN DEFAULT TRUE,
  observacoes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  created_by INT,
  updated_by INT,
  FOREIGN KEY (id_administradora) REFERENCES administradoras(id),
  FOREIGN KEY (created_by) REFERENCES usuarios(id) ON DELETE SET NULL,
  FOREIGN KEY (updated_by) REFERENCES usuarios(id) ON DELETE SET NULL,
  UNIQUE KEY unique_codigo_admin (codigo, id_administradora),
  UNIQUE KEY unique_cpf_cnpj_admin (cpf_cnpj, id_administradora),
  UNIQUE KEY unique_susep_admin (registro_susep, id_administradora),
  INDEX idx_codigo (codigo),
  INDEX idx_cpf_cnpj (cpf_cnpj),
  INDEX idx_registro_susep (registro_susep),
  INDEX idx_ativo (ativo),
  INDEX idx_admin (id_administradora)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabela de Agenciadores
CREATE TABLE IF NOT EXISTS agenciadores (
  id INT AUTO_INCREMENT PRIMARY KEY,
  id_administradora INT NOT NULL,
  codigo VARCHAR(50) NOT NULL,
  tipo_pessoa ENUM('Física', 'Jurídica') NOT NULL,
  nome VARCHAR(255) NOT NULL,
  cpf_cnpj VARCHAR(18) NOT NULL,
  telefone VARCHAR(20),
  celular VARCHAR(20),
  email VARCHAR(255),
  comissao_percentual DECIMAL(5,2) DEFAULT 0.00,
  ativo BOOLEAN DEFAULT TRUE,
  observacoes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  created_by INT,
  updated_by INT,
  FOREIGN KEY (id_administradora) REFERENCES administradoras(id),
  FOREIGN KEY (created_by) REFERENCES usuarios(id) ON DELETE SET NULL,
  FOREIGN KEY (updated_by) REFERENCES usuarios(id) ON DELETE SET NULL,
  UNIQUE KEY unique_codigo_admin (codigo, id_administradora),
  UNIQUE KEY unique_cpf_cnpj_admin (cpf_cnpj, id_administradora),
  INDEX idx_codigo (codigo),
  INDEX idx_cpf_cnpj (cpf_cnpj),
  INDEX idx_ativo (ativo),
  INDEX idx_admin (id_administradora)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
