USE cardbrazil;

-- =====================================================
-- DADOS INICIAIS: Propostas de Exemplo
-- =====================================================

-- Buscar ID da administradora
SET @id_admin = (SELECT id FROM administradoras WHERE nome = 'CardBrazil' LIMIT 1);
SET @id_usuario_admin = (SELECT id FROM usuarios WHERE email = 'admin@cardbrazil.com.br' LIMIT 1);

-- Inserir propostas de exemplo
INSERT INTO propostas (
    id_administradora,
    nome_proponente,
    cpf_cnpj,
    email,
    telefone,
    empresa,
    numero_funcionarios,
    tipo_plano,
    valor_proposto,
    observacoes,
    status,
    score_financeiro,
    score_documentacao,
    score_historico
) VALUES
-- Proposta Pendente
(
    @id_admin,
    'João Silva',
    '123.456.789-00',
    'joao.silva@email.com',
    '(11) 98765-4321',
    'Tech Solutions Ltda',
    '11-50',
    'completo',
    450.00,
    'Empresa de tecnologia com 35 funcionários',
    'pendente',
    85,
    90,
    80
),

-- Proposta Em Análise
(
    @id_admin,
    'Maria Santos',
    '987.654.321-00',
    'maria.santos@email.com',
    '(11) 91234-5678',
    'Comércio ABC',
    '1-10',
    'ambulatorial',
    280.00,
    'Pequeno comércio familiar',
    'em_analise',
    75,
    85,
    70
),

-- Proposta Aprovada
(
    @id_admin,
    'Empresa XYZ Ltda',
    '12.345.678/0001-90',
    'contato@empresaxyz.com.br',
    '(11) 3456-7890',
    'Empresa XYZ Ltda',
    '51-100',
    'hospitalar',
    520.00,
    'Indústria com 75 funcionários',
    'aprovada',
    95,
    95,
    90
),

-- Proposta Rejeitada
(
    @id_admin,
    'Pedro Oliveira',
    '456.789.123-00',
    'pedro.oliveira@email.com',
    '(11) 99876-5432',
    NULL,
    '1-10',
    'odontologico',
    150.00,
    'Plano individual',
    'rejeitada',
    45,
    50,
    40
),

-- Proposta com Contrato Gerado
(
    @id_admin,
    'Indústrias Brasil S.A.',
    '98.765.432/0001-10',
    'rh@industriasbrasil.com.br',
    '(11) 2345-6789',
    'Indústrias Brasil S.A.',
    '101-500',
    'completo',
    680.00,
    'Grande indústria com 250 funcionários',
    'contrato_gerado',
    98,
    100,
    95
);

-- Atualizar propostas aprovadas/rejeitadas com dados de análise
UPDATE propostas 
SET analisado_por = @id_usuario_admin,
    data_analise = NOW(),
    parecer = 'Proposta aprovada após análise de documentação e histórico financeiro.'
WHERE status IN ('aprovada', 'contrato_gerado');

UPDATE propostas 
SET analisado_por = @id_usuario_admin,
    data_analise = NOW(),
    parecer = 'Proposta rejeitada devido a documentação incompleta.'
WHERE status = 'rejeitada';

-- Adicionar número de contrato para propostas com contrato gerado
UPDATE propostas 
SET numero_contrato = CONCAT('CONT-', YEAR(NOW()), '-', LPAD(id, 6, '0')),
    data_contrato = NOW()
WHERE status = 'contrato_gerado';

SELECT 'Propostas de exemplo inseridas com sucesso!' AS status;
SELECT COUNT(*) AS total_propostas FROM propostas WHERE deleted_at IS NULL;
