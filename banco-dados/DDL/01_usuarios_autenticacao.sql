-- =====================================================
-- SCRIPT DDL: USUÁRIOS E AUTENTICAÇÃO
-- Banco: MySQL 8.0+
-- Descrição: Tabelas de usuários, roles, perfis e autenticação
-- =====================================================

USE cardbrazil;

-- Adicionando campo id_administradora em todas as tabelas

-- Tabela de Roles (Perfis de Acesso)
CREATE TABLE IF NOT EXISTS roles (
  id INT AUTO_INCREMENT PRIMARY KEY,
  id_administradora INT NOT NULL,
  nome VARCHAR(50) NOT NULL,
  descricao TEXT,
  nivel_acesso INT NOT NULL DEFAULT 1,
  ativo BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (id_administradora) REFERENCES administradoras(id),
  UNIQUE KEY unique_nome_admin (nome, id_administradora),
  INDEX idx_nome (nome),
  INDEX idx_nivel_acesso (nivel_acesso),
  INDEX idx_admin (id_administradora)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabela de Perfis de Usuário (dados pessoais)
CREATE TABLE IF NOT EXISTS perfis_usuario (
  id INT AUTO_INCREMENT PRIMARY KEY,
  id_administradora INT NOT NULL,
  nome VARCHAR(255) NOT NULL,
  cpf VARCHAR(14) UNIQUE,
  rg VARCHAR(20),
  data_nascimento DATE,
  genero ENUM('masculino', 'feminino', 'outro', 'nao_informado'),
  telefone VARCHAR(20),
  celular VARCHAR(20),
  endereco TEXT,
  cidade VARCHAR(100),
  estado VARCHAR(2),
  cep VARCHAR(10),
  departamento VARCHAR(100),
  cargo VARCHAR(100),
  data_admissao DATE,
  observacoes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (id_administradora) REFERENCES administradoras(id),
  INDEX idx_cpf (cpf),
  INDEX idx_admin (id_administradora)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabela de Usuários
CREATE TABLE IF NOT EXISTS usuarios (
  id INT AUTO_INCREMENT PRIMARY KEY,
  id_administradora INT NOT NULL,
  perfil_id INT,
  nome VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  senha_hash VARCHAR(255) NOT NULL,
  avatar_url VARCHAR(500),
  ativo BOOLEAN DEFAULT TRUE,
  email_verificado BOOLEAN DEFAULT FALSE,
  ultimo_acesso TIMESTAMP NULL,
  tentativas_login INT DEFAULT 0,
  bloqueado_ate TIMESTAMP NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (id_administradora) REFERENCES administradoras(id),
  FOREIGN KEY (perfil_id) REFERENCES perfis_usuario(id) ON DELETE SET NULL,
  UNIQUE KEY unique_email_admin (email, id_administradora),
  INDEX idx_email (email),
  INDEX idx_ativo (ativo),
  INDEX idx_admin (id_administradora)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabela de Relacionamento Usuário-Role
CREATE TABLE IF NOT EXISTS usuario_roles (
  id INT AUTO_INCREMENT PRIMARY KEY,
  id_administradora INT NOT NULL,
  usuario_id INT NOT NULL,
  role_id INT NOT NULL,
  atribuido_por INT,
  atribuido_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (id_administradora) REFERENCES administradoras(id),
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
  FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE,
  FOREIGN KEY (atribuido_por) REFERENCES usuarios(id) ON DELETE SET NULL,
  UNIQUE KEY unique_usuario_role (usuario_id, role_id),
  INDEX idx_usuario_id (usuario_id),
  INDEX idx_role_id (role_id),
  INDEX idx_admin (id_administradora)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabela de Sessões de Usuário
CREATE TABLE IF NOT EXISTS sessoes_usuario (
  id INT AUTO_INCREMENT PRIMARY KEY,
  id_administradora INT NOT NULL,
  usuario_id INT NOT NULL,
  token VARCHAR(500) NOT NULL UNIQUE,
  refresh_token VARCHAR(500),
  ip_address VARCHAR(45),
  user_agent TEXT,
  expira_em TIMESTAMP NOT NULL,
  criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (id_administradora) REFERENCES administradoras(id),
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
  INDEX idx_usuario_id (usuario_id),
  INDEX idx_token (token),
  INDEX idx_expira_em (expira_em),
  INDEX idx_admin (id_administradora)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabela de Logs de Autenticação
CREATE TABLE IF NOT EXISTS logs_autenticacao (
  id INT AUTO_INCREMENT PRIMARY KEY,
  id_administradora INT NOT NULL,
  usuario_id INT,
  email VARCHAR(255),
  acao ENUM('login_sucesso', 'login_falha', 'logout', 'senha_alterada', 'conta_bloqueada', 'conta_desbloqueada') NOT NULL,
  ip_address VARCHAR(45),
  user_agent TEXT,
  detalhes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (id_administradora) REFERENCES administradoras(id),
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE SET NULL,
  INDEX idx_usuario_id (usuario_id),
  INDEX idx_acao (acao),
  INDEX idx_created_at (created_at),
  INDEX idx_admin (id_administradora)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
