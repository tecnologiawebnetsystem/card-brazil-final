-- =====================================================
-- TABELAS DE OPERADORAS, ESTIPULANTES E INTERMEDIÁRIOS
-- =====================================================

USE cardbrazil;

-- Adicionando id_administradora em todas as tabelas para multi-tenant

-- Tabela de Operadoras
CREATE TABLE IF NOT EXISTS operadoras (
  id INT AUTO_INCREMENT PRIMARY KEY,
  id_administradora INT NOT NULL,
  codigo VARCHAR(50) NOT NULL,
  nome VARCHAR(255) NOT NULL,
  cnpj VARCHAR(18) NOT NULL,
  registro_ans VARCHAR(20) UNIQUE,
  telefone VARCHAR(20),
  email VARCHAR(255),
  site VARCHAR(255),
  ativo BOOLEAN DEFAULT TRUE,
  observacoes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  deleted_at TIMESTAMP NULL,
  FOREIGN KEY (id_administradora) REFERENCES administradoras(id),
  UNIQUE KEY unique_codigo_admin (codigo, id_administradora),
  UNIQUE KEY unique_cnpj_admin (cnpj, id_administradora),
  INDEX idx_codigo (codigo),
  INDEX idx_cnpj (cnpj),
  INDEX idx_registro_ans (registro_ans),
  INDEX idx_ativo (ativo),
  INDEX idx_admin (id_administradora)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabela de Estipulantes
CREATE TABLE IF NOT EXISTS estipulantes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  id_administradora INT NOT NULL,
  pessoa_id INT NOT NULL,
  codigo VARCHAR(50) NOT NULL,
  tipo ENUM('Empresa', 'Sindicato', 'Associação', 'Entidade de Classe', 'Outro') NOT NULL,
  segmento VARCHAR(100),
  numero_funcionarios INT,
  responsavel_nome VARCHAR(255),
  responsavel_cpf VARCHAR(14),
  responsavel_telefone VARCHAR(20),
  responsavel_email VARCHAR(255),
  ativo BOOLEAN DEFAULT TRUE,
  observacoes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  deleted_at TIMESTAMP NULL,
  FOREIGN KEY (id_administradora) REFERENCES administradoras(id),
  FOREIGN KEY (pessoa_id) REFERENCES pessoas(id) ON DELETE CASCADE,
  UNIQUE KEY unique_codigo_admin (codigo, id_administradora),
  INDEX idx_codigo (codigo),
  INDEX idx_ativo (ativo),
  INDEX idx_pessoa (pessoa_id),
  INDEX idx_admin (id_administradora)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabela de Subestipulantes
CREATE TABLE IF NOT EXISTS subestipulantes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  id_administradora INT NOT NULL,
  estipulante_id INT NOT NULL,
  pessoa_id INT NOT NULL,
  codigo VARCHAR(50) NOT NULL,
  responsavel_nome VARCHAR(255),
  responsavel_telefone VARCHAR(20),
  responsavel_email VARCHAR(255),
  ativo BOOLEAN DEFAULT TRUE,
  observacoes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  deleted_at TIMESTAMP NULL,
  FOREIGN KEY (id_administradora) REFERENCES administradoras(id),
  FOREIGN KEY (estipulante_id) REFERENCES estipulantes(id) ON DELETE CASCADE,
  FOREIGN KEY (pessoa_id) REFERENCES pessoas(id) ON DELETE CASCADE,
  UNIQUE KEY unique_codigo_admin (codigo, id_administradora),
  INDEX idx_estipulante_id (estipulante_id),
  INDEX idx_codigo (codigo),
  INDEX idx_ativo (ativo),
  INDEX idx_pessoa (pessoa_id),
  INDEX idx_admin (id_administradora)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
