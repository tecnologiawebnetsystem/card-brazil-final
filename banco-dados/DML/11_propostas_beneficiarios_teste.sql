-- Dados de teste idempotentes para validação dos módulos Propostas e Beneficiários.
-- PostgreSQL / Neon. Executar somente em ambiente de desenvolvimento.

BEGIN;

INSERT INTO pessoas (administradora_id, tipo_pessoa, nome_completo, cpf, email, telefone_principal, status)
SELECT 1, 'fisica', v.nome, v.cpf, v.email, v.telefone, 'ativo'
FROM (VALUES
  ('Mariana Costa Almeida', '52998224725', 'mariana.almeida@exemplo.com.br', '11988887777'),
  ('Rafael Martins Souza', '11144477735', 'rafael.souza@exemplo.com.br', '11977776666'),
  ('Beatriz Lima Ferreira', '39053344705', 'beatriz.ferreira@exemplo.com.br', '11966665555')
) AS v(nome, cpf, email, telefone)
WHERE NOT EXISTS (SELECT 1 FROM pessoas p WHERE p.cpf = v.cpf);

INSERT INTO planos (administradora_id, nome, tipo_plano, valor_base, status)
SELECT 1, 'Plano Empresarial Essencial', 'empresarial', 389.90, 'ativo'
WHERE NOT EXISTS (SELECT 1 FROM planos WHERE nome = 'Plano Empresarial Essencial' AND administradora_id = 1);

INSERT INTO propostas (administradora_id, nome_proponente, cpf_cnpj, email, telefone, empresa, numero_funcionarios, tipo_plano, valor_proposto, observacoes, status)
SELECT 1, v.nome, v.documento, v.email, v.telefone, v.empresa, v.funcionarios, v.tipo_plano, v.valor, v.observacoes, v.status
FROM (VALUES
  ('Mariana Costa Almeida', '52998224725', 'mariana.almeida@exemplo.com.br', '11988887777', 'Almeida Tecnologia Ltda', '26-50', 'Empresarial', 12890.00, 'Documentação inicial recebida.', 'pendente'),
  ('Rafael Martins Souza', '11144477735', 'rafael.souza@exemplo.com.br', '11977776666', 'Souza Logística Ltda', '51-100', 'Empresarial', 24450.00, 'Aguardando validação financeira.', 'em_analise'),
  ('Beatriz Lima Ferreira', '39053344705', 'beatriz.ferreira@exemplo.com.br', '11966665555', 'Ferreira Consultoria Ltda', '11-25', 'Empresarial', 7590.00, 'Proposta aprovada para implantação.', 'aprovada')
) AS v(nome, documento, email, telefone, empresa, funcionarios, tipo_plano, valor, observacoes, status)
WHERE NOT EXISTS (SELECT 1 FROM propostas p WHERE p.cpf_cnpj = v.documento AND p.empresa = v.empresa AND p.deleted_at IS NULL);

INSERT INTO beneficiarios (administradora_id, pessoa_id, contrato_id, plano_id, numero_carteirinha, tipo_beneficiario, titular_id, data_inclusao, valor_mensalidade, status)
SELECT 1, p.id, NULL, pl.id, v.carteirinha, v.tipo, NULL, CURRENT_DATE - v.dias, v.valor, 'ativo'
FROM (VALUES
  ('52998224725', 'titular', 'CAR-000001', 11, 389.90),
  ('11144477735', 'titular', 'CAR-000002', 7, 459.90),
  ('39053344705', 'titular', 'CAR-000003', 4, 329.90)
) AS v(cpf, tipo, carteirinha, dias, valor)
JOIN pessoas p ON p.cpf = v.cpf
JOIN planos pl ON pl.nome = 'Plano Empresarial Essencial' AND pl.administradora_id = 1
WHERE NOT EXISTS (SELECT 1 FROM beneficiarios b WHERE b.numero_carteirinha = v.carteirinha);

COMMIT;

-- Consulta rápida para conferência:
-- SELECT id, nome_proponente, empresa, status FROM propostas WHERE deleted_at IS NULL ORDER BY id DESC;
-- SELECT b.id, p.nome_completo, b.tipo_beneficiario, b.status FROM beneficiarios b JOIN pessoas p ON p.id = b.pessoa_id ORDER BY b.id DESC;
