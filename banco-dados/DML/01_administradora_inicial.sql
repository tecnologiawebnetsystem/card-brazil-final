-- =====================================================
-- SCRIPT DML: ADMINISTRADORA INICIAL
-- Banco: MySQL 8.0+
-- Descrição: Insere a administradora padrão do sistema
-- =====================================================

USE cardbrazil;

-- Inserir Administradora Principal
INSERT INTO administradoras (
    razao_social,
    nome_fantasia,
    cnpj,
    inscricao_estadual,
    telefone,
    email,
    site,
    status
) VALUES (
    'CardBrazil Administradora de Benefícios Ltda',
    'CardBrazil',
    '12.345.678/0001-90',
    '123.456.789.012',
    '(11) 3000-0000',
    'contato@cardbrazil.com.br',
    'www.cardbrazil.com.br',
    'ativo'
);

SELECT 'Administradora inicial criada com sucesso!' AS status;
