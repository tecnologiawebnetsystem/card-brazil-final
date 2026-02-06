-- =====================================================
-- SCRIPT DML: DADOS INICIAIS
-- Banco: PostgreSQL (Neon)
-- Descrição: Dados iniciais para teste
-- =====================================================

-- Inserir administradora padrão
INSERT INTO administradoras (razao_social, nome_fantasia, cnpj, email, status)
VALUES ('Talent Health Administradora Ltda', 'Talent Health', '12.345.678/0001-90', 'contato@talenthealth.com.br', 'ativo')
ON CONFLICT (cnpj) DO NOTHING;

-- Inserir role de Administrador
INSERT INTO roles (id_administradora, nome, descricao, nivel_acesso, ativo)
SELECT 1, 'Administrador', 'Acesso total ao sistema', 10, true
WHERE NOT EXISTS (SELECT 1 FROM roles WHERE nome = 'Administrador' AND id_administradora = 1);

-- Inserir usuário admin demo
-- Senha: admin123
INSERT INTO usuarios (id_administradora, nome, email, senha_hash, ativo, email_verificado)
SELECT 
  1,
  'Admin Demo',
  'admin@talenthealth.com.br',
  '$2a$10$rZ3qKx5qQJ5mXvZhGZ5N4e6K5YvYxZqKx5qQJ5mXvZhGZ5N4e6K5Y',
  true,
  true
WHERE NOT EXISTS (SELECT 1 FROM usuarios WHERE email = 'admin@talenthealth.com.br' AND id_administradora = 1);

-- Vincular usuário admin ao role de Administrador
INSERT INTO usuario_roles (id_administradora, usuario_id, role_id)
SELECT 1, u.id, r.id
FROM usuarios u
CROSS JOIN roles r
WHERE u.email = 'admin@talenthealth.com.br' 
  AND r.nome = 'Administrador'
  AND u.id_administradora = 1
  AND r.id_administradora = 1
  AND NOT EXISTS (
    SELECT 1 FROM usuario_roles ur 
    WHERE ur.usuario_id = u.id AND ur.role_id = r.id
  );
