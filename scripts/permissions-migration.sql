-- Catálogo parametrizado de navegação, permissões e alçadas.
-- Migração aditiva e idempotente: não remove nem renomeia estruturas legadas.
CREATE TABLE IF NOT EXISTS sistemas_modulos (
  id SERIAL PRIMARY KEY,
  slug VARCHAR(120) NOT NULL UNIQUE,
  nome VARCHAR(160) NOT NULL,
  descricao TEXT,
  ordem INTEGER NOT NULL DEFAULT 0,
  ativo BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE IF NOT EXISTS sistemas_menus (
  id SERIAL PRIMARY KEY,
  modulo_id INTEGER REFERENCES sistemas_modulos(id) ON DELETE CASCADE,
  menu_pai_id INTEGER REFERENCES sistemas_menus(id) ON DELETE CASCADE,
  slug VARCHAR(180) NOT NULL UNIQUE,
  titulo VARCHAR(180) NOT NULL,
  rota VARCHAR(255),
  icone VARCHAR(80) NOT NULL DEFAULT 'settings',
  ordem INTEGER NOT NULL DEFAULT 0,
  ativo BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE IF NOT EXISTS sistemas_recursos (
  id SERIAL PRIMARY KEY,
  slug VARCHAR(180) NOT NULL UNIQUE,
  nome VARCHAR(180) NOT NULL,
  modulo_id INTEGER REFERENCES sistemas_modulos(id) ON DELETE SET NULL,
  ativo BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE IF NOT EXISTS sistemas_acoes (
  id SERIAL PRIMARY KEY,
  slug VARCHAR(80) NOT NULL UNIQUE,
  nome VARCHAR(120) NOT NULL,
  descricao TEXT,
  ordem INTEGER NOT NULL DEFAULT 0,
  ativo BOOLEAN NOT NULL DEFAULT TRUE
);
CREATE TABLE IF NOT EXISTS sistema_perfil_permissoes (
  id SERIAL PRIMARY KEY,
  administradora_id INTEGER NOT NULL,
  perfil_nome VARCHAR(120) NOT NULL,
  recurso_id INTEGER NOT NULL REFERENCES sistemas_recursos(id) ON DELETE CASCADE,
  acao_id INTEGER NOT NULL REFERENCES sistemas_acoes(id) ON DELETE CASCADE,
  permitido BOOLEAN NOT NULL DEFAULT TRUE,
  vigencia_inicio DATE,
  vigencia_fim DATE,
  UNIQUE (administradora_id, perfil_nome, recurso_id, acao_id)
);
CREATE TABLE IF NOT EXISTS sistema_usuario_perfis (
  id SERIAL PRIMARY KEY,
  administradora_id INTEGER NOT NULL,
  usuario_id INTEGER NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
  perfil_nome VARCHAR(120) NOT NULL,
  vigencia_inicio DATE,
  vigencia_fim DATE,
  ativo BOOLEAN NOT NULL DEFAULT TRUE,
  UNIQUE (administradora_id, usuario_id, perfil_nome)
);
CREATE TABLE IF NOT EXISTS sistema_menu_perfis (
  id SERIAL PRIMARY KEY,
  administradora_id INTEGER NOT NULL,
  perfil_nome VARCHAR(120) NOT NULL,
  menu_id INTEGER NOT NULL REFERENCES sistemas_menus(id) ON DELETE CASCADE,
  permitido BOOLEAN NOT NULL DEFAULT TRUE,
  UNIQUE (administradora_id, perfil_nome, menu_id)
);
CREATE TABLE IF NOT EXISTS sistema_alcadas (
  id SERIAL PRIMARY KEY,
  administradora_id INTEGER NOT NULL,
  nome VARCHAR(180) NOT NULL,
  recurso_id INTEGER REFERENCES sistemas_recursos(id) ON DELETE SET NULL,
  etapa VARCHAR(100) NOT NULL,
  nivel INTEGER NOT NULL DEFAULT 1,
  limite_minimo NUMERIC(14,2),
  limite_maximo NUMERIC(14,2),
  aprovador_tipo VARCHAR(20) NOT NULL DEFAULT 'perfil',
  aprovador_valor VARCHAR(180) NOT NULL,
  sequencia INTEGER NOT NULL DEFAULT 1,
  vigencia_inicio DATE,
  vigencia_fim DATE,
  ativo BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS idx_sistemas_menus_modulo ON sistemas_menus(modulo_id, ordem);
CREATE INDEX IF NOT EXISTS idx_sistema_perfil_perm ON sistema_perfil_permissoes(administradora_id, perfil_nome);
CREATE INDEX IF NOT EXISTS idx_sistema_alcadas_lookup ON sistema_alcadas(administradora_id, recurso_id, etapa, ativo);

INSERT INTO sistemas_acoes (slug, nome, descricao, ordem) VALUES
('visualizar', 'Visualizar', 'Acessar e consultar o recurso', 1),
('criar', 'Criar', 'Incluir novos registros', 2),
('editar', 'Editar', 'Alterar registros existentes', 3),
('excluir', 'Excluir', 'Remover ou inativar registros', 4),
('aprovar', 'Aprovar', 'Aprovar fluxos e operações', 5),
('exportar', 'Exportar', 'Exportar dados do recurso', 6)
ON CONFLICT (slug) DO NOTHING;
