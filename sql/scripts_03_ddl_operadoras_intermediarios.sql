-- =====================================================
-- TABELAS DE OPERADORAS, ESTIPULANTES E INTERMEDIÁRIOS
-- =====================================================

-- Tabela de Operadoras
CREATE TABLE IF NOT EXISTS operadoras (
  id SERIAL PRIMARY KEY,
  id_administradora INT NOT NULL,
  codigo VARCHAR(50) NOT NULL,
  nome VARCHAR(255) NOT NULL,
  cnpj VARCHAR(18) NOT NULL,
  registro_ans VARCHAR(20),
  telefone VARCHAR(20),
  email VARCHAR(255),
  site VARCHAR(255),
  ativo BOOLEAN DEFAULT TRUE,
  observacoes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  deleted_at TIMESTAMP NULL,
  FOREIGN KEY (id_administradora) REFERENCES administradoras(id),
  UNIQUE (codigo, id_administradora),
  UNIQUE (cnpj, id_administradora)
);

CREATE INDEX IF NOT EXISTS idx_operadoras_codigo ON operadoras(codigo);
CREATE INDEX IF NOT EXISTS idx_operadoras_cnpj ON operadoras(cnpj);
CREATE INDEX IF NOT EXISTS idx_operadoras_ans ON operadoras(registro_ans);
CREATE INDEX IF NOT EXISTS idx_operadoras_ativo ON operadoras(ativo);
CREATE INDEX IF NOT EXISTS idx_operadoras_admin ON operadoras(id_administradora);

-- Tabela de Estipulantes
CREATE TABLE IF NOT EXISTS estipulantes (
  id SERIAL PRIMARY KEY,
  id_administradora INT NOT NULL,
  codigo VARCHAR(50) NOT NULL,
  razao_social VARCHAR(255) NOT NULL,
  nome_fantasia VARCHAR(255),
  cnpj VARCHAR(18) NOT NULL,
  inscricao_estadual VARCHAR(20),
  tipo VARCHAR(50) CHECK (tipo IN ('Empresa', 'Sindicato', 'Associação', 'Entidade de Classe', 'Outro')) NOT NULL,
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
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_by INT,
  updated_by INT,
  FOREIGN KEY (id_administradora) REFERENCES administradoras(id),
  FOREIGN KEY (created_by) REFERENCES usuarios(id) ON DELETE SET NULL,
  FOREIGN KEY (updated_by) REFERENCES usuarios(id) ON DELETE SET NULL,
  UNIQUE (codigo, id_administradora),
  UNIQUE (cnpj, id_administradora)
);

CREATE INDEX IF NOT EXISTS idx_estipulantes_codigo ON estipulantes(codigo);
CREATE INDEX IF NOT EXISTS idx_estipulantes_cnpj ON estipulantes(cnpj);
CREATE INDEX IF NOT EXISTS idx_estipulantes_ativo ON estipulantes(ativo);
CREATE INDEX IF NOT EXISTS idx_estipulantes_admin ON estipulantes(id_administradora);

-- Tabela de Corretores
CREATE TABLE IF NOT EXISTS corretores (
  id SERIAL PRIMARY KEY,
  id_administradora INT NOT NULL,
  codigo VARCHAR(50) NOT NULL,
  tipo_pessoa VARCHAR(20) CHECK (tipo_pessoa IN ('Física', 'Jurídica')) NOT NULL,
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
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_by INT,
  updated_by INT,
  FOREIGN KEY (id_administradora) REFERENCES administradoras(id),
  FOREIGN KEY (created_by) REFERENCES usuarios(id) ON DELETE SET NULL,
  FOREIGN KEY (updated_by) REFERENCES usuarios(id) ON DELETE SET NULL,
  UNIQUE (codigo, id_administradora),
  UNIQUE (cpf_cnpj, id_administradora)
);

CREATE INDEX IF NOT EXISTS idx_corretores_codigo ON corretores(codigo);
CREATE INDEX IF NOT EXISTS idx_corretores_cpf_cnpj ON corretores(cpf_cnpj);
CREATE INDEX IF NOT EXISTS idx_corretores_susep ON corretores(registro_susep);
CREATE INDEX IF NOT EXISTS idx_corretores_ativo ON corretores(ativo);
CREATE INDEX IF NOT EXISTS idx_corretores_admin ON corretores(id_administradora);

-- Tabela de Agenciadores
CREATE TABLE IF NOT EXISTS agenciadores (
  id SERIAL PRIMARY KEY,
  id_administradora INT NOT NULL,
  codigo VARCHAR(50) NOT NULL,
  tipo_pessoa VARCHAR(20) CHECK (tipo_pessoa IN ('Física', 'Jurídica')) NOT NULL,
  nome VARCHAR(255) NOT NULL,
  cpf_cnpj VARCHAR(18) NOT NULL,
  telefone VARCHAR(20),
  celular VARCHAR(20),
  email VARCHAR(255),
  comissao_percentual DECIMAL(5,2) DEFAULT 0.00,
  ativo BOOLEAN DEFAULT TRUE,
  observacoes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_by INT,
  updated_by INT,
  FOREIGN KEY (id_administradora) REFERENCES administradoras(id),
  FOREIGN KEY (created_by) REFERENCES usuarios(id) ON DELETE SET NULL,
  FOREIGN KEY (updated_by) REFERENCES usuarios(id) ON DELETE SET NULL,
  UNIQUE (codigo, id_administradora),
  UNIQUE (cpf_cnpj, id_administradora)
);

CREATE INDEX IF NOT EXISTS idx_agenciadores_codigo ON agenciadores(codigo);
CREATE INDEX IF NOT EXISTS idx_agenciadores_cpf_cnpj ON agenciadores(cpf_cnpj);
CREATE INDEX IF NOT EXISTS idx_agenciadores_ativo ON agenciadores(ativo);
CREATE INDEX IF NOT EXISTS idx_agenciadores_admin ON agenciadores(id_administradora);
