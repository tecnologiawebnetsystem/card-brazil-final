-- =====================================================
-- SCRIPT DDL: USUÁRIOS E AUTENTICAÇÃO
-- Banco: PostgreSQL (Neon)
-- Descrição: Tabelas de usuários, roles, perfis e autenticação
-- =====================================================

-- Tabela de Roles (Perfis de Acesso)
CREATE TABLE IF NOT EXISTS roles (
  id SERIAL PRIMARY KEY,
  id_administradora INT NOT NULL,
  nome VARCHAR(50) NOT NULL,
  descricao TEXT,
  nivel_acesso INT NOT NULL DEFAULT 1,
  ativo BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (id_administradora) REFERENCES administradoras(id),
  UNIQUE (nome, id_administradora)
);

CREATE INDEX IF NOT EXISTS idx_roles_nome ON roles(nome);
CREATE INDEX IF NOT EXISTS idx_roles_nivel_acesso ON roles(nivel_acesso);
CREATE INDEX IF NOT EXISTS idx_roles_admin ON roles(id_administradora);

-- Tabela de Perfis de Usuário (dados pessoais)
CREATE TABLE IF NOT EXISTS perfis_usuario (
  id SERIAL PRIMARY KEY,
  id_administradora INT NOT NULL,
  nome VARCHAR(255) NOT NULL,
  cpf VARCHAR(14) UNIQUE,
  rg VARCHAR(20),
  data_nascimento DATE,
  genero VARCHAR(20) CHECK (genero IN ('masculino', 'feminino', 'outro', 'nao_informado')),
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
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (id_administradora) REFERENCES administradoras(id)
);

CREATE INDEX IF NOT EXISTS idx_perfis_usuario_cpf ON perfis_usuario(cpf);
CREATE INDEX IF NOT EXISTS idx_perfis_usuario_admin ON perfis_usuario(id_administradora);

-- Tabela de Usuários
CREATE TABLE IF NOT EXISTS usuarios (
  id SERIAL PRIMARY KEY,
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
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (id_administradora) REFERENCES administradoras(id),
  FOREIGN KEY (perfil_id) REFERENCES perfis_usuario(id) ON DELETE SET NULL,
  UNIQUE (email, id_administradora)
);

CREATE INDEX IF NOT EXISTS idx_usuarios_email ON usuarios(email);
CREATE INDEX IF NOT EXISTS idx_usuarios_ativo ON usuarios(ativo);
CREATE INDEX IF NOT EXISTS idx_usuarios_admin ON usuarios(id_administradora);

-- Tabela de Relacionamento Usuário-Role
CREATE TABLE IF NOT EXISTS usuario_roles (
  id SERIAL PRIMARY KEY,
  id_administradora INT NOT NULL,
  usuario_id INT NOT NULL,
  role_id INT NOT NULL,
  atribuido_por INT,
  atribuido_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (id_administradora) REFERENCES administradoras(id),
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
  FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE,
  FOREIGN KEY (atribuido_por) REFERENCES usuarios(id) ON DELETE SET NULL,
  UNIQUE (usuario_id, role_id)
);

CREATE INDEX IF NOT EXISTS idx_usuario_roles_usuario ON usuario_roles(usuario_id);
CREATE INDEX IF NOT EXISTS idx_usuario_roles_role ON usuario_roles(role_id);
CREATE INDEX IF NOT EXISTS idx_usuario_roles_admin ON usuario_roles(id_administradora);

-- Tabela de Sessões de Usuário
CREATE TABLE IF NOT EXISTS sessoes_usuario (
  id SERIAL PRIMARY KEY,
  id_administradora INT NOT NULL,
  usuario_id INT NOT NULL,
  token VARCHAR(500) NOT NULL UNIQUE,
  refresh_token VARCHAR(500),
  ip_address VARCHAR(45),
  user_agent TEXT,
  expira_em TIMESTAMP NOT NULL,
  criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (id_administradora) REFERENCES administradoras(id),
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_sessoes_usuario_usuario ON sessoes_usuario(usuario_id);
CREATE INDEX IF NOT EXISTS idx_sessoes_usuario_token ON sessoes_usuario(token);
CREATE INDEX IF NOT EXISTS idx_sessoes_usuario_expira ON sessoes_usuario(expira_em);
CREATE INDEX IF NOT EXISTS idx_sessoes_usuario_admin ON sessoes_usuario(id_administradora);

-- Tabela de Logs de Autenticação
CREATE TABLE IF NOT EXISTS logs_autenticacao (
  id SERIAL PRIMARY KEY,
  id_administradora INT NOT NULL,
  usuario_id INT,
  email VARCHAR(255),
  acao VARCHAR(50) CHECK (acao IN ('login_sucesso', 'login_falha', 'logout', 'senha_alterada', 'conta_bloqueada', 'conta_desbloqueada')) NOT NULL,
  ip_address VARCHAR(45),
  user_agent TEXT,
  detalhes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (id_administradora) REFERENCES administradoras(id),
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE SET NULL
);

CREATE INDEX IF NOT EXISTS idx_logs_autenticacao_usuario ON logs_autenticacao(usuario_id);
CREATE INDEX IF NOT EXISTS idx_logs_autenticacao_acao ON logs_autenticacao(acao);
CREATE INDEX IF NOT EXISTS idx_logs_autenticacao_created ON logs_autenticacao(created_at);
CREATE INDEX IF NOT EXISTS idx_logs_autenticacao_admin ON logs_autenticacao(id_administradora);
