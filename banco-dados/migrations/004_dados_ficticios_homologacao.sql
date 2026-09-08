-- Dados fictícios exclusivamente para homologação.
-- Preserva IDs e relacionamentos; não substitui valores existentes.
DO $$
DECLARE
  r RECORD;
  affected INTEGER;
BEGIN
  UPDATE pessoas
  SET nome_completo = COALESCE(nome_completo, 'HOMOLOGAÇÃO Pessoa ' || id),
      razao_social = CASE WHEN tipo_pessoa = 'juridica' THEN COALESCE(razao_social, 'HOMOLOGAÇÃO Empresa ' || id) ELSE razao_social END,
      nome_fantasia = CASE WHEN tipo_pessoa = 'juridica' THEN COALESCE(nome_fantasia, 'HOMOLOGAÇÃO Empresa ' || id) ELSE nome_fantasia END,
      cpf = CASE WHEN tipo_pessoa = 'fisica' AND cpf IS NULL THEN lpad(id::text, 11, '0') ELSE cpf END,
      cnpj = CASE WHEN tipo_pessoa = 'juridica' AND cnpj IS NULL THEN lpad(id::text, 14, '0') ELSE cnpj END,
      email = COALESCE(email, 'homologacao.pessoa.' || id || '@example.test'),
      telefone_principal = COALESCE(telefone_principal, '(11) 90000-' || lpad((id % 10000)::text, 4, '0')),
      observacoes = COALESCE(observacoes, 'Registro fictício criado para HOMOLOGAÇÃO'),
      updated_at = CURRENT_TIMESTAMP
  WHERE deleted_at IS NULL;
  GET DIAGNOSTICS affected = ROW_COUNT;
  INSERT INTO auditoria_preenchimento_deterministico (tabela, coluna, registros_afetados, regra)
  VALUES ('pessoas', '*', affected, 'Dados fictícios HOMOLOGAÇÃO somente em campos nulos');

  UPDATE operadoras o
  SET registro_ans = COALESCE(registro_ans, 'HOMO-' || lpad(o.id::text, 8, '0')),
      area_atuacao = COALESCE(area_atuacao, 'nacional'),
      site = COALESCE(site, 'https://operadora-' || o.id || '.example.test'),
      observacoes = COALESCE(observacoes, 'Registro fictício criado para HOMOLOGAÇÃO'),
      updated_at = CURRENT_TIMESTAMP
  WHERE deleted_at IS NULL;
  GET DIAGNOSTICS affected = ROW_COUNT;
  INSERT INTO auditoria_preenchimento_deterministico VALUES (DEFAULT, 'operadoras', '*', affected, 'Dados fictícios HOMOLOGAÇÃO somente em campos nulos', CURRENT_TIMESTAMP);

  UPDATE planos SET nome = COALESCE(nome, 'HOMOLOGAÇÃO Plano ' || id), codigo_ans = COALESCE(codigo_ans, 'HOM-' || lpad(id::text, 10, '0')), valor_base = COALESCE(valor_base, 199.90), descricao = COALESCE(descricao, 'Plano fictício para HOMOLOGAÇÃO'), updated_at = CURRENT_TIMESTAMP WHERE deleted_at IS NULL;
  GET DIAGNOSTICS affected = ROW_COUNT;
  INSERT INTO auditoria_preenchimento_deterministico VALUES (DEFAULT, 'planos', '*', affected, 'Dados fictícios HOMOLOGAÇÃO somente em campos nulos', CURRENT_TIMESTAMP);

  UPDATE produtos SET nome = COALESCE(nome, 'HOMOLOGAÇÃO Produto ' || id), codigo_produto = COALESCE(codigo_produto, 'HOM-PROD-' || lpad(id::text, 6, '0')), valor_mensalidade = COALESCE(valor_mensalidade, 99.90), idade_minima = COALESCE(idade_minima, 0), idade_maxima = COALESCE(idade_maxima, 99), updated_at = CURRENT_TIMESTAMP WHERE deleted_at IS NULL;
  GET DIAGNOSTICS affected = ROW_COUNT;
  INSERT INTO auditoria_preenchimento_deterministico VALUES (DEFAULT, 'produtos', '*', affected, 'Dados fictícios HOMOLOGAÇÃO somente em campos nulos', CURRENT_TIMESTAMP);

  UPDATE corretores SET registro_susep = COALESCE(registro_susep, 'HOM-' || lpad(id::text, 8, '0')), codigo_interno = COALESCE(codigo_interno, 'HOM-COR-' || id), comissao_percentual = COALESCE(comissao_percentual, 0), observacoes = COALESCE(observacoes, 'Registro fictício criado para HOMOLOGAÇÃO'), updated_at = CURRENT_TIMESTAMP WHERE deleted_at IS NULL;
  UPDATE agenciadores SET codigo_interno = COALESCE(codigo_interno, 'HOM-AGE-' || id), comissao_percentual = COALESCE(comissao_percentual, 0), observacoes = COALESCE(observacoes, 'Registro fictício criado para HOMOLOGAÇÃO'), updated_at = CURRENT_TIMESTAMP WHERE deleted_at IS NULL;
  UPDATE estipulantes SET codigo_interno = COALESCE(codigo_interno, 'HOM-EST-' || id), observacoes = COALESCE(observacoes, 'Registro fictício criado para HOMOLOGAÇÃO'), updated_at = CURRENT_TIMESTAMP WHERE deleted_at IS NULL;
  UPDATE subestipulantes SET nome = COALESCE(nome, 'HOMOLOGAÇÃO Subestipulante ' || id), contrato = COALESCE(contrato, 'HOM-CONTRATO-' || id), responsavel = COALESCE(responsavel, 'HOMOLOGAÇÃO Responsável ' || id), telefone = COALESCE(telefone, '(11) 98888-' || lpad((id % 10000)::text, 4, '0')), updated_at = CURRENT_TIMESTAMP WHERE deleted_at IS NULL;

  INSERT INTO enderecos (pessoa_id, tipo_endereco, cep, logradouro, numero, bairro, cidade, estado, pais, is_principal)
  SELECT p.id, 'comercial', '01000-000', 'Rua de Homologação', p.id::text, 'Centro', 'São Paulo', 'SP', 'Brasil', TRUE
  FROM pessoas p WHERE p.deleted_at IS NULL AND NOT EXISTS (SELECT 1 FROM enderecos e WHERE e.pessoa_id = p.id);

  INSERT INTO dados_bancarios (pessoa_id, banco_codigo, banco_nome, agencia, conta, conta_digito, tipo_conta, is_principal)
  SELECT p.id, '999', 'Banco de Homologação', '0001', lpad(p.id::text, 8, '0'), '0', 'corrente', TRUE
  FROM pessoas p WHERE p.deleted_at IS NULL AND NOT EXISTS (SELECT 1 FROM dados_bancarios d WHERE d.pessoa_id = p.id);
END $$;

CREATE INDEX IF NOT EXISTS idx_pessoas_homologacao_email ON pessoas(email) WHERE email LIKE 'homologacao.%@example.test';
