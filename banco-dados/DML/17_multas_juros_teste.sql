-- =====================================================
-- SCRIPT DML: MULTAS E JUROS - DADOS DE TESTE
-- Banco: MySQL 8.0+
-- =====================================================

USE cardbrazil;

-- Inserir 5 configurações de multas e juros
INSERT INTO configuracoes_multas_juros (
    id_administradora, nome, descricao,
    percentual_multa, valor_fixo_multa,
    percentual_juros_mensal, percentual_juros_diario, tipo_calculo_juros,
    dias_carencia,
    aplicar_multa, aplicar_juros,
    texto_padrao_boleto, texto_padrao_pix,
    pix_chave, pix_tipo_chave, pix_nome_recebedor, pix_cidade,
    ativo, padrao, created_by
) VALUES
-- Configuração PADRÃO
(1, 'Configuração Padrão', 'Configuração padrão para mensalidades e taxas', 
2.00, 0, 1.00, 0.0333, 'simples', 5, TRUE, TRUE,
'ATENÇÃO: Esta fatura está vencida. Multa de 2% e juros de 1% ao mês foram aplicados conforme contrato. Para regularizar sua situação, efetue o pagamento do valor atualizado.',
'Pagamento via PIX disponível. Multa de 2% e juros de 1% ao mês aplicados após o vencimento. Chave PIX: 12.345.678/0001-90',
'12.345.678/0001-90', 'cnpj', 'CARDBRAZIL ADMINISTRADORA', 'São Paulo',
TRUE, TRUE, 1),

-- Configuração para COPARTICIPAÇÃO
(1, 'Coparticipação', 'Configuração específica para coparticipações', 
1.50, 0, 0.50, 0.0167, 'simples', 3, TRUE, TRUE,
'Coparticipação vencida. Multa de 1,5% e juros de 0,5% ao mês aplicados. Regularize seu pagamento para manter seu plano ativo.',
'PIX disponível para pagamento de coparticipação. Multa: 1,5% | Juros: 0,5% a.m. Chave: 12.345.678/0001-90',
'12.345.678/0001-90', 'cnpj', 'CARDBRAZIL ADMINISTRADORA', 'São Paulo',
TRUE, FALSE, 1),

-- Configuração para ADESÃO
(1, 'Taxa de Adesão', 'Configuração para taxas de adesão', 
2.50, 0, 1.50, 0.0500, 'simples', 0, TRUE, TRUE,
'Taxa de adesão vencida. Multa de 2,5% e juros de 1,5% ao mês. Efetue o pagamento para ativar seu plano.',
'Pague sua taxa de adesão via PIX. Multa: 2,5% | Juros: 1,5% a.m. após vencimento. Chave PIX: 12.345.678/0001-90',
'12.345.678/0001-90', 'cnpj', 'CARDBRAZIL ADMINISTRADORA', 'São Paulo',
TRUE, FALSE, 1),

-- Configuração JUROS COMPOSTOS
(1, 'Juros Compostos', 'Configuração com juros compostos para débitos antigos', 
2.00, 0, 1.00, 0.0333, 'composto', 10, TRUE, TRUE,
'Débito antigo com juros compostos. Multa: 2% | Juros: 1% a.m. (compostos). Entre em contato para negociação.',
'Débito com juros compostos. Negocie via WhatsApp ou pague via PIX. Chave: 12.345.678/0001-90',
'12.345.678/0001-90', 'cnpj', 'CARDBRAZIL ADMINISTRADORA', 'São Paulo',
TRUE, FALSE, 1),

-- Configuração SEM MULTA (apenas juros)
(1, 'Apenas Juros', 'Configuração sem multa, apenas juros', 
0, 0, 0.80, 0.0267, 'simples', 7, FALSE, TRUE,
'Juros de 0,8% ao mês aplicados após 7 dias de carência. Sem aplicação de multa.',
'Pagamento via PIX sem multa. Juros: 0,8% a.m. após carência. Chave: 12.345.678/0001-90',
'12.345.678/0001-90', 'cnpj', 'CARDBRAZIL ADMINISTRADORA', 'São Paulo',
FALSE, FALSE, 1);

-- Inserir histórico de multas e juros aplicados
INSERT INTO historico_multas_juros (
    id_administradora, conta_receber_id, configuracao_id,
    dias_atraso, valor_original, valor_multa, valor_juros, valor_total,
    percentual_multa_aplicado, percentual_juros_aplicado,
    data_calculo, data_referencia, created_by
) VALUES
-- Histórico para contas vencidas
(1, 11, 1, 120, 450.00, 9.00, 22.50, 481.50, 2.00, 5.00, '2024-04-10', '2023-12-10', 1),
(1, 12, 1, 90, 450.00, 9.00, 13.50, 472.50, 2.00, 3.00, '2024-04-10', '2024-01-10', 1),
(1, 13, 2, 60, 350.00, 5.25, 10.50, 365.75, 1.50, 3.00, '2024-04-15', '2024-02-15', 1),
(1, 14, 1, 60, 450.00, 9.00, 9.00, 468.00, 2.00, 2.00, '2024-04-10', '2024-02-10', 1),
(1, 15, 1, 75, 200.00, 4.00, 6.00, 210.00, 2.00, 3.00, '2024-04-30', '2024-02-15', 1),
(1, 24, 1, 30, 45.00, 0.90, 1.35, 47.25, 2.00, 3.00, '2024-04-24', '2024-03-25', 1),
(1, 25, 1, 25, 22.50, 0.45, 0.56, 23.51, 2.00, 2.50, '2024-04-24', '2024-03-30', 1),

-- Histórico de recálculos (mesma conta, datas diferentes)
(1, 11, 1, 90, 450.00, 9.00, 13.50, 472.50, 2.00, 3.00, '2024-01-10', '2023-12-10', 1),
(1, 11, 1, 100, 450.00, 9.00, 15.00, 474.00, 2.00, 3.33, '2024-01-20', '2023-12-10', 1),
(1, 11, 1, 110, 450.00, 9.00, 18.00, 477.00, 2.00, 4.00, '2024-01-30', '2023-12-10', 1),

(1, 12, 1, 60, 450.00, 9.00, 9.00, 468.00, 2.00, 2.00, '2024-03-10', '2024-01-10', 1),
(1, 12, 1, 75, 450.00, 9.00, 11.25, 470.25, 2.00, 2.50, '2024-03-25', '2024-01-10', 1),
(1, 12, 1, 80, 450.00, 9.00, 12.00, 471.00, 2.00, 2.67, '2024-03-30', '2024-01-10', 1),

-- Histórico com diferentes configurações
(1, 13, 2, 30, 350.00, 5.25, 5.25, 360.50, 1.50, 1.50, '2024-03-16', '2024-02-15', 1),
(1, 13, 2, 45, 350.00, 5.25, 7.88, 363.13, 1.50, 2.25, '2024-03-31', '2024-02-15', 1),

(1, 14, 1, 30, 450.00, 9.00, 4.50, 463.50, 2.00, 1.00, '2024-03-11', '2024-02-10', 1),
(1, 14, 1, 45, 450.00, 9.00, 6.75, 465.75, 2.00, 1.50, '2024-03-26', '2024-02-10', 1),

(1, 15, 1, 60, 200.00, 4.00, 4.00, 208.00, 2.00, 2.00, '2024-04-15', '2024-02-15', 1),
(1, 15, 1, 70, 200.00, 4.00, 5.00, 209.00, 2.00, 2.50, '2024-04-25', '2024-02-15', 1);
